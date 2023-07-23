
class Socket {
    constructor(eventid) {
        this.socket = new WebSocket("wss://event-24.ru/ws");
        this.socket.onopen = function (e) {
            socket.send(JSON.stringify({cmd: "ping", eventid}))
        };
        this.socket.onerror = function (error) {
            console.log(error);
        };
        this.socket.onmessage = (msg) => {
            try {
                const data = JSON.parse(msg.data);
                console.log(data)
            } catch (e) {
                console.warn(e)
            }
        };
    };
}
export default Socket
