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

module.exports = router;
