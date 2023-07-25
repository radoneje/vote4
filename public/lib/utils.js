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
