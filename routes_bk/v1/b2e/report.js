var express = require('express');
var router = express.Router();
var moment = require('moment');
var session = require('express-session');
var database = require('./database');
var conn = database.getConnectionTBS();
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('v1/b2e/report', { title: 'Report' });
});

router.get('/new', function (req, res, next) {
  select_group_query((data_group) => {
    res.render('v1/b2e/report_editor', {
      title: 'New Report ',
      status: 'insert',
      GroupName: data_group
    });
  });
});

router.get('/edit/:rid', function (req, res, next) {
  select_rid_query(req.params.rid, (data) => {
    console.log(data);
    console.log(data["data"][0]["RID"]);
    select_group_query((data_group) => {
      res.render('v1/b2e/report_editor', {
        title: 'Editor Report',
        status: 'update',
        RID: data["data"][0]["RID"],
        ReportName: data["data"][0]["ReportName"],
        // StartDate: moment(data["data"][0]["StartDate"], 'dd/MM/yyyy HH:mm:ss').format('YYYY-MM-DD[T]HH:mm:ss'),
        // EndDate: moment(data["data"][0]["EndDate"], 'dd/MM/yyyy HH:mm:ss').format('YYYY-MM-DD[T]HH:mm:ss'),
        StartDate: moment(data["data"][0]["StartDate"], 'DD/MM/YYYY HH:mm:ss.SSS').format('YYYY-MM-DD[T]HH:mm:ss'),
        EndDate: moment(data["data"][0]["EndDate"], 'DD/MM/YYYY HH:mm:ss.SSS').format('YYYY-MM-DD[T]HH:mm:ss'),
        CT_INC: data["data"][0]["CT_INC"],
        CT_OUT: data["data"][0]["CT_OUT"],
        CT_INT: data["data"][0]["CT_INT"],
        TT_UNK: data["data"][0]["TT_UNK"],
        TT_FRE: data["data"][0]["TT_FRE"],
        TT_LOC: data["data"][0]["TT_LOC"],
        TT_MOB: data["data"][0]["TT_MOB"],
        TT_LON: data["data"][0]["TT_LON"],
        TT_OVE: data["data"][0]["TT_OVE"],
        ExtType: data["data"][0]["ExtType"],
        ExtFrom: data["data"][0]["ExtFrom"],
        ExtTo: data["data"][0]["ExtTo"],
        Exts: data["data"][0]["Exts"],
        AccF: data["data"][0]["AccF"],
        AccT: data["data"][0]["AccT"],
        GroupName: data_group,
        GroupID: data["data"][0]["GroupID"],
        RouteF: data["data"][0]["RouteF"],
        RouteT: data["data"][0]["RouteT"],
        TrunkF: data["data"][0]["TrunkF"],
        TrunkT: data["data"][0]["TrunkT"],
        Destination: data["data"][0]["Destination"],
        DialledNo: data["data"][0]["DialledNo"],
        DataType: data["data"][0]["DataType"],
        UserDetailType: data["data"][0]["UserDetailType"],
        TopUsageBy: data["data"][0]["TopUsageBy"],
        Top: data["data"][0]["Top"],
        MonthlyCustom: data.data[0]["MonthlyCustom"]
      });
    });
    //console.log(data_array["data"]);
    //res.json(data.data[0]["RID"]); 
  });
});

router.post('/delete/:rid', function (req, res, next) {
  delete_query(req.params.rid, (data) => {
    res.json(data);
  })

});

router.post('/insert/:ReportName/:StartDate/:EndDate/:CT_INT/:CT_INC/:CT_OUT/:TT_UNK/:TT_FRE/:TT_LOC/:TT_MOB/:TT_LON/:TT_OVE/:ExtType/:ExtFrom/:ExtTo/:Exts/:GroupID/:RouteF/:RouteT/:TrunkF/:TrunkT/:Destination/:DialledNo/:DataType/:UserDetailType/:TopUsageBy/:Top/:MonthlyCustom/:AccFrom/:AccTo', function (req, res, next) {
  insert_query(req.params.ReportName, req.params.StartDate, req.params.EndDate, req.params.CT_INT, req.params.CT_INC, req.params.CT_OUT, req.params.TT_UNK, req.params.TT_FRE, req.params.TT_LOC, req.params.TT_MOB, req.params.TT_LON, req.params.TT_OVE, req.params.ExtType, req.params.ExtFrom, req.params.ExtTo, req.params.Exts, req.params.GroupID, req.params.RouteF, req.params.RouteT, req.params.TrunkF, req.params.TrunkT, req.params.Destination, req.params.DialledNo, req.params.DataType, req.params.UserDetailType, req.params.TopUsageBy, req.params.Top, req.params.MonthlyCustom, req.params.AccFrom, req.params.AccTo, (data) => {
    res.json(data);
  });
});

router.post('/update/:RID/:ReportName/:StartDate/:EndDate/:CT_INT/:CT_INC/:CT_OUT/:TT_UNK/:TT_FRE/:TT_LOC/:TT_MOB/:TT_LON/:TT_OVE/:ExtType/:ExtFrom/:ExtTo/:Exts/:GroupID/:RouteF/:RouteT/:TrunkF/:TrunkT/:Destination/:DialledNo/:DataType/:UserDetailType/:TopUsageBy/:Top/:MonthlyCustom/:AccFrom/:AccTo', function (req, res, next) {
  update_query(req.params.RID, req.params.ReportName, req.params.StartDate, req.params.EndDate, req.params.CT_INT, req.params.CT_INC, req.params.CT_OUT, req.params.TT_UNK, req.params.TT_FRE, req.params.TT_LOC, req.params.TT_MOB, req.params.TT_LON, req.params.TT_OVE, req.params.ExtType, req.params.ExtFrom, req.params.ExtTo, req.params.Exts, req.params.GroupID, req.params.RouteF, req.params.RouteT, req.params.TrunkF, req.params.TrunkT, req.params.Destination, req.params.DialledNo, req.params.DataType, req.params.UserDetailType, req.params.TopUsageBy, req.params.Top, req.params.MonthlyCustom, req.params.AccFrom, req.params.AccTo, (data) => {
    res.json(data);
  });
});


router.post('/get_all', function (req, res, next) {
  select_all_query((data) => {
    res.json(data);
  });
});

router.post('/get/:RID', function (req, res, next) {
  select_rid_query(req.params.RID, (data) => {
    res.json(data);
  });
});

router.post('/get_with_groupname/:RID', function (req, res, next) {
  select_rid_with_groupname_query(req.params.RID, (data) => {
    res.json(data);
  });
});

router.post('/get_groupname', function (req, res, next) {
  select_group_query((data) => {
    res.json(data);
  });
});

router.get('/get_organizations', function (req, res, next) {
  select_organizations_query((data) => {
    res.json(data);
  });
});

router.get('/get_destinations_name/:tollType', function (req, res, next) {
  select_destinations_name_query(req.params.tollType, (data) => {
    res.json(data);
  });
});

function select_destinations_name_query(tollType, cb) {
  if (tollType == 'Hot Line') {
    tollType = 'Free'
  }
  var sql = "SELECT DISTINCT COALESCE(CalledName, '---') AS text FROM smdr WHERE tollType = '" + tollType + "' ";
  //sql += "AND StartTime BETWEEN '" + startDate + "' AND '" + endDate + "'";
  //var conn = database.getConnectionTBS();
  var rs = {};



  conn.query(sql, function (err, result) {

    for (let i = 0; i < result.length; i++) {
      var _item = {};
      result[i]["id"] = result[i]["text"]
    }

    rs["results"] = result;

    cb(rs)
  });

  // request.on('row', function (columns) {
  //   var _item = {};
  //   for (var name in columns) {
  //     _item["id"] = columns[name].value ;
  //     _item[columns[name].metadata["colName"]] = columns[name].value;
  //   }
  //   i = i + 1 ;
  //   data.push(_item);
  // });
  // var rs = {};
  // connection.connection.execSql(request);

  // setTimeout(call_b, 200, 'call_b');
  // function call_b() {
  //   //rs["status"] = "success";
  //   rs["results"] = data;
  //   cb(rs);
  // // }
}

