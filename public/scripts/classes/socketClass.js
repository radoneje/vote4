
class SocketClass {
    reconnect=(eventid, userid)=>{
         return new Promise((resp, rej)=>{
        this.socket = new WebSocket("wss://event-24.ru/ws");
        this.socket.onopen =  (e) =>{
            this.socket.send(JSON.stringify({cmd: "ping", eventid, userid}))
            resp();
        };
        this.socket.onerror =  (error) =>{
            console.log(error);

            setTimeout(async()=>{
                console.log("try reconnect");
                this.reconnect(eventid, userid)
            },1000)
        };
        this.socket.onmessage = (msg) => {
            try {

                const data = JSON.parse(msg.data);
                if(data.cmd=="pong"){
                    this.id=data.id;
                }
                console.log(data, this.id, app)
                if(data.cmd=="updateEvent" && typeof (app)!="undefined" && app.onUpdateEvent){
                    app.onUpdateEvent(value);
                }
            } catch (e) {
                console.warn(e)
            }
        };
         })
    }
     constructor(eventid, userid=null) {
         this.eventid=eventid;
         this.userid=userid
        this.reconnect(eventid, userid).then(()=>{
            console.log("connected!")
        })

    };
    send= async (cmd, value)=>{
        try {
            if(this.socket.readyState>1)
                await this.reconnect(this.eventid, this.userid)
            this.socket.send(JSON.stringify({cmd, value, id: this.id, eventid: this.eventid}))
        }
        catch (e) {
            console.warn(e)
        }
    }
}
export default SocketClass
