var express = require('express');
var passport = require('passport');
var database = require('./database');
var moment = require('moment');
var router = express.Router();
var ConnectRoles = require('connect-roles');
var Redis = require('ioredis');
var roles = new ConnectRoles();
var config = require('../../config/config.json');
var redis = new Redis({
        host: config.redisserver.host,
        port: config.redisserver.port,
        db: config.redisserver.database,
        lazyConnect: true,
        password: 'convergence@Admin_1'
});

// set grant user for can view dashboard role
roles.use('view extensions', function (req) {

    // allow for user role
    if (req.user.role === 'user') {
        return true;
    }
})

//admin users can access all pages
roles.use(function (req) {
    if (req.user.role === 'Administrator') {
        return true;
    }
});

/* GET home page. */
router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view extensions')], function (req, res, next) {

    //console.log(req.user);
    res.render('v1/recalculate', {
        title: 'eTBS | Recalculate',
        //config: config
        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
        user: req.user.username,
        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
        lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at
    });
});
router.get('/date/:dateFrom/:dateTo', function (req, res, next) {
    console.log(req.params.dateFrom)
    console.log(req.params.dateTo)
    database.getConnection(function (err, conn) {
        var sql = 'SELECT '
            + 'smdr.id ,smdr.caller,smdr.systemname , smdr.rate ,smdr.surcharge,smdr.transfer,smdr.route ,smdr.trunk , smdr.extension , smdr.callid , smdr.location , smdr.calledName , smdr.called ,smdr.startTime , smdr.duration , smdr.calltype as callType , smdr.tolltype as toll ,smdr.serialNumber , smdr.macAddress , smdr.charge , smdr.callername '
            + 'FROM extensions Right JOIN smdr ON extensions.extension = smdr.extension where smdr.startTime BETWEEN ? AND ?'
        var values = [
            req.params.dateFrom,
            req.params.dateTo
        ];

        conn.query({
            sql: sql,
            values: values
        }, function (err, result2) {
            if (result2) {
                if (result2.length != 0) {
                    redis.connect().then(function () {
                        for (var i = 0; i < result2.length; i++) {
                            var smdr = result2[i]
                            smdr['action'] = 'recalculator';
                            redis.lpush('calculator', JSON.stringify(smdr)).then(function () {
                                console.log("lPush Success", i + '/' + result2.length)
                                if (i == result2.length) {
                                    redis.disconnect()
                                }
                            })
                        }
                        res.send(JSON.stringify(result2));
                    }).catch(function (err) {
                        console.log("Error ")
                        console.log(err)
                        res.status(500).send(err);
                    })
                }
                else {
                    res.send(JSON.stringify(result2));
                }
            } else {
                if (err)
                    res.status(500).send(err);
            }
            conn.release()
        });

    });
});
router.get('/tolltype/:tolltype', function (req, res, next) {
    var tmp = req.params.tolltype
    var data = tmp.split(',')
    data = data.filter(function (el) {
        return el != '';
    });
    database.getConnection(function (err, conn) {
        var sql = 'SELECT '
            + 'smdr.id ,smdr.caller,smdr.systemname , smdr.rate ,smdr.surcharge,smdr.transfer,smdr.route ,smdr.trunk , smdr.extension , smdr.callid , smdr.location , smdr.calledName , smdr.called ,smdr.startTime , smdr.duration , smdr.calltype as callType ,smdr.serialNumber , smdr.macAddress , smdr.charge , smdr.callername '
            + 'FROM extensions Right JOIN smdr ON extensions.extension = smdr.extension '
        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                sql += 'where '
            }
            sql += 'smdr.tollType = ? '
            if (i < data.length - 1) {
                sql += ' OR '
            }
        }
        var values = [

        ];
        for (var i = 0; i < data.length; i++) {
            values.push(data[i])
        }
        conn.query({
            sql: sql,
            values: values
        }, function (err, result2) {
            if (result2) {
                if (result2.length != 0) {
                    redis.connect().then(function () {
                        for (var i = 0; i < result2.length; i++) {
                            var smdr = result2[i]
                            smdr['action'] = 'recalculator';
                            redis.lpush('calculator', JSON.stringify(smdr)).then(function () {
                                console.log("lPush Success", i + '/' + result2.length)
                                if (i == result2.length) {
                                    redis.disconnect()
                                }
                            })
                        }
                        res.send(JSON.stringify(result2));
                    }).catch(function (err) {
                        console.log("Error ")
                        console.log(err)
                        res.status(500).send(err);
                    })
                }
                else {
                    res.send(JSON.stringify(result2));
                }
            } else {
                if (err)
                    res.status(500).send(err);
            }
            conn.release()
        });
    });
});
router.get('/group/:groupid', function (req, res, next) {
    database.getConnection(function (err, conn) {
        var sql = 'SELECT '
            + 'smdr.id ,smdr.caller,smdr.systemname , smdr.rate ,smdr.surcharge,smdr.transfer,smdr.route ,smdr.trunk , smdr.extension , smdr.callid , smdr.location , smdr.calledName , smdr.called ,smdr.startTime , smdr.duration , smdr.calltype as callType ,smdr.serialNumber , smdr.macAddress , smdr.charge , smdr.callername '
            + 'FROM extensions Right JOIN smdr ON extensions.extension = smdr.extension where extensions.orgid = ?'
        var values = [
            req.params.groupid
        ];

        conn.query({
            sql: sql,
            values: values
        }, function (err, result2) {
            if (result2) {
                if (result2.length != 0) {
                    redis.connect().then(function () {
                        for (var i = 0; i < result2.length; i++) {
                            var smdr = result2[i]
                            smdr['action'] = 'recalculator';
                            redis.lpush('calculator', JSON.stringify(smdr)).then(function () {
                                console.log("lPush Success", i + '/' + result2.length)
                                if (i == result2.length) {
                                    redis.disconnect()
                                }
                            })
                        }
                        res.send(JSON.stringify(result2));
                    }).catch(function (err) {
                        console.log("Error ")
                        console.log(err)
                        res.status(500).send(err);
                    })
                }
                else {
                    res.send(JSON.stringify(result2));
                }
            } else {
                if (err)
                    res.status(500).send(err);
            }
            conn.release()
        });
    });
});
router.get('/extension/:dateFrom/:dateTo/:tolltype/:extfrom/:extto', function (req, res, next) {
    var tmp = req.params.tolltype
    var data = tmp.split(',')
    data = data.filter(function (el) {
        return el != '';
    });
    database.getConnection(function (err, conn) {
        var sql = 'SELECT '
            + 'smdr.id ,smdr.caller,smdr.systemname , smdr.rate ,smdr.surcharge,smdr.transfer,smdr.route ,smdr.trunk , smdr.extension , smdr.callid , smdr.location , smdr.calledName , smdr.called ,smdr.startTime , smdr.duration , smdr.calltype as callType ,smdr.serialNumber , smdr.macAddress , smdr.charge , smdr.callername '
            + 'FROM extensions Right JOIN smdr ON extensions.extension = smdr.extension where '
        sql += 'smdr.extension BETWEEN ? AND ? '
        sql += 'AND smdr.startTime BETWEEN ? AND ? AND ( '
        for (var i = 0; i < data.length; i++) {
            sql += 'smdr.tollType = ? '
            if (i < data.length - 1) {
                sql += ' OR '
            }
        }
        sql += ' )'

        var values = [
        ];
        values.push(req.params.extfrom)
        values.push(req.params.extto)
        values.push(req.params.dateFrom)
        values.push(req.params.dateTo)
        for (var i = 0; i < data.length; i++) {
            values.push(data[i])
        }

        conn.query({
            sql: sql,
            values: values
        }, function (err, result2) {
            if (result2) {
                if (result2.length != 0) {
                    redis.connect().then(function () {
                        for (var i = 0; i < result2.length; i++) {
                            var smdr = result2[i]
                            smdr['action'] = 'recalculator';
                            redis.lpush('calculator', JSON.stringify(smdr)).then(function () {
                                console.log("lPush Success", i + '/' + result2.length)
                                if (i == result2.length) {
                                    redis.disconnect()
                                }
                            })
                        }
                        res.send(JSON.stringify(result2));
                    }).catch(function (err) {
                        console.log("Error ")
                        console.log(err)
                        res.status(500).send(err);
                    })
                }
                else {
                    res.send(JSON.stringify(result2));
                }
            } else {
                if (err)
                    res.status(500).send(err);
            }
            conn.release()
        });
    });
});


module.exports = router;
