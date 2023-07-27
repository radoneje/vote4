"use strict";

import chat from './classes/chatClass.js'
import SocketClass from './classes/socketClass.js'

let socket=null;
let app=new Vue({
    el:"#app",
    data:{
        user,
        event,
        q:[]
    },
    methods:{
        sendQ:async function (evnt) {
            let ctrl=qText;
            let text=ctrl.value;
            if(!text)
                return;
            console.log(text, user);
        },
        onMessage: async function (cmd, value) {
            if (cmd == "changeEvent" && this.event.id == value.id) {
                console.log("ChanngeEvent!", value)
                for (let key of Object.keys(value)) {
                    if (key != "id")
                        this.event[key] = value[key];
                }
            }
        },
        changeEvent: async function (event) {
            let r = await postJson("/api/event", event)
        },
        socketSend:function (cmd,data){
            socket.send(cmd, data)
        },
        update:async function (cmd,data){
            this.event=await getJson("/api/event/"+event.short)
            this.q=await getJson("/api/q/"+this.event.short)
        }

    },
    mounted:async function () {
        await this.update();
        socket = new SocketClass(this.event.short, null, this.onMessage)
    }

})
