
const http=require('http');
const WebSocket = require('ws');
const url = require('url');
const { uuid } = require('uuidv4');

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

function heartbeat() {
    this.isAlive = true;
}
wss.on('connection', (ws) => {
    console.log("connection")
    ws.isAlive = true;
    ws.on('error', console.error);
    ws.on('pong', heartbeat);
    ws.on('message',  (data) =>{

        try{
            data=JSON.parse(data)
            if(data.cmd=="ping" && ws.readyState === WebSocket.OPEN) {
                ws.id=uuid();
                ws.send(JSON.stringify({cmd: "pong", id:ws.id}))
            }
            console.log('received: %s', data);
        }
        catch (e){
            console.warn(e)
        }

    });
})
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);
wss.on('close', function close() {
    clearInterval(interval);
});
