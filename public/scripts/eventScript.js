"use strict";

import chat from './classes/chatClass.js'

let app=new Vue({
    el:"#app",
    data:{
        eventid:document.getElementById("app").getAttribute("eventid")
    },
    mounted:async function () {
        console.log("ready")
        let chatItem=new chat(11,"text", "Иван Иванов", new Date, "answer")
    }

})
