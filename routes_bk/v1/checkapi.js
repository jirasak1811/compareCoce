var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('v1/checkapi')
});
module.exports = router;