
const http=require('http');
const WebSocket = require('ws');
const url = require('url');

const server=http.createServer()
const wss =  new WebSocket.Server({ noServer: true });
server.listen(7001);
server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = url.parse(request.url);
    console.log(pathname)
    if (pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    }
});


wss.on('connection', (ws) => {
    console.log("connection")
    ws.on('message',  (data) =>{
        console.log('received: %s', data);
    });
})
