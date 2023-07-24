
class SocketClass {
      send= async (cmd, value)=>{
         try {
             if(this.socket.readyState>1)
                 await reconnect(this.eventid)
             this.socket.send(JSON.stringify({cmd, value, id: this.id, eventid: this.eventid}))
         }
         catch (e) {
             console.warn(e)
         }
    }
    reconnect=(eventid)=>{
         return new Promise((resp, rej)=>{
        this.socket = new WebSocket("wss://event-24.ru/ws");
        this.socket.onopen =  (e) =>{
            this.socket.send(JSON.stringify({cmd: "ping", eventid}))
            resp();
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
         })
    }
    async constructor(eventid) {
         this.eventid=eventid;
        this.reconnect(eventid).then(()=>{
            console.log("connected!")
        })

    };
}
export default SocketClass
