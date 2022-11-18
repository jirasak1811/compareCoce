var connectCounter = 0
var express = require('express');
var socketserv = express()
var Redis = require('ioredis');
var os = require('os');
var exec = require('child_process').exec;
var diskspace = require('diskspace');
var moment = require('moment');
var database = require('./v1/database');
var config = require('../config/config') 
// config.sockettimer
//"sockettimer": {
//    "SystemInfo": 10000,
//    "Chart": 300000,
//    "RecentCalls": 150000
//}

function startSocket(server) {
    io = require('socket.io').listen(server);

    io.on('connect', function () {
        connectCounter=0
        Object.keys(io.sockets.sockets).forEach(function (id) {
            connectCounter++
        })
        console.log("Socket Connection : " + connectCounter)
    });
    
    //setInterval
    setInterval(async function () {
        diskspace.check('/', function (err, total, free, status) {
            var result = {
                disktotal: total,
                diskfree: free,
                memtotal: os.totalmem(),
                memfree: os.freemem()
            }

            exec('ps -ef | grep node', function (err, stdout, stderr) {
                if (!err) {
                    stdout.split(/\r?\n/).forEach(function (process) {
                        if (process) {
                            if (process.indexOf('connector.js') > 0) {
                                result.connector = process.split(/[ ]+/)[1];
                                console.log(process);
                            } else if (process.indexOf('calculator.js') > 0) {
                                result.calculator = process.split(/[ ]+/)[1];
                                console.log(process);
                            }
                        }
                    });
                } else {
                    console.log(err);
                    result.connector = err;
                    result.calculator = err;
                }

                io.emit('dashboard-systeminfo', JSON.stringify(result));
            });
        });
    }, config.sockettimer.SystemInfo);

    setInterval(async function () {
        var sql = 'SELECT * FROM smdr Where startTime BETWEEN ? AND ? '
        var values = [
           moment().format('YYYY-MM-DD 00:00:00'),
           moment().format('YYYY-MM-DD 23:59:59')
        ];

        database.getConnection(function (err, conn) {
            conn.query({
                sql: sql,
                values: values
            }, function (err, result2) {
                if (result2) {
                    conn.release()
                    io.emit('dashboard-chart', JSON.stringify(result2))
                } else {
                    if (err) {
                        io.emit('dashboard-chart', JSON.stringify([]))
                    }
                }
            });
        });
    }, config.sockettimer.Chart)

    setInterval(async function () {

        var redis = new Redis({
            host: config.redisserver.host,
            port: config.redisserver.port,
            db: config.redisserver.database,
            lazyConnect: true,
            password: 'convergence@Admin_1'
        });
        redis.lrange('monitor', 0, 70).then(function (result) {
            io.emit('dashboard-recentscall', JSON.stringify(result))
            redis.disconnect();
        });
    }, config.sockettimer.RecentCalls)
}

module.exports = {
    startSocket: async function (server) {
        return startSocket(server)
    }
}