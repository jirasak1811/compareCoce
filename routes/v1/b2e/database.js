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
      conn.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            console.log("==========")
            console.log("Err แบบ PROTOCOL_CONNECTION_LOST")
            console.log("==========")
            //console.log('error when connecting to db:', err);
            setTimeout(db.getConnectionTBS, 2000);  // lost due to either server restart, or a
        } else { 
            console.log("==========")
            console.log("Err แบบไม่ใช่ PROTOCOL_CONNECTION_LOST") 
            console.log("==========")                                   // connnection idle timeout (the wait_timeout
          throw err;                                  // server variable configures this)
        }
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
    conn.on('error', function (err) {
        console.log("==========")
        console.log(err)
        console.log("==========")
    
    })
    return conn;
}

module.exports = db;
