var mysql = require('mysql');
var configdb = require('../../../config/b2e');

var db = {};

db.getConnectionTBS = function () {
    var conn = mysql.createConnection({
        host: configdb.mysql.tbs.host,
        user: configdb.mysql.tbs.user,
        password: configdb.mysql.tbs.pwd,
        database: configdb.mysql.tbs.db,
        dateStrings: true
    });

    return conn;
}

db.getConnectionETBS = function () {
    var conn = mysql.createConnection({
        host: configdb.mysql.etbsjs.host,
        user: configdb.mysql.etbsjs.user,
        password: configdb.mysql.etbsjs.pwd,
        database: configdb.mysql.etbsjs.db,
        dateStrings: true
    });

    return conn;
}

module.exports = db;
