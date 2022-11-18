var express = require('express');
var passport = require('passport');
var database = require('./database');
var moment = require('moment');
var router = express.Router();
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

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
    res.render('v1/extensions', {
        title: 'eTBS | Extensions',
        //config: config
        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
        user: req.user.username,
        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
        lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at
    });
});

router.get('/:selectgroup', function (req, res, next) {
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
                        + 'extensions.extension , extensions.exttype , extensions.nameth , extensions.name ,extensions.employee_line, extensions.position , extensions.email , organizations.org_name , extensions.rent_charge , extensions.special_service_fee  '
                        //+ 'extensions.extension , extensions.exttype , extensions.nameth , extensions.name ,organizations.org_name, extensions.position ,extensions.email '
                        //+ 'extensions.extension ,extensions.exttype , extensions.nameth , extensions.name , organizations.org_path , extensions.rent_dial_number_fee ,extensions.special_service_fee ,extensions.email , extensions.authorization_code ,extensions.position, extensions.employee_line '
                        + 'FROM extensions LEFT JOIN organizations ON organizations.orgid=extensions.orgid WHERE extensions.clientid = ? AND extensions.orgid = ? '
                    var values = [
                        result[0].clientid,
                        req.params.selectgroup
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
                        conn.release();
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

router.get('/search/:keyword', function (req, res, next) {
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
                        + 'extensions.extension , extensions.exttype , extensions.nameth , extensions.name ,extensions.employee_line, extensions.position , extensions.email , organizations.org_name , extensions.rent_charge , extensions.special_service_fee  '
                        //+ 'extensions.extension , extensions.exttype , extensions.nameth , extensions.name ,organizations.org_name, extensions.position ,extensions.email '
                        + 'FROM extensions LEFT JOIN organizations ON organizations.orgid=extensions.orgid WHERE extensions.clientid = ? AND extensions.extension LIKE ? OR extensions.nameth LIKE ? OR extensions.name LIKE ? OR extensions.email LIKE ? OR organizations.org_path LIKE ?'
                    var values = [
                        result[0].clientid,
                        '%' + req.params.keyword + '%',
                        '%' + req.params.keyword + '%',
                        '%' + req.params.keyword + '%',
                        '%' + req.params.keyword + '%',
                        '%' + req.params.keyword + '%'
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
                        conn.release();
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
router.get('/all', function (req, res, next) {

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
                        + 'extensions.extension , extensions.exttype , extensions.nameth , extensions.name , organizations.org_path , extensions.rent_dial_number_fee ,extensions.special_service_fee ,extensions.email , extensions.authorization_code '
                        + 'FROM organizations RIGHT JOIN extensions ON organizations.orgid = extensions.orgid WHERE extensions.clientid = ? '
                    var values = [
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
                        conn.release();
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

router.post('/new', function (req, res, next) {
    //console.log(req);
    if (!req.body.ext.trim() && !req.body.user.trim()) {
        res.status(500).send('User and Extension can not empty');
        return;
    }

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'SELECT '
                + 'clientid '
                + 'FROM ?? WHERE username = ? ';
            var values = [
                'users',
                req.body.user
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result) {
                //console.log(result[0].clientid);
                if (result) {
                    var sql = 'INSERT INTO ?? '
                        + '(extension, clientid, name, exttype, has_license, authorization_code, created_at) '
                        + 'VALUES (?,?,?,?,?,?,?) '
                        + '';
                    var values = [
                        'extensions',
                        req.body.ext.trim(),
                        result[0].clientid,
                        req.body.name.trim(),
                        req.body.exttypeval,
                        Number(req.body.licval),
                        req.body.authcode.trim(),
                        moment().format('YYYY-MM-DD HH:mm:ss')
                    ];

                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, result2) {
                        if (result2) {
                            res.send(JSON.stringify({
                                success: true,
                                redirect: '/api/v1/extensions'
                            }));
                        } else {
                            if (err)
                                res.status(500).send(err);
                        }
                        conn.release();
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

router.delete('/:ext', function (req, res, next) {
    //console.log(req);
    if (!req.params.ext.trim() && !req.query.user.trim()) {
        res.status(500).send('User and Extension can not empty');
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
                    var sql = 'DELETE FROM ?? '
                        + 'WHERE extension = ? '
                        + 'AND clientid = ? '
                        + '';
                    var values = [
                        'extensions',
                        req.params.ext.trim(),
                        result[0].clientid
                    ];

                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, result2) {
                        if (result2) {
                            res.send(JSON.stringify({
                                success: true,
                                redirect: '/api/v1/extensions'
                            }));
                        } else {
                            if (err)
                                res.status(500).send(err);
                        }
                        conn.release();
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

router.put('/:ext', function (req, res, next) {
    //console.log(req);
    if (!req.params.ext.trim() && !req.body.user.trim()) {
        res.status(500).send('User and Extension can not empty');
        return;
    }

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'SELECT '
                + 'clientid '
                + 'FROM ?? WHERE username = ? ';
            var values = [
                'users',
                req.body.user
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result) {
                //console.log(result[0].clientid);
                if (result) {
                    var sql = 'UPDATE ?? '
                        + 'SET name = ?, exttype = ?, orgid = ?, '
                        + 'has_license = ?, authorization_code = ? '
                        + 'WHERE extension = ? AND clientid = ? ';
                    var values = [
                        'extensions',
                        req.body.name.trim(),
                        req.body.exttypeval,
                        Number(req.body.orgval),
                        Number(req.body.licval),
                        req.body.authcode.trim(),
                        req.params.ext.trim(),
                        result[0].clientid
                    ];

                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, result2) {
                        if (result2) {
                            res.send(JSON.stringify({
                                success: true,
                                redirect: '/api/v1/extensions/info'
                            }));
                        } else {
                            if (err)
                                res.status(500).send(err);
                        }
                        conn.release();
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

router.post('/new/range', function (req, res, next) {
    //console.log(req);
    if (!req.body.ext_from.trim() && !req.body.ext_from.trim() && !req.body.user.trim()) {
        res.status(500).send('User and Extension can not empty');
        return;
    }

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'SELECT '
                + 'clientid '
                + 'FROM ?? WHERE username = ? ';
            var values = [
                'users',
                req.body.user
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result) {
                //console.log(result[0].clientid);
                var total_add = Number(req.body.ext_to) - Number(req.body.ext_from) + 1;

                if (total_add > 0) {

                    var is_name_same_ext = Number(req.body.sameext);
                    var is_authcode_same_ext = Number(req.body.sameauthcode);
                    var ext_new_name = null;
                    var ext_new_authcode = null;
                    //var is_insert_success = false;

                    for (var i = 0; i < total_add; i++) {

                        if (result) {
                            var sql = 'INSERT INTO ?? '
                                + '(extension, clientid, name, exttype, has_license, authorization_code, created_at) '
                                + 'VALUES (?,?,?,?,?,?,?) '
                                + '';

                            if (is_name_same_ext == 1)
                                ext_new_name = Number(req.body.ext_from.trim()) + i;
                            else {
                                ext_new_name = req.body.name.trim();
                            }

                            if (is_authcode_same_ext == 1)
                                ext_new_authcode = Number(req.body.ext_from.trim()) + i;
                            else {
                                ext_new_authcode = req.body.authcode.trim();
                            }

                            var values = [
                                'extensions',
                                Number(req.body.ext_from.trim()) + i,
                                result[0].clientid,
                                ext_new_name,
                                req.body.exttypeval,
                                Number(req.body.licval),
                                ext_new_authcode,
                                moment().format('YYYY-MM-DD HH:mm:ss')
                            ];

                            conn.query({
                                sql: sql,
                                values: values
                            }, function (err, result2) {
                                if (result2) {
                                    /*is_insert_success = true;
                                    console.log(i);*/
                                } else {
                                    if (err)
                                        res.status(500).send(err);
                                }
                            });
                        } else {
                            if (err)
                                res.status(500).send(err);
                        } // end if
                    } // end for
                    conn.release()
                    res.send(JSON.stringify({
                        success: true,
                        redirect: '/api/v1/extensions'
                    }));
                } // end if
                //conn.release();
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/update', function (req, res, next) {
    console.log(req.body)
    console.log(req.body.pk)
    var sql = 'UPDATE extensions SET ??=? WHERE id = ? ';
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
                        success: true,
                        name: req.body
                    }));
                }
                conn.release()
            });

        } else {
            res.status(500).send('Can not connect to database');
        }
    });
})

router.post('/delete', function (req, res, next) {
    console.log(req.body)
    var sql = 'DELETE FROM extensions WHERE id = ?;';
    var values = [
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
})

module.exports = router;
