const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res, next)=> {
res.render("index",{user: req.session.user})
})
router.get('/logout', (req, res, next)=> {
    req.session.user=null;
    res.redirect("/")
})
router.get('/error', (req, res, next)=> {
    res.render("error")
})
router.get('/404', (req, res, next)=> {
    res.render("404")
})

router.get('/userEvent', async (req, res, next)=> {
    try {
    if(!req.session.user)
        return res.redirect("/404");
    let events=await req.knex("t_events").where({userid:req.session.user.id, isDeleted:false}).orderBy("id", "desc")
        if(events.length==0)
            events=await req.knex("t_events").insert({userid:req.session.user.id}, "*");
        res.redirect('/eventAdmin/'+events[0].short);
    }
    catch (e) {
        console.warn(e)
        res.render("error")
    }
})
router.get('/eventAdmin/:short', async (req, res, next)=> {
    try {
        if(!req.session.user)
            return res.redirect("/404");
        let events=await req.knex("t_events").where({short:req.params.short, isDeleted:false}).orderBy("id", "desc")
        if(events.length==0)
           return res.redirect("/404")
        let event=events[0];
        if(event.userid==req.session.user.id || req.session.user.isAdmin)
          return  res.render("eventAdmin", {event, user:req.session.user});

        res.redirect("/404")

    }
    catch (e) {
        console.warn(e)
        res.render("error")
    }
})

router.get('/event/:id', (req, res, next)=> {
    res.render("event",{id:req.params.id})
})

router.get('/admin', (req, res, next)=> {
    res.render("admin",{ownerid:1})
})
router.get("/verify", async (req, res)=>{

    try {
        if (req.query.error)
            return res.render("index", {user: req.session.user})
        let dt = await (axios.get("https://oauth.vk.com/access_token/?client_id=51571826&client_secret=n7zOChnGVZv8clOYDhcx&redirect_uri=https://event-24.ru/verify&code=" + req.query.code))
        let access_token = dt.data.access_token;
        let user_id = dt.data.user_id;
        let email = dt.data.email;
        if (!email)
            email = "VKuser:" + dt.data.user_id;
        let users = await req.knex("t_users").where({vkid: user_id});
        if (users.length == 0) {
            dt = await (axios.get("https://api.vk.com/method/users.get?v=5.103&user_ids=" + user_id + "&fields=sex&access_token=" + access_token))
            let vkuser = dt.data.response[0];
            users = await req.knex("t_users").insert({
                isConfirmad: true,
                i: vkuser.first_name,
                f: vkuser.last_name,
                email: email,
                sex: vkuser.sex == 2 ? true : false,
                vkid: user_id
            }, "*")
        }

        if (users.length == 0)
            res.render("index")

        req.session.user = users[0];

        res.redirect("/")
    }
    catch (e) {
        console.warn(e)
        res.render("error")
    }
})
router.get("/verifyYandex", async (req, res)=> {
//?code=6171931
    try{
    if (!req.query.code)
        return res.render("index", {user: req.session.user})
    let ret=await axios.post("https://oauth.yandex.ru/token",{
        code:req.query.code,
        grant_type:"authorization_code"
    },{
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic "+btoa("57af4e88aaba4dbca54489858932356f"+":"+"0f5978a15c9849bdad5ae74e7b329fe5")
        }
    })

    let access_token=ret.data.access_token;
    let info=await axios.get("https://login.yandex.ru/info?format=json",{
        headers: {
            "Authorization": "OAuth "+access_token
        }
    })
    let dt=[];
    let user_id=info.data.id;
    let email=info.data.default_email;
    if(!email)
        email="YAuser:"+dt.data.id;
    let users=await req.knex("t_users").where({yaid:user_id});
    if(users.length==0){

        users=await req.knex("t_users").insert({isConfirmad:true, i:info.data.first_name, f:info.data.last_name,email:email, sex:info.data.sex=='male'? true:false, yaid:user_id},"*")
    }
    if(users.length==0)
        res.render("index", {user:req.session.user})

    req.session.user=users[0];

    res.redirect("/")
    }
    catch (e) {
        console.warn(e)
        res.render("error")
    }

});
router.get("/file/:guid", async (req, res)=> {
//?code=6171931
    try{
        let r=await req.knex("t_files").where({guid:req.params.guid})
        if(r.length==0)
            return res.render(404)
        if( req.query.download)
            return res.download(r[0].path, r[0].originalname)
        res.sendFile(r[0].path)

    }
    catch (e) {
        console.warn(e)
        res.render("error")
    }

});
router.get("/u/:guid", async (req, res)=> {
//?code=6171931
    try{
        let events=await req.knex("t_events").where({short:req.params.guid})
        if(events.length==0)
            return res.render("404")
        let event=events[0]
        console.log("u->"+event.short, req.session[event.short])
       if(!req.session[event.short] && event.isReg)
           return res.render("eventLogin", {event})
        return res.render("event", {event, user:req.session[event.short]})


    }
    catch (e) {
        console.warn(e)
        res.render("error")
    }

});
router.post("/eventLogin", async (req, res)=> {
    try {
        let r=await req.knex("t_eventUsers").insert(req.body, "*")
        req.session[r[0].eventshort]=r[0];
        console.log("eventLogin->"+r[0].eventshort, req.session[r[0].eventshort])
        res.json(r[0])
    }
    catch (e) {
        console.warn(e)
        res.render("error")
    }

});
router.get("/eventLogout/:guid", async (req, res)=> {
//?code=6171931
    try{
        req.session[req.params.guid]=null;
        res.redirect("/u/"+req.params.guid)
    }
    catch (e) {
        console.warn(e)
        res.render("error")
    }

});
router.get("/popups/index", async (req, res)=> {
//?code=6171931
    try{

        res.render("popups/index")
    }
    catch (e) {
        console.warn(e)
        res.render("error")
    }

});
router.get("/popups/reqForm/:short", async (req, res)=> {

    try{
        let events=await req.knex("t_events").where({short:req.params.short})
        if(events.length==0)
            return res.render("404")
        let event=events[0]
        res.render("elems/regForm.pug",{event})
    }
    catch (e) {
        console.warn(e)
        res.render("error")
    }

});




module.exports = router;
