var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    //console.log(req.user);
    res.render('v1/signin', {
        //title: 'eTBS',
        //config: config
    });
});

module.exports = router;
