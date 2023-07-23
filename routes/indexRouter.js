var express = require('express');
var router = express.Router();

router.get('/', (req, res, next)=> {
res.render("index")
})
router.get('/event/:id', (req, res, next)=> {
    res.render("event",{id:req.params.id})
})
router.get('/admin', (req, res, next)=> {
    res.render("admin",{ownerid:1})
})

module.exports = router;
