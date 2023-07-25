"use strict";

import chat from './classes/chatClass.js'
import SocketClass from './classes/socketClass.js'

let socket=null;
let app=new Vue({
    el:"#app",
    data:{
        section:"design",
        event,
    },
    methods:{
        onMessage:async function(cmd, value)
        {
            if(cmd=="updateEvent" && this.event.id==value.id){
                        for(let key of Object.keys(value)){
                            if(key!="id")
                                this.event[key]=value[key];
                        }
            }
        },
        changeEvent: async function (event) {
            let r = await postJson("/api/event", event)
        },
        socketSend:function (cmd,data){
            socket.send(cmd, data)
        }
    },
    mounted:async function () {
        console.log("ready")
        socket=new SocketClass(this.eventid, document.getElementById("app").getAttribute("userid"), this.onMessage)
    }

})