function select_all_query(cb) {
  var sql = "SELECT RID, ReportName, StartDate, EndDate FROM Email_Report"
  //var conn = database.getConnectionTBS();
  var rs = {};

  conn.query(sql, function (err, result) {
    for (let i = 0; i < result.length; i++) {
      result[i]["StartDate"] = moment(result[i]["StartDate"]).format('DD/MM/YYYY HH:mm');
      result[i]["EndDate"] = moment(result[i]["EndDate"]).format('DD/MM/YYYY HH:mm');
      result[i]["btn_view"] = '<a href="javascript:;" id="btn_view" class="btn-sm btn-warning view">View</a> ';
      result[i]["btn_edit"] = '<a href="javascript:;" id="btn_edit" class="btn-sm btn-info edit">Edit</a> ';
      result[i]["btn_delete"] = '<a href="javascript:;" id="btn_delete" class="btn-sm btn-danger delete">Delete</a> ';
    }
    rs["data"] = result;
    cb(rs);
  });

}

function select_rid_query(rid, cb) {
  var sql = "SELECT * FROM Email_Report WHERE RID = " + rid
  //var conn = database.getConnectionTBS();
  var rs = {};

  conn.query(sql, function (err, result) {
    for (let i = 0; i < result.length; i++) {
      result[i]["StartDate"] = moment(result[i]["StartDate"]).format('DD/MM/YYYY HH:mm');
      result[i]["EndDate"] = moment(result[i]["EndDate"]).format('DD/MM/YYYY HH:mm');
    }
    rs["data"] = result;
    cb(rs);
  });
}

function select_rid_with_groupname_query(rid, cb) {
  var sql = "SELECT e.CT_INC AS CT_INC_rs, e.CT_OUT AS CT_OUT_rs, e.CT_INT AS CT_INT_rs, e.TT_UNK AS TT_UNK_rs, e.TT_FRE AS TT_FRE_rs, e.TT_LOC AS TT_LOC_rs, e.TT_MOB AS TT_MOB_rs, e.TT_LON AS TT_LON_rs, e.TT_OVE AS TT_OVE_rs, org.org_name, e.*  " +
    "FROM Email_Report as e " +
    "JOIN organizations as org ON e.GroupID = org.orgid " +
    "WHERE e.RID = " + rid;
  //var conn = database.getConnectionTBS();
  var rs = {};

  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      if (result[0]["CT_INC_rs"] != -1) { result[0]["CT_INC_rs"] = "Incoming" } else { result[0]["CT_INC_rs"] = "*" }
      if (result[0]["CT_OUT_rs"] != -1) { result[0]["CT_OUT_rs"] = ", Outgoing" } else { result[0]["CT_OUT_rs"] = "*" }
      if (result[0]["CT_INT_rs"] != -1) { result[0]["CT_INT_rs"] = ", Internal" } else { result[0]["CT_INT_rs"] = "*" }
      if (result[0]["TT_UNK_rs"] != -1) { result[0]["TT_UNK_rs"] = "Unknow" } else { result[0]["TT_UNK_rs"] = "*" }
      if (result[0]["TT_FRE_rs"] != -1) { result[0]["TT_FRE_rs"] = ", HotLine" } else { result[0]["TT_FRE_rs"] = "*" }
      if (result[0]["TT_LOC_rs"] != -1) { result[0]["TT_LOC_rs"] = ", Local" } else { result[0]["TT_LOC_rs"] = "*" }
      if (result[0]["TT_MOB_rs"] != -1) { result[0]["TT_MOB_rs"] = ", Mobile" } else { result[0]["TT_MOB_rs"] = "*" }
      if (result[0]["TT_LON_rs"] != -1) { result[0]["TT_LON_rs"] = ", Domestic" } else { result[0]["TT_LON_rs"] = "*" }
      if (result[0]["TT_OVE_rs"] != -1) { result[0]["TT_OVE_rs"] = ", International" } else { result[0]["TT_OVE_rs"] = "*" }

      result[0]["CT_rs"] = result[0]["CT_INC_rs"] + result[0]["CT_OUT_rs"] + result[0]["CT_INT_rs"];
      result[0]["TT_rs"] = result[0]["TT_UNK_rs"] + result[0]["TT_FRE_rs"] + result[0]["TT_LOC_rs"] + result[0]["TT_MOB_rs"] + result[0]["TT_LON_rs"] + result[0]["TT_OVE_rs"];

      result[0]["StartDate"] = moment(result[0]["StartDate"]).format('DD/MM/YYYY HH:mm');
      result[0]["EndDate"] = moment(result[0]["EndDate"]).format('DD/MM/YYYY HH:mm');

      rs["status"] = "success";
      rs["data"] = result;

      cb(rs)
    }

  });
}

