var mysql = require('mysql');
var config = require('../../config/config.json');

var db = {};

var pool = mysql.createPool({
    connectionLimit: 500,
    host: config.dbserver.host,
    user: config.dbserver.user,
    password: config.dbserver.password,
    database: config.dbserver.database
})

//db.getConnection = function () {
//    mysql.createConnection({
//        host: config.dbserver.host,
//        user: config.dbserver.user,
//        password: config.dbserver.password,
//        database: config.dbserver.database,
//        dateStrings: true
//    });

//    return conn;
//}


module.exports = pool;
