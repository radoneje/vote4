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
        urlify,
        ReqUser:async function (clbk){
            await createPopUp('/popups/reguser/'+event.short, async ()=>{
                document.querySelector(".fullScreenBoxTitle").innerHTML="Пожалуйста, зарегистрируйтесь";
                let r=await fetch('/popups/reqForm/'+event.short);
                if(!r.ok)
                {
                    console.warn("error fetch")
                    return
                }
                document.querySelector(".fullScreenBoxBody").innerHTML=(await r.text())
                let name=document.getElementById("name")
                    name.focus();
                window.login=async ()=>{
                    let res=await eventLogin(this.event.short)
                    if(res) {
                        this.user=res;
                        closePopUp()
                        clbk();
                    }
                }
            })
        },
        sendQ:async function (evnt) {

            const postQ=async (text)=>{
                let q=await postJson("/api/q", {eventshort:this.event.short, text});
            }
            evnt.target.classList.add("sending");
            try {
                let ctrl = qText;
                let text = ctrl.value;
                if (!text) {
                    ctrl.focus();
                    return;
                }
                if (!this.user) {
                    await this.ReqUser(async () => {
                        await postQ(text)
                        evnt.target.classList.remove("sending");
                        ctrl.value="";
                    })
                } else {
                    await postQ(text)
                    evnt.target.classList.remove("sending");
                    ctrl.value="";
                }
            }
            catch (e) {
                console.warn(e)
                evnt.target.classList.remove("sending");

            }



        },
        postQ:async function(text){},
        onMessage: async function (cmd, value) {
            console.log("onMessage", cmd)
            if (cmd == "changeEvent" && this.event.id == value.id) {
                for (let key of Object.keys(value)) {
                    if (key != "id")
                        this.event[key] = value[key];
                }
            }
            if (cmd == "addQ" && this.event.short == value.eventshort) {
                this.q.push(value);
                this.q=this.filterQ(q);

                setTimeout(()=>{
                    let elem=document.getElementById("q"+value.id)
                    if(elem)
                        elem.scrollIntoView({behavior: "smooth" });
                },500)
            }
            if (cmd == "changeQ" ) {
                this.q.forEach(item=>{
                    if(item.id==value.id)
                        for (let key of Object.keys(value)) {
                            if (key != "id")
                                item[key] = value[key];

                        }
                })
                this.q=this.filterQ(this.q);
            }

        },
        changeEvent: async function (event) {
            let r = await postJson("/api/event", event)
        },
        socketSend:function (cmd,data){
            socket.send(cmd, data)
        },
        filterQ:function(q){
            q=q.filter(qq=>{
                if(qq.isDeleted)
                    return false
                if((!this.user && !qq.isMod))
                    return false

                if(this.user && (qq.userid!=this.user.id && !qq.isMod))
                        return false
                return true;
            })
            return q;
        },
        update:async function (cmd,data){
            this.event=await getJson("/api/event/"+event.short)
            this.q=this.filterQ( await getJson("/api/q/"+this.event.short))

        },
        qLike:async function (item){
            if(localStorage.getItem("qLike"+item.id)){
                console.log("remove")
                localStorage.removeItem("qLike"+item.id)
            }
            else{
                console.log("set")
                localStorage.setItem("qLike"+item.id, new Date())
            }
            this.$forceUpdate();

        },
        qIsLike:function(item){
            console.log("qIsLike")
            return (localStorage.getItem("qLike"+item.id))
        },
        qIsDisLike:function(item){
            return (localStorage.getItem("qDisLike"+item.id))
        }

    },

    mounted:async function () {
        await this.update();
        socket = new SocketClass(this.event.short, null, this.onMessage)
    }

})
