var Redis = require('ioredis');
var express = require('express');
var passport = require('passport');
var os = require('os');
var exec = require('child_process').exec;
var diskspace = require('diskspace');
var router = express.Router();
var database = require('./database');
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

var config = require('../../config/config.json');

//var isAuthenticated = require('../../auth/mdw').isAuthenticated;
/*function isAuthenticated(req, res, next) {

    // do any checks you want to in here
    console.log(req.user);

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user.authenticated)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}*/

// set grant user for can view dashboard role
roles.use('view dashboard', function (req) {

    console.log(req.user.role)
    // allow for user role
    if (req.user.role === 'user') {
        return true;
    }else if(req.user.role === ' LEVEL 1'){
	return true;
    }
})

//admin users can access all pages
roles.use(function (req) {
    console.log(req.user.role)
    if (req.user.role === 'Administrator') {
        return true;
    }else if (req.user.role === ' LEVEL 1'){
    	return true;
    }
});

/* GET home page. */
router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view dashboard')], function (req, res, next) {

    console.log('req.user' + req.user);
    if (req.user) {

        //req.session.username = req.user.username;
        console.log(req.cookies);

        res.render('v1/dashboard', {
            title: 'eTBS | Dashboard',
            config: config,
            token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
            user: req.user.username,
            ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
            lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at,
        });
    }
    else {
        res.redirect('/api/v1/signin');
    }

    //res.send(req.cookies);
    //res.send(Cookies.get(encodeURIComponent(req.user.username)));
});

router.post('/chartdata', function (req, res) {
    var sql = 'SELECT * FROM smdr Where startTime BETWEEN ? AND ? '
    var values = [
        req.body.start,
        req.body.end
    ];

    database.getConnection(function (err, conn) { 
        conn.query({
            sql: sql,
            values: values
        }, function (err, result2) {
            if (result2) {
                //console.log(result2);
                conn.release()
                res.json(result2);
            } else {
                if (err)
                    res.status(500).send(err);
            }
            //conn.release();
        });
    });
})

router.get('/recent/calls', function (req, res, next) {
    var redis = new Redis({
        host: config.redisserver.host,
        port: config.redisserver.port,
        db: config.redisserver.database,
        lazyConnect: true,
        password: 'convergence@Admin_1'
    });
    //Dashbord Add Trunk & DialNumber
    redis.lrange('monitor',0,-1).then(function (result) {
        //console.log(result)
        res.send(JSON.stringify(result));
        redis.disconnect();
    });
});

router.get('/system/info', function (req, res, next) {
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

            res.send(JSON.stringify(result));
        });
    });
});

router.get('/lic/usage', function (req, res, next) {

    if (!req.query.user.trim()) {
        res.status(500).send('ClientId can not empty');
        return;
    }

    database.getConnection(function (err, conn) { 
        if (conn) {

            var sql = 'SELECT '
                + 'clientid, company, logo '
                + 'FROM ?? WHERE username = ? ';
            var values = [
                'users',
                req.query.user
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result) {
                //console.log(result[0].clientid);
                if (result) {
                    var sql = 'SELECT '
                        + 'COUNT(extension) AS cnt, '
                        + 'SUM(CASE WHEN has_license = 1 THEN 1 ELSE 0 END) AS usg '
                        + 'FROM ?? WHERE clientid = ? ';
                    var values = [
                        'extensions',
                        result[0].clientid
                    ];

                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, result2) {
                        if (result2) {
                            //console.log(result2);
                            result2[0].company = result[0].company;
                            result2[0].logo = result[0].logo;
                            res.send(JSON.stringify(result2));
                        } else {
                            if (err)
                                res.status(500).send(err);
                        }

                        //conn.release();
                    });
                } else {
                    if (err)
                        res.status(500).send(err);
                }

                conn.release();
            });

        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/service/control', function (req, res, next) {

    var command;

    switch (req.body.command) {
    case 'connector-start':
        //command = 'systemctl start connector.service';
        break;

    case 'connector-stop':
        //command = 'systemctl stop connector.service';
        break;

    case 'calculator-start':
        //command = 'systemctl start calculator.service'; // CentOS 7
        command = 'service etbsjs-calculator start'; // CentOS 5, 6
        break;

    case 'calculator-stop':
        //command = 'systemctl stop calculator.service'; // CentOS 7
        command = 'service etbsjs-calculator stop'; // CentOS 5, 6
        break;
    }

    if (command) {
        exec(command, function (err, stdout, stderr) {
            res.send(JSON.stringify({
                error: err,
                stdout: stdout,
                stderr: stderr
            }));
        });
    } else {
        res.send('');
    }
});

module.exports = router;
