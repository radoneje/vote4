const WebSocket = require('ws');
const ws = new WebSocket.Server({
    port: 7001,
});
ws.on('connection', (connection) => {
    console.log("connection")
})
