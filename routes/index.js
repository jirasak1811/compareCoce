var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/api/v1/signin');
});

module.exports = router;
