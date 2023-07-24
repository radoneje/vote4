var express = require('express');
var router = express.Router();

router.post('/event', async (req, res, next)=> {
try {
 if (!req.body.id) {
  return res.json((await req.knex("t_events").insert(req.body, "*"))[0]);
 }

 let id = req.body.id
 delete req.body.id;
 res.json((await req.knex("t_events").update(req.body, "*").where({id}))[0])
}
catch (e) {
 console.warn(e);
 res.json(null)
}
})

router.get('/event', async (req, res, next)=> {
 try {
  return res.json(await req.knex("t_events").orderBy("id"));
 }
 catch (e) {
  console.warn(e);
  res.json(null)
 }
})


module.exports = router;
