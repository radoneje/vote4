var express = require('express');
var router = express.Router();

router.post('/event', (req, res, next)=> {
 res.json({id:1})
})


module.exports = router;
