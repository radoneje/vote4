
class Socket {
    constructor(eventid) {
        this.socket = new WebSocket("wss://event-24.ru/ws");
        this.socket.onopen =  (e) =>{
            this.socket.send(JSON.stringify({cmd: "ping", eventid}))
        };
        this.socket.onerror =  (error) =>{
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
