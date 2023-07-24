const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res, next)=> {
res.render("index",{user: req.session.user})
})
router.get('/event/:id', (req, res, next)=> {
    res.render("event",{id:req.params.id})
})
router.get('/admin', (req, res, next)=> {
    res.render("admin",{ownerid:1})
})
router.get("/verify", async (req, res)=>{

    if(req.query.error)
        return res.render("index", {user:req.session.user})
    let dt=await(axios.get("https://oauth.vk.com/access_token/?client_id=51571826&client_secret=n7zOChnGVZv8clOYDhcx&redirect_uri=https://event-24.ru/verify&code="+req.query.code))
    let access_token=dt.data.access_token;
    let user_id=dt.data.user_id;
    let email=dt.data.email;
    if(!email)
        email="VKuser:"+dt.data.user_id;
    let users=await req.knex("t_users").where({vkid:user_id});
    if(users.length==0){
        dt=await(axios.get("https://api.vk.com/method/users.get?v=5.103&user_ids="+user_id+"&fields=sex&access_token="+access_token))
        let vkuser=dt.data.response[0];
        users=await req.knex("t_users").insert({isConfirmad:true,i:vkuser.first_name, f:vkuser.last_name,email:email, sex:vkuser.sex==2? true:false, vkid:user_id},"*")
    }

    if(users.length==0)
        res.render("index")

    req.session.user=users[0];

    res.redirect("/")
})

module.exports = router;
