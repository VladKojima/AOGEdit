const http = require('http');
const path = require('path');
const fs = require('fs');

http.createServer((req, res) => {
    if (req.url == "/") {
        res.end(fs.readFileSync(path.resolve('./index.html')));
        return;
    }

    let p = path.resolve('.' + req.url);

    if (fs.existsSync(p))
        res.end(fs.readFileSync(p));
    else{
        res.statusCode = 404;
        res.end("NOT FOUND");
    }

}).listen(3000);