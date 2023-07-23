
const http=require('http');
const WebSocket = require('ws');
const url = require('url');

const server=http.createServer()
const wss = new WebSocketServer({ noServer: true });
server.listen(7001);

ws.on('connection', (connection) => {
    console.log("connection")
})