function select_organizations_query(cb) {
  //var sql = "SELECT OUID AS id, ParentID AS parent, OUName AS text FROM Organization ";
  //var sql = "SELECT OUID AS id, ISNULL('#', ParentID) parent, OUName AS text FROM Organization";
  var sql = "SELECT orgid AS id, parent_orgid AS parent, org_name AS text FROM organizations ";
  var rs = {};

  conn.query(sql, function (err, result) {
    for (let i = 0; i < result.length; i++) {
      if (result[i]["parent"] == null) {
        result[i]["parent"] = '#';
      }
      result[i]["StartDate"] = moment(result[i]["StartDate"]).format('DD/MM/YYYY HH:mm');
      result[i]["EndDate"] = moment(result[i]["EndDate"]).format('DD/MM/YYYY HH:mm');
    }
    cb(result);
  });

}

function insert_query(ReportName, StartDate, EndDate, CT_INT, CT_INC, CT_OUT, TT_UNK, TT_FRE, TT_LOC, TT_MOB, TT_LON, TT_OVE, ExtType, ExtFrom, ExtTo, Exts, GroupID, RouteF, RouteT, TrunkF, TrunkT, Destination, DialledNo, DataType, UserDetailType, TopUsageBy, Top, MonthlyCustom, AccF, AccT, cb) {
  if (Exts == "" || Exts == "0") {
    Exts = " ";
  }
  if (DataType != "MonthlyCustom") {
    MonthlyCustom = 0;
  }
  var sql = "INSERT INTO Email_Report (";
  sql += "ReportName, StartDate, EndDate, CT_INT, CT_INC, CT_OUT, TT_UNK, TT_FRE, TT_LOC, TT_MOB, TT_LON, TT_OVE, ExtType, ExtFrom, ExtTo, Exts, ";
  sql += "GroupID, RouteF, RouteT, TrunkF, TrunkT, Destination, DialledNo, DataType, UserDetailType, TopUsageBy, `Top`, MonthlyCustom, AccF, AccT ";
  sql += ") VALUES (";
  sql += "'" + ReportName + "', '" + StartDate + "', '" + EndDate + "', " + CT_INT + ", " + CT_INC + ", " + CT_OUT + ", " + TT_UNK + ", " + TT_FRE + ", " + TT_LOC + ", " + TT_MOB + ", " + TT_LON + ", " + TT_OVE + ", ";
  sql += " " + ExtType + ", '" + ExtFrom + "', '" + ExtTo + "', '" + Exts + "', '" + GroupID + "', '" + RouteF + "', '" + RouteT + "', " + TrunkF + ", " + TrunkT + ", ";
  sql += "'" + Destination + "', '" + DialledNo + "', '" + DataType + "', '" + UserDetailType + "', '" + TopUsageBy + "', '" + Top + "', '" + MonthlyCustom + "', '" + AccF + "', '" + AccT + "' )";
  //var conn = database.getConnectionTBS();

  conn.query(sql, function (err, result) {
    if (err) {
      status = { "status": "error", "message": err };
      cb(status);
    } else {
      status = { "status": "success", "message": "success | " + sql };
      cb(status);
    }
  });

}

