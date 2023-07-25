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
            if(cmd=="changeEvent" && this.event.id==value.id){
                console.log("ChanngeEvent!", value)
                        for(let key of Object.keys(value)){
                            if(key!="id")
                                this.event[key]=value[key];
                        }
            }
        },
        changeEvent: async function (event, sect) {
            let dt={id:event.id};
            dt[sect]=event[sect]
            let r = await postJson("/api/changeEvent", event)
        },
        socketSend:function (cmd,data){
            socket.send(cmd, data)
        }
    },
    mounted:async function () {
        console.log("ready")
        socket=new SocketClass(this.event.id, document.getElementById("app").getAttribute("userid"), this.onMessage)
    }

})
