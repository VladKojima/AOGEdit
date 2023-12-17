const http = require('http');
const path = require('path');
const fs = require('fs');
const pg = require('pg');
const { env } = require('process');

let client = new pg.Client({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: "postgres",
    password: env.DB_PASSWORD,
    port: 5432
});

let requests = {
    "list": async (res) => {
        res.statusCode = 200;

        let data = (await client.query("SELECT * FROM saves")).rows;

        res.end(JSON.stringify(data));
    },

    "loadSave": async (res, args) => {
        if (!args || !("id" in args)) {
            res.statusCode = 400;
            res.end('Invalid arguments');
            return;
        }


    },

    "addSave": async (res, args, body) => {
        if (!args || !("title" in args)) {
            res.statusCode = 400;
            res.end('Invalid arguments');
            return;
        }

        try {
            let saveId = (await client.query({ text: "select addsave($1)", values: [args['title']] })).rows[0]['addsave'];

            let idMap = {};

            for (let wrapper of body) {
                idMap[wrapper.id] = (await client.query({ text: 'select addin($1, $2, $3, $4)', values: [wrapper.name, wrapper.event.multiplier, saveId, wrapper.isOut] })).rows[0]['addin'];
            }

            for (let wrapper of body.filter(x => x.type == 'Event')) {
                client.query({ text: 'insert into event_to_event(event, toevent) values ($1, $2)', values: [idMap[wrapper.event.value], idMap[wrapper.id]] });
            }

            for (let wrapper of body.filter(x => x.type == 'And')) {
                for (let id of wrapper.event.events)
                    client.query({ text: 'insert into event_to_and(event, toevent) values ($1, $2)', values: [idMap[id], idMap[wrapper.id]] });
            }

            for (let wrapper of body.filter(x => x.type == 'Or')) {
                console.log(wrapper);
                for (let id of wrapper.event.events)
                    client.query({ text: 'insert into event_to_or(event, toevent) values ($1, $2)', values: [idMap[id], idMap[wrapper.id]] });
            }

            res.statusCode = 200;
            res.end(JSON.stringify(saveId));
            return;
        }
        catch (err) {
            if (err.code === '23505') {
                res.status = 400;
                res.end('duplicate');
                return;
            }

            res.status = 500;

            res.end('Some error');
        }
    },

    "delSave": async (res, args) => {
        if (!args || !("id" in args)) {
            res.statusCode = 400;
            res.end('Invalid arguments');
            return;
        }

        try {
            await client.query({ text: "delete from saves values where id = $1", values: [args['id']] });
        }
        catch (err) {
            res.end(err.code);
            return;
        }

        res.status = 200;
        res.end();

        return;
    }
}

async function init() {

    await client.connect();

    http.createServer(async (req, res) => {
        if (req.url == "/") {
            res.end(fs.readFileSync(path.resolve('./index.html')));
            return;
        }

        if (req.url.startsWith("/api/")) {
            let command = req.url.substring(5).split("?");

            if (!(command[0] in requests)) {
                res.statusCode = 400;
                res.end('invalid command');
                return;
            }

            let data = '{}';

            req.on('data', (a) => data = a.toString());

            await new Promise(con => req.on('end', con));

            data = JSON.parse(data);

            requests[command[0]](res, command[1] ? Object.fromEntries(command[1].split("&").map(x => x.split("="))) : undefined, data);

            return;
        }

        let p = path.resolve('.' + req.url);

        if (fs.existsSync(p))
            res.end(fs.readFileSync(p));
        else {
            res.statusCode = 404;
            res.end("NOT FOUND");
        }

    }).listen(3000);

}

init();