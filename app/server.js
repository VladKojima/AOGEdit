const http = require('http');
const path = require('path');
const fs = require('fs');
const pg = require('pg');

let requests = {
    "list": (res)=>{
        res.statusCode = 200;
        res.end(JSON.stringify(["1", "2", "3"]));
    },

    "add": (res, args){
        res.statusCode = 200;

    }
}

http.createServer((req, res) => {
    if (req.url == "/") {
        res.end(fs.readFileSync(path.resolve('./index.html')));
        return;
    }

    if (req.url.startsWith("/api/")) {
        let command = req.url.substring(5).split("?");

        requests[command[0]](res, command[1]);

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