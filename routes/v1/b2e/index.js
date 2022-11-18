var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'index' });
  res.redirect('/b2e/schedules');
});

module.exports = router;
