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
        },
        update:async function (cmd,data){
            this.event=await getJson("/api/event/"+event.short)
        }
    },
    mounted:async function () {
        await this.update();
        socket=new SocketClass(this.event.id)
    }

})