function update_query(RID, ReportName, StartDate, EndDate, CT_INT, CT_INC, CT_OUT, TT_UNK, TT_FRE, TT_LOC, TT_MOB, TT_LON, TT_OVE, ExtType, ExtFrom, ExtTo, Exts, GroupID, RouteF, RouteT, TrunkF, TrunkT, Destination, DialledNo, DataType, UserDetailType, TopUsageBy, Top, MonthlyCustom, AccF, AccT, cb) {
  if (Exts == "0") {
    Exts = "";
  }
  if (DataType != "MonthlyCustom") {
    MonthlyCustom = 0;
  }
  var sql = "UPDATE Email_Report SET ";
  sql += "ReportName = '" + ReportName + "', ";
  sql += "StartDate = '" + StartDate + "', ";
  sql += "EndDate = '" + EndDate + "', ";
  sql += "CT_INT = " + CT_INT + ", ";
  sql += "CT_INC = " + CT_INC + ", ";
  sql += "CT_OUT = " + CT_OUT + ", ";
  sql += "TT_UNK = " + TT_UNK + ", ";
  sql += "TT_FRE = " + TT_FRE + ", ";
  sql += "TT_LOC = " + TT_LOC + ", ";
  sql += "TT_MOB = " + TT_MOB + ", ";
  sql += "TT_LON = " + TT_LON + ", ";
  sql += "TT_OVE = " + TT_OVE + ", ";
  sql += "ExtType = " + ExtType + ", ";
  sql += "ExtFrom = '" + ExtFrom + "', ";
  sql += "ExtTo = '" + ExtTo + "', ";
  sql += "Exts = '" + Exts + "', ";
  sql += "GroupID = '" + GroupID + "', ";
  sql += "RouteF = " + RouteF + ", ";
  sql += "RouteT = " + RouteT + ", ";
  sql += "TrunkF = " + TrunkF + ", ";
  sql += "TrunkT = " + TrunkT + ", ";
  sql += "Destination = '" + Destination + "', ";
  sql += "DialledNo = '" + DialledNo + "', ";
  sql += "DataType = '" + DataType + "', ";
  sql += "UserDetailType = '" + UserDetailType + "', ";
  sql += "TopUsageBy = '" + TopUsageBy + "', ";
  sql += "Top = '" + Top + "', ";
  sql += "MonthlyCustom = '" + MonthlyCustom + "', ";
  sql += "AccF = '" + AccF + "', ";
  sql += "AccT = '" + AccT + "' ";
  sql += "WHERE RID = " + RID;

  //var conn = database.getConnectionTBS();

  conn.query(sql, function (err, result) {
    if (err) {
      status = { "status": "error", "message": err };
      cb(status);
    } else {
      status = { "status": "success", "message": "success | " + sql };
      cb(status);
    }
  });
}

function delete_query(rid, cb) {
  var sql = "DELETE FROM Email_Report WHERE RID = " + rid;
  //var conn = database.getConnectionTBS();

  conn.query(sql, function (err, result) {
    if (err) {
      status = { "status": "error", "message": err };
      cb(status);
    } else {
      status = { "status": "success", "message": "success | " };
      cb(status);
    }
  });
}

function select_group_query(cb) {
  var sql = "SELECT orgid, org_name FROM organizations ";
  //var conn = database.getConnectionTBS();

  conn.query(sql, function (err, result) {
    var item = {};
    _item1 = result[0]["orgid"];
    _item2 = result[0]["GroupName"];
    item[_item1] = _item2;
    cb(item);
  });
}

module.exports = router;

