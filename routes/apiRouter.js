const express = require('express');
const router = express.Router();
const config = require('../config.json');
const multer = require('multer')
const upload = multer({dest: config.uloadPath});
const path = require('path')
const fs = require('fs')

router.post('/event', async (req, res, next) => {
    try {
        if (!req.body.id) {
            let dt = (await req.knex("t_events").insert(req.body, "*"))[0]
            req.notify("1", null, "newEvent", dt)
            return res.json(dt);


        }
        let id = req.body.id
        delete req.body.id;
        let dt = (await req.knex("t_events").update(req.body, "*").where({id}))[0]
        req.notify("1", null, "updateEvent", dt)
        res.json(dt)
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
})
router.post('/changeEvent', async (req, res, next) => {
    try {
        if (!req.body.id)
            return res.json(null);
        let id = req.body.id
        delete req.body.id;
        let dt = (await req.knex("t_events").update(req.body, "*").where({id}))[0]
        //  req.notify("1", null, "updateEvent", dt) // обновляем все
        req.body.id = id;
        req.notify(null, dt.short, "changeEvent", req.body) // изменяем только одно поле
        res.json(true)
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
})

router.get('/event', async (req, res, next) => {
    try {
        return res.json(await req.knex("t_events").where({isDeleted: false}).orderBy("id", 'desc'));
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
})
router.get('/event/:short', async (req, res, next) => {
    try {
        let r = await req.knex("t_events").where({
            isDeleted: false,
            short: req.params.short
        }).orderBy("id", 'desc');
        if (r.length == 0)
            return res.sendStatus(404)
        res.json(r[0])
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
})
router.get('/q/:short',  async function (req, res, next) {

    try {
        return res.json(await req.knex("v_q").where({isDeleted: false, eventshort:req.params.short}));
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
});
router.get('/event', async (req, res, next) => {
    try {
        return res.json(await req.knex("t_events").where({isDeleted: false}).orderBy("id", 'desc'));
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
})
router.post('/q/',  async function (req, res, next) {

    try {
        let user=req.session[req.body.eventshort]
        if(!user)
            return res.sendStatus(401);
        let events = await req.knex("t_events").where({isDeleted:false, short:req.body.eventshort})
        if(events.length==0)
            return res.sendStatus(404)
        req.body.eventshort=events[0].short;
        req.body.userid=user.id;
        req.body.text=req.body.text.replace(/(<([^>]+)>)/gi, "")
        req.body.isMod=! events[0].isQpreMod;
        let r=await req.knex("t_q").insert(req.body, "*")
        let q=await req.knex("v_q").where({isDeleted: false, id:r[0].id})
        console.log(q[0])
        req.notify(null, events[0].short, "addQ", q[0]) // изменяем только одно поле
        return res.json(q[0]);
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
});
router.post('/changeQ',  async function (req, res, next) {

    try {
        if(!req.session.user)
            return res.sendStatus(401);
        let id=req.body.id;
        delete req.body.id;
        let r=await req.knex("t_q").update(req.body,"*").where({id})
        req.body.id=id;
        req.notify(null, r[0].eventshort, "changeQ", req.body)
        res.json(id)
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
});

router.post('/changeAllQ',  async function (req, res, next) {

    try {
        if(!req.session.user)
            return res.sendStatus(401);
        let dt={}
        dt[req.body.dt.key]=req.body.dt.value
        let r=await req.knex("t_q").update(dt, "*").where({eventshort:req.body.eventshort})
        r.forEach(rr=>{
            dt.id=rr.id
            req.notify(null, rr.eventshort, "changeQ", dt)
        })
        res.json(r.length)
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
});

router.post('/qLike/',  async function (req, res, next) {

    try {
        let user=req.session[req.body.eventshort]
        if(!user)
            return res.sendStatus(401);
        let table="t_qLikes";
        if(req.body.method=="qDisLike")
             table="t_qDisLikes";

        let dt={qid:req.body.id}
        dt.value=req.body.like?-1:1
        dt.eventuserid=user.id;
        let like=await req.knex(table).insert(dt, "*");
        let ret=await req.knex("t_q").where({id:req.body.id})
        let r={id:ret[0].id, likes:ret[0].likes, unlikes:ret[0].unlikes}

        req.notify(null, req.body.eventshort, "changeQ", r) // изменяем только одно поле
        return res.json(like[0].id);
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
});


module.exports = router;
