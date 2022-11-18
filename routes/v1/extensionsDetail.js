var express = require('express');
var passport = require('passport');
var database = require('./database');
var router = express.Router();
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

// set grant user for can view dashboard role
roles.use('view extensions info', function (req) {

    // allow for user role
    if (req.user.role === 'user') {
        return true;
    }
})

//admin users can access all pages
roles.use(function (req) {
    if (req.user.role != '') {
        return true;
    }
});

/* GET home page. */
router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view extensions info')], function (req, res, next) {

    console.log(req.cookies);
    res.render('v1/extensionsDetail', {
        title: 'eTBS | Extension Info',
        //config: config
        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
        user: req.user.username,
        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
        lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at,
        extension: req.query.e
    });
});

router.get('/:ext', function (req, res, next) {

    if (!req.params.ext.trim() && !req.query.user.trim()) {
        res.status(500).send('User and Extension can not empty');
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
                //console.log(result);
                if (result) {
                    var sql = 'SELECT '
                        + 'a.*, '
                        + 'b.org_name, '
                        + 'b.org_path, '
                        + 'b.parent_orgid '
                        + 'FROM ?? a '
                        + 'LEFT JOIN ?? b ON a.orgid=b.orgid '
                        + 'WHERE a.clientid = ? AND a.extension = ? ';
                    var values = [
                        'extensions',
                        'organizations',
                        result[0].clientid,
                        req.params.ext
                    ];

                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, result2) {
                        if (result2) {
                            //console.log(result2);
                            //result2[0].company = result[0].company;
                            //result2[0].logo = result[0].logo;
                            res.send(JSON.stringify(result2));
                        } else {
                            if (err)
                                res.status(500).send(err);
                        }
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

router.get('/total/ext', function (req, res, next) {

    if (!req.query.user.trim()) {
        res.status(500).send('User can not empty');
        return;
    }

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'SELECT '
                + 'clientid '
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
                        + 'COUNT(*) AS te '
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
                            res.send(JSON.stringify(result2));
                        } else {
                            if (err)
                                res.status(500).send(err);
                        }
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

router.get('/total/group', function (req, res, next) {

    if (!req.query.user.trim()) {
        res.status(500).send('User can not empty');
        return;
    }

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'SELECT '
                + 'clientid '
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
                        + 'COUNT(*) AS tg '
                        + 'FROM ?? WHERE clientid = ? ';
                    var values = [
                        'organizations',
                        result[0].clientid
                    ];

                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, result2) {
                        if (result2) {
                            //console.log(result2);
                            res.send(JSON.stringify(result2));
                        } else {
                            if (err)
                                res.status(500).send(err);
                        }
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

module.exports = router;
