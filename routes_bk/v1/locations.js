var express = require('express');
var passport = require('passport');
var router = express.Router();
var database = require('./database');
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

// set grant user for can view dashboard role
roles.use('view locations', function (req) {

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

router.delete('/:location', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: 'DELETE FROM locations WHERE location=?',
                values: [req.params.location]
            }, function (err, rows) {
                if (err) { res.status(500).send('Can not delete location \'' + req.params.location + '\''); }
                else {
                    res.send(JSON.stringify({
                        success: true
                    }));
                }
                    conn.release()
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/update', function (req, res, next) {
    var sql = 'UPDATE locations SET ??=? WHERE location=?';
    var values = [
        req.body.name,
        req.body.value.trim() ? req.body.value.trim() : null,
        req.body.pk
    ];

    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: sql,
                values: values
            }, function (err, rows) {
                if (err) { return next(err); }
                else {
                    res.send(JSON.stringify({
                        success: true
                    }));
                }
                    conn.release()
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/new', function (req, res, next) {
    if (!req.body.newLocation) {
        res.status(500).send('Location can not empty');
        return;
    }

    var route = req.body.newRoute.trim();
    var trunk = req.body.newTrunk.trim();
    var sql = 'INSERT INTO locations(location, model, route, trunk, tariff, prefix, provider) VALUES(?,?,?,?,?,?,?)';
    var values = [
        req.body.newLocation,
        req.body.newModel,
        route ? route : null,
        trunk ? trunk : null,
        req.body.newTariff.trim(),
        req.body.newPrefix.trim(),
        req.body.newProvider.trim()
    ];

    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: sql,
                values: values
            }, function (err, rows) {
                if (err) { return next(err); }
                else {
                    res.send(JSON.stringify({
                        success: true,
                        redirect: '/api/v1/locations'
                    }));
                }
                    conn.release()
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view locations')], function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: 'SELECT location, model, route, trunk, tariff, prefix, provider FROM locations ORDER BY location'
            }, function (err, rows) {
                if (rows) {
                    res.render('v1/locations', {
                        title: 'Locations',
                        data: rows,
                        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                        user: req.user.username,
                        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license
                    });
                } else {
                    return next(err);
                }
                    conn.release()
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/:offset/:count', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query('SELECT COUNT(*) total FROM locations', function (err, rows) {
                var total = rows[0].total;

                conn.query({
                    sql: 'SELECT location, model, route, trunk, tariff, prefix, provider FROM locations ORDER BY location LIMIT ?,?',
                    values: [
                        req.params.offset < 0 ? 0 : req.params.offset,
                        req.params.count <= 0 ? 15 : req.params.count
                    ]
                }, function (err, locations) {
                    if (rows) {
                        res.send(JSON.stringify({
                            total: total,
                            data: locations
                        }));
                    } else {
                        return next(err);
                    }
                        conn.release()
                });
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

module.exports = router;
