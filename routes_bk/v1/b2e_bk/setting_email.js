var express = require('express');
var router = express.Router();
var session = require('express-session');
var database = require('./database');
var conn = database.getConnectionTBS();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('v1/b2e/setting_email', { title: 'Email', login_name: req.signedCookies.login_name });
});

router.post('/get_all', function (req, res, next) {
  select_query((data) => {
    res.json(data);
  });
});

router.post('/check_rid/:rid', function (req, res, next) {
  check_rid(req.params.rid, (data) => {
    res.json(data);
  });
});

router.post('/insert/:id/:emails', function (req, res, next) {
  insert_query(req.params.id, req.params.emails);
  status = { "status": "success", "message": "success" };
  res.json(status);
});

router.post('/update/:id/:emails', function (req, res, next) {
  update_query(req.params.id, req.params.emails);
  status = { "status": "success", "message": "success" };
  res.json(status);
});

router.post('/delete/:id', function (req, res, next) {
  delete_query(req.params.id);
  status = { "status": "success", "message": "success" };
  res.json(status);
});


function select_query(cb) {
  var sql = "SELECT EID, ToAddr FROM Emails";
  //var conn = database.getConnectionTBS();
  var rs = {};
  conn.query(sql, function (err, result) {
    for (let i = 0; i < result.length; i++) {
      result[i]["btn_edit"] = '<a href="javascript:;" id="btn_edit" class="btn-sm btn-info edit">Edit</a> ';
      result[i]["btn_delete"] = '<a href="javascript:;" id="btn_delete" class="btn-sm btn-danger delete">Delete</a> ';
    }
    console.log(result);
    rs["data"] = result;
    cb(rs);
  });
}

function delete_query(eid) {
  var sql = "DELETE FROM Emails WHERE EID = " + eid;
  //var conn = database.getConnectionTBS();
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
  });
}

function check_rid(eid, cb) {
  var sql = "SELECT COUNT(EID) AS count FROM Emails WHERE EID = " + eid;
  //var conn = database.getConnectionTBS();
  var count_data = 0;

  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      rs = false;
      cb(rs)
    } else {
      if (result[0]["count"] >= 1) {
        rs = false;
        cb(rs)
      } else {
        rs = true
        cb(rs)
      }
    }
  });

  
}

function insert_query(eid, emails) {
  var sql = "INSERT INTO Emails (EID, ToAddr) VALUES (" + eid + ",'" + emails + "')";
  //var conn = database.getConnectionTBS();
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
  });
}

function update_query(eid, emails) {
  var sql = "UPDATE Emails SET ToAddr = '" + emails + "' WHERE EID = " + eid;
  //var conn = database.getConnectionTBS();
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = router;


