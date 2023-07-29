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
        console.log(r[0])
       // req.notify(null, events[0].short, "addQ", q[0]) // изменяем только одно поле
        return res.json(q[0]);
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
});


module.exports = router;
