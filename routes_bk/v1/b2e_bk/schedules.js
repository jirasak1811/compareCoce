var express = require('express');
var router = express.Router();
var moment = require('../../../public/theme/madmin-v5.2/vendors/moment/moment.js');
var session = require('express-session');
var database = require('./database');
var conn = database.getConnectionTBS();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('v1/b2e/schedules', { title: 'Schedules', login_name: req.signedCookies.login_name });
});

router.post('/get_all', function (req, res, next) {
  select_query((data) => {
    res.json(data);
  });
});

router.post('/get_report', function (req, res, next) {
  select_report_query((data) => {
    res.json(data);
  });
});

router.post('/get_email', function (req, res, next) {
  select_email_query((data) => {
    res.json(data);
  });
});

router.post('/insert/:hourly/:daily/:monthly/:yearly/:Weekly/:RID/:EID/:NextExecDate/:Active', async function (req, res, next) {
  insert_query(req.params.hourly, req.params.daily, req.params.monthly, req.params.yearly, req.params.Weekly, req.params.RID, req.params.EID, req.params.NextExecDate, req.params.Active, (data) => {
    res.json(data);
  });
});

router.post('/update/:SID/:hourly/:daily/:monthly/:yearly/:Weekly/:RID/:EID/:NextExecDate/:Active', function (req, res, next) {
  update_query(req.params.SID, req.params.hourly, req.params.daily, req.params.monthly, req.params.yearly, req.params.Weekly, req.params.RID, req.params.EID, req.params.NextExecDate, req.params.Active, (data) => {
    res.json(data);
  });
});

router.post('/delete/:SID', function (req, res, next) {
  delete_query(req.params.SID, (data) => {
    res.json(data);
  });

});

function select_query(cb) {
  var sql = "SELECT SID," +
    "CASE WHEN Minutes = '1' THEN '<i class=\"fa fa-check\"></i>' ELSE '' END AS Minutes," +
    "CASE WHEN Hours = '1' THEN '<i class=\"fa fa-check\"></i>' ELSE '' END AS Hours," +
    "CASE WHEN DOM = '1' THEN '<i class=\"fa fa-check\"></i>' ELSE '' END AS DOM," +
    "CASE WHEN Months = '1' THEN '<i class=\"fa fa-check\"></i>' ELSE '' END AS Months," +
    "CASE WHEN DOW = '1' THEN '<i class=\"fa fa-check\"></i>' ELSE '' END AS DOW," +
    "ReportID,EmailID," +
    "CreatedDate," +
    "NextExecDate," +
    "LastExecDate," +
    "CASE WHEN IsActive = 1 THEN '<i class=\"fa fa-check\"></i>' ELSE '<i class=\"fa fa-times\"></i>' END AS IsActive " +
    "FROM Email_Schedule " +
    "ORDER BY SID DESC ";
  //var conn = database.getConnectionTBS();
  var rs = {};

  conn.query(sql, function (err, result) {
    for (let i = 0; i < result.length; i++) {
      result[i]["CreatedDate"] = moment(result[i]["CreatedDate"]).format('DD/MM/YYYY HH:mm:ss');
      result[i]["NextExecDate"] = moment(result[i]["NextExecDate"]).format('DD/MM/YYYY HH:mm:ss');
      result[i]["LastExecDate"] = moment(result[i]["LastExecDate"]).format('DD/MM/YYYY HH:mm:ss');
      result[i]["btn_edit"] = '<a href="javascript:;" id="btn_edit" class="btn-sm btn-info edit">Edit</a> ';
      result[i]["btn_delete"] = '<a href="javascript:;" id="btn_delete" class="btn-sm btn-danger delete">Delete</a> ';
    }

    rs["data"] = result;
    cb(rs);
  });
}

function select_report_query(cb) {
  var sql = "SELECT RID, ReportName FROM Email_Report ";
  //var conn = database.getConnectionTBS();

  conn.query(sql, function (err, result) {
    cb(result);
  });
}

function select_email_query(cb) {
  var sql = "SELECT EID, ToAddr FROM Emails ";
  //var conn = database.getConnectionTBS();

  conn.query(sql, function (err, result) {
    cb(result);
  });
}

function insert_query(h, d, m, y, w, RID, EID, NextExecDate, Active, cb) {
  var sql = "INSERT INTO Email_Schedule (Minutes, Hours, DOM, Months, DOW, ReportID, EmailID, CreatedDate, NextExecDate, LastExecDate, IsActive ) "
  sql += "VALUES ('" + h + "','" + d + "','" + m + "','" + y + "','" + w + "'," + RID + "," + EID + ", '" + moment().format('YYYY-MM-DD HH:mm:ss') + "', '" + moment(NextExecDate, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + "', '" + moment().format('YYYY-MM-DD HH:mm:ss') + "', " + Active + ")";

  //var conn = database.getConnectionTBS();
  conn.query(sql, function (err, result) {
    if (err) {
      status = { "status": "error", "message": err };
      cb(status);
    } else {
      status = { "status": "success", "message": "success" };
      cb(status);
    }
  });
}

function update_query(SID, h, d, m, y, w, RID, EID, NextExecDate, Active, cb) {
  var sql = "UPDATE Email_Schedule SET ";
  sql += "Minutes = '" + h + "', ";
  sql += "Hours = '" + d + "', ";
  sql += "DOM = '" + m + "', ";
  sql += "Months = '" + y + "', ";
  sql += "DOW = '" + w + "', ";
  sql += "ReportID = '" + RID + "', ";
  sql += "EmailID = '" + EID + "', ";
  sql += "NextExecDate = '" + moment(NextExecDate, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + "', ";
  sql += "LastExecDate = '" + moment().format('YYYY-MM-DD HH:mm:ss') + "', ";
  sql += "IsActive = " + Active + " ";
  sql += "WHERE SID = " + SID;

  //var conn = database.getConnectionTBS();
  conn.query(sql, function (err, result) {
    if (err) {
      status = { "status": "error", "message": err };
      cb(status);
    } else {
      status = { "status": "success", "message": "success" };
      cb(status);
    }
  });

}

function delete_query(sid, cb) {
  var sql = "DELETE FROM Email_Schedule WHERE SID = " + sid;
  //var conn = database.getConnectionTBS();
  conn.query(sql, function (err, result) {
    if (err) {
      status = { "status": "error", "message": err };
      cb(status);
    } else {
      status = { "status": "success", "message": "success" };
      cb(status);
    }
  });
}
module.exports = router;
