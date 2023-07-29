"use strict";

window.getJson=async (url)=>{
    let r=await fetch(url)
    if(! r.ok)
        return null;
    return await r.json();
}
window.postJson=async (url, data)=>{
    let r=await fetch(url,{
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data),
    })
    if(! r.ok)
        return null;
    return await r.json();
}
window.copyElement=async (elem)=>{
    await navigator.clipboard.writeText(elem.innerText)
    elem.parentNode.classList.add("copied");
    setTimeout(()=>{elem.parentNode.classList.remove("copied");},1000)
}
window.download=(href, filename)=>{
    let a=document.createElement("a")
    a.style.display="node"
    a.download=filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{
        document.body.removeChild(a)
    },1000)

}
window.validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
window.createPopUp = async (url,clbk=null) => {
    document.querySelectorAll(".closePopUp").forEach(e=>{
        e.onclick=()=>{closePopUp()}
    })
    let r=await fetch("/popups/index")
    if(!r.ok){
        console.warn("fetch error", '"/popups/index"');
    }
    let div=document.createElement("div");
    div.innerHTML=(await r.text())
    div.classList.add("fullScreen")
    document.body.appendChild(div)
    document.body.style.overflow="hidden";
    document.querySelectorAll(".closePopUp").forEach(e=>{
        e.onclick=()=>{closePopUp()}
    })
    if(clbk)
        clbk();
}
window.closePopUp=()=>{
    document.querySelectorAll(".fullScreen").forEach(e=>{
        document.body.removeChild(e)
    })
    document.body.style.overflow=null;
}
window.eventLogin=async(eventshort)=>{
        formError.style.display = "none";
        let dt={eventshort};
        document.querySelectorAll("input[name]").forEach(e => {
            e.classList.remove("error")
            if (!e.value || e.value.length < 2) {
                e.classList.add("error")
                return;
            }
            let name=e.getAttribute("name")
            if(name=="email"){
                if(!validateEmail(e.value))
                    e.classList.add("error");
            }
            if (name == "phone") {
                if (e.value.length<8)
                    e.classList.add("error");
            }
            dt[name]=e.value;

        })
        let err = document.querySelector(".error")
        if (err) {
            formError.style.display = "block"
            return err.focus();
        }
        let res=await postJson("/eventLogin/", dt)
        return res;

}

