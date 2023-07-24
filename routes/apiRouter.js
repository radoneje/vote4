var express = require('express');
var router = express.Router();

router.post('/event', async (req, res, next)=> {
 if(!req.body.id)
 {
  return (await req.knex("t_events").insert(req.body, "*"))[0];
 }

 let id=req.body.id
 delete req.body.id;
 return (await req.knex("t_events").update(req.body, "*").where({id}))[0]
})


module.exports = router;
