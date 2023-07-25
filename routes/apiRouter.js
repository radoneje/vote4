var express = require('express');
var router = express.Router();

router.post('/event', async (req, res, next) => {
    try {
        if (!req.body.id) {
            let dt = (await req.knex("t_events").insert(req.body, "*"))[0]
            req.notify("1", null, "newEvent", dt)
            return res.json(dt);


        }
        let id = req.body.id
        delete req.body.id;
        let dt=(await req.knex("t_events").update(req.body, "*").where({id}))[0]
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
        let dt=(await req.knex("t_events").update(req.body, "*").where({id}))[0]
        req.notify("1", null, "updateEvent", dt) // обновляем все
        req.body.id=id;
        req.notify(null, id, "changeEvent", req.body) // изменяем только одно поле
        res.json(dt)
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
})

router.get('/event', async (req, res, next) => {
    try {
        return res.json(await req.knex("t_events").where({isDeleted:false}).orderBy("id", 'desc'));
    } catch (e) {
        console.warn(e);
        res.json(null)
    }
})


module.exports = router;
