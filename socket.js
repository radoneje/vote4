
const http=require('http');
const WebSocket = require('ws');
const url = require('url');

const server=http.createServer()
//const wss = new WebSocket({ noServer: true });
server.listen(7001);
server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = url.parse(request.url);
    console.log(pathname)
});


/*ws.on('connection', (connection) => {
    console.log("connection")
})*/
