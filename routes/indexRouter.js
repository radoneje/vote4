var express = require('express');
var router = express.Router();

router.get('/', (req, res, next)=> {
res.render("index")
})
router.get('/event/:id', (req, res, next)=> {
    res.render("event",{id:req.params.id})
})
router.get('/test', (req, res, next)=> {
    res.render("test",{id:req.params.id})
})

module.exports = router;
