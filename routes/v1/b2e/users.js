var express = require('express');
var router = express.Router();
var moment = require('../../../public/theme/madmin-v5.2/vendors/moment/moment.js');
var session = require('express-session');
var database = require('./database');
var conn = database.getConnectionTBS();

router.get('/', function (req, res, next) {
  res.clearCookie('login_name');
  res.clearCookie('login_extension');
  res.clearCookie('login_type');
  res.render('v1/b2e/login');
});

router.get('/logout', function (req, res, next) {
  res.clearCookie('login_name');
  res.clearCookie('login_extension');
  res.clearCookie('login_type');
  res.render('v1/b2e/login');
});

router.post('/login/:username/:password', function (req, res, next) {
  login_query(req.params.username, req.params.password, (data) => {
    if (data["status"] == "success") {
      res.cookie('login_name', data["data"][0]["Extension"], { signed: true, maxAge: 86400000 });
      res.cookie('login_extension', data["data"][0]["Name"], { signed: true, maxAge: 86400000 });
      res.cookie('login_type', data["data"][0]["Type"], { signed: true, maxAge: 86400000 });
    }
    res.json(data);
  });
});

function login_query(user, pass, cb) {
  var rs = {};
  //var conn = database.getConnectionTBS();
  if (conn) {
    session_destroy();
    var sql = "SELECT Extension, Name, Type FROM Users ";
    sql += "WHERE UserName = '" + user + "' ";
    sql += "AND Password = '" + pass + "' ";
    conn.query(sql, function (err, result) {
      if (err) {
        rs["status"] = "failure";
        rs["sql"] = sql;
        rs["data"] = "Can not query";
      } else if (result.length <= 0) {
        rs["status"] = "failure";
        rs["sql"] = sql;
        rs["data"] = "Not result";

      } else {
        rs["status"] = "success";
        rs["data"] = result;

        if (result["Type"] == "Admin") {
          session.login_name = result["Extension"];
          session.login_extension = result["Name"];
          session.login_type = result["Type"];
        }
      }

      cb(rs);
    })
    conn.end();

  } else {
    rs["status"] = "failure";
    rs["sql"] = sql;
    rs["data"] = "Can not connect to database TBS";
    cb(rs);
  }
}

function session_destroy() {
  delete session.login_name;
  delete session.login_extension;
  delete session.login_type;
  return true;
}

module.exports = router;
