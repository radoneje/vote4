"use strict";

import chat from './classes/chatClass.js'
import SocketClass from './classes/socketClass.js'

let socket=null;
let app=new Vue({
    el:"#app",
    data:{
        user,
        event,

    },
    methods:{
        changeEvent: async function (event) {
            let r = await postJson("/api/event", event)
        },
        socketSend:function (cmd,data){
            socket.send(cmd, data)
        }
    },
    mounted:async function () {
        console.log("ready")
        let chatItem=new chat(11,"text", "Иван Иванов", new Date, "answer")
        socket=new SocketClass(this.eventid)
    }

})
