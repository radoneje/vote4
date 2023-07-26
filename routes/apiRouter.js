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
        let r = res.json(await req.knex("t_events").where({
            isDeleted: false,
            short: req.params.short
        }).orderBy("id", 'desc'));
        if (r.length == 0)
            return res.sendStatus(404)
        r.json(r[0])
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
})
router.post('/uploadFile', upload.single('file'), async function (req, res, next) {

    let ext = path.extname(req.file.originalname)
    let newPath = req.file.path + ext
    await fs.promises.rename(req.file.path, newPath)
    req.file.path = newPath;
    req.file.filename = req.file.filename + ext;
    req.file.originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
    let r = await req.knex("t_files").insert(req.file, "*")
    res.json(r[0].guid)
});


module.exports = router;
