
class SocketClass {
     send=(cmd, value)=>{
         try {
             console.log(this.socket)
             this.socket.send(JSON.stringify({cmd, value, id: this.id, eventid: this.eventid}))
         }
         catch (e) {
             console.warn(e)
         }
    }
    reconnect=(eventid)=>{
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
                if(data.cmd=="pong"){
                    this.id=data.id;
                }
                console.log(data, this.id)
            } catch (e) {
                console.warn(e)
            }
        };
    }
    constructor(eventid) {
         this.eventid=eventid;
         this.reconnect(eventid)

    };
}
export default SocketClass
