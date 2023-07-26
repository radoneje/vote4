"use strict";

import chat from './classes/chatClass.js'
import SocketClass from './classes/socketClass.js'

let socket = null;
let app = new Vue({
    el: "#app",
    data: {
        section: "design",
        event,
    },
    methods: {
        uploadFile: async function (evnt, clbk) {
            let inp = document.createElement("input")
            inp.type = "file"
            inp.accept = "image/png, image/jpeg"
            inp.style.display = "none"
            document.body.appendChild(inp)
            inp.click()
            inp.onchange = async () => {
                document.body.removeChild(inp)
                let file = inp.files[0]
                let formData = new FormData()
                formData.append('file', file, file.name);
                let xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/uploadFile');
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                let progress = evnt.target.parentNode.querySelector(".progress")
                xhr.upload.addEventListener("load", function () {
                    if (progress)
                        setTimeout(() => {

                            progress.style.width = 0;
                        }, 2000)
                });
                xhr.upload.addEventListener("progress", function (event) {
                    if (event.lengthComputable && progress) {
                        var complete = (event.loaded / event.total * 100 | 0);
                        progress.style.width= complete + '%';
                    }
                });
                xhr.onload = xhr.onerror = function () {
                    if (this.status == 200) {
                       // resVariable[sect] = "/file/" + JSON.parse(xhr.response)
                        if (clbk)
                            clbk("/file/" + JSON.parse(xhr.response))
                    } else {

                    }
                };
                xhr.send(formData);
            }
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
        changeEvent: async function (event, sect) {
            let dt = {id: event.id};
            dt[sect] = event[sect]
            let r = await postJson("/api/changeEvent", dt)
        },
        socketSend: function (cmd, data) {
            socket.send(cmd, data)
        }
    },
    mounted: async function () {
        console.log("ready")
        socket = new SocketClass(this.event.short, document.getElementById("app").getAttribute("userid"), this.onMessage)
    }

})
