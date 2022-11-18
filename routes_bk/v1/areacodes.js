var express = require('express');
var passport = require('passport');
var router = express.Router();
var database = require('./database');
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

// set grant user for can view dashboard role
roles.use('view areacodes', function (req) {

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
    /*if (req.user.role === 'user') {
        console.log(req.user);
        return true;
    }*/
});

router.delete('/:tableId/:areacode/:areaname', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: 'DELETE FROM ?? WHERE areacode=? AND areaname=?',
                values: [
                    'provider_' + req.params.tableId,
                    // req.params.provider.trim() == 'null' ? '' : req.params.provider.trim(),
                    req.params.areacode.trim(),
                    req.params.areaname
                ]
            }, function (err, rows) {
                if (err) {
                    res.status(500).send('Can not delete provider \'' + req.params.provider + '\' and areacode \'' + req.params.areacode + '\' from provider_' + req.params.tableId);
                }
                else {
                    res.send(JSON.stringify({
                        success: true
                    }));
                    conn.release();
                }
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/update/:tableid', function (req, res, next) {
    var sql = 'UPDATE ?? SET ??=? WHERE provider=? AND areacode=?';
    var values = [
        'provider_' + req.params.tableid,
        req.body.name,
        req.body.value.trim() ? req.body.value.trim() : null,
        req.body['pk[provider]'],
        req.body['pk[areacode]']
    ];

    database.getConnection(function (err, conn) { 
        if (conn) {
            conn.query({
                sql: sql,
                values: values
            }, function (err, rows) {
                if (err) {
                    return next(err);
                }
                else {
                    res.send(JSON.stringify({
                        success: true
                    }));
                    conn.release()
                }
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/new/:tableId', function (req, res, next) {
    console.log(req.body);
    console.log(req.body.newAreacode);

    if (!req.body.newAreacode.trim()) {
        res.status(500).send('Areacode or Rate can not empty');
        return;
    }
    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'INSERT INTO ??(areacode, areaname, toll, rate) VALUES(?,?,?,?)';
            var values = [
                'provider_' + req.params.tableId,
                req.body.newAreacode.trim(),
                req.body.newAreaname.trim(),
                req.body.newToll,
                req.body.newRate
            ];
            conn.query({
                sql: sql,
                values: values
            }, function (err, rows) {
                if (err) { 
                    console.log(err);
                    return next(err); }
                else {
                    res.send(JSON.stringify({
                        success: true,
                        redirect: '/api/v1/areacodes/' + req.params.tableId
                    }));
                }
                conn.release();
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view areacodes')], function (req, res, next) {
    console.log(req.user)
    res.render('v1/tariff', {
        title: 'Tariff',
        table: 0,
        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
        user: req.user.username,
        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license
    });
});

router.get('/:tableid', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            var sql1 = 'SELECT DISTINCT provider, areacode, areaname, toll, rate, ratename FROM ?? a INNER JOIN ?? b ON a.rate=b.id ORDER BY provider, areacode';
            var sql2 = 'SELECT DISTINCT id, ratename FROM ?? ORDER BY ratename';
            conn.query({
                sql: sql1,
                values: ['provider_' + req.params.tableid, 'rate_' + req.params.tableid]
            }, function (err, data) {
                if (!err) {
                    conn.query({
                        sql: sql2,
                        values: ['rate_' + req.params.tableid]
                    }, function (err, rates) {
                        if (!err) {
                            res.render('v1/areacodes', {
                                title: 'Areacodes',
                                table: req.params.tableid,
                                data: data,
                                rates: rates
                            });
                            conn.release()
                        } else {
                            return next(err);
                        }
                    });
                } else {
                    return next(err);
                }
            });
        }

    });

});

router.get('/p/:tableid/:page/:count', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: 'SELECT COUNT(*) total FROM ??',
                values: ['provider_' + req.params.tableid]
            }, function (err, rows) {
                if (rows) {
                    var total = rows[0].total;
                    var sql = 'SELECT DISTINCT provider, areacode, areaname, toll, rate, ratename FROM ?? a LEFT JOIN ?? b ON a.rate = b.id ORDER BY  provider, areacode LIMIT ?,?';
                    var values = [
                        'provider_' + req.params.tableid,
                        'rate_' + req.params.tableid,
                        (req.params.page - 1) * req.params.count,
                        Number(req.params.count)
                    ];

                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, areacodes) {
                        if (areacodes) {
                            res.send(JSON.stringify({
                                total: total,
                                data: areacodes
                            }));
                            conn.release();
                        } else {
                            if (err)
                                res.status(500).send(err);
                        }
                    });
                } else {
                    if (err)
                        res.status(500).send(err);
                }
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

module.exports = router;
