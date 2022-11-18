var express = require('express');
var router = express.Router();
var session = require('express-session');
var database = require('./database');
var conn = database.getConnectionTBS();

/* GET home page. */
router.get('/', function (req, res, next) {
  select_query((data) => {
    if (data.data[0]["EnableSSL"] == 1) {
      EnableSSL = "Yes"
    } else {
      EnableSSL = "No"
    }
    res.render('v1/b2e/setting_smtp', {
      title: 'SMTP',
      SmtpHost: data.data[0]["SmtpHost"],
      SmtpPort: data.data[0]["SmtpPort"],
      EnableSSL: EnableSSL,
      CRDAccount: data.data[0]["CRDAccount"],
      EmailSubject: data.data[0]["EmailSubject"],
      EmailBody: data.data[0]["EmailBody"],
      FromAddr: data.data[0]["FromAddr"],
      FromName: data.data[0]["FromName"], 
      login_name: req.signedCookies.login_name
    });
  });
});


function select_query(cb) {
  var sql = "SELECT * FROM Email_Configure";
  //var conn = database.getConnectionTBS();
  var rs = {};
  conn = database.getConnectionTBS();

  conn.query(sql, function (err, result) {
    conn.end();
    rs["data"] = result;
    cb(rs);
  });
}
module.exports = router;
