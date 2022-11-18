var express = require('express');
var passport = require('passport');
var database = require('./database');
var router = express.Router();
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

// set grant user for can view dashboard role
roles.use('view organizations', function (req) {

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
router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view organizations')], function (req, res, next) {

    //console.log(req.user);
    res.render('v1/organizations', {
        title: 'eTBS | Groups',
        //config: config
        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
        user: req.user.username,
        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
        lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at
    });
});

router.post('/exttogroups', function (req, res, next) {
    console.log(req.body.groupid)
    console.log(req.body.extensions)
    database.getConnection(function (err, conn) {
        req.body.extensions = JSON.parse(req.body.extensions)
        var sql = 'UPDATE extensions SET orgid = ? Where '
        for (var i = 0; i < req.body.extensions.length; i++) {
            if (i == req.body.extensions.length - 1) {
                sql += 'id = ? '
            } else {
                sql += 'id = ? OR '
            }
        }
        var values = [
            req.body.groupid
        ];
        for (var i = 0; i < req.body.extensions.length; i++) {
            values.push(req.body.extensions[i])
        }
        console.log(sql)
        console.log(values)

        conn.query({
            sql: sql,
            values: values
        }, function (err, result2) {
            conn.release()
            if (result2) {
                //console.log(result2);
                res.send(JSON.stringify(result2));
            } else {
                if (err)
                    res.status(500).send(err);
            }
        });
    });
});
router.post('/movegroup', function (req, res, next) {

    if (!req.body.user.trim()) {
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
                req.body.user
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result) {
                //console.log(result[0].clientid);
                if (result) {
                    console.log("Move Group : " + req.body.orgid + " To " + req.body.parent_id + ' By ' + req.body.user)
                    var sql = 'SELECT '
                        + '* '
                        + 'FROM organizations Where orgid= ? OR orgid= ?';
                    var values = [
                        req.body.orgid,
                        req.body.parent_id
                    ];
                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, result2) {
                        if (result2) {
                            console.log(result2)
                            var newpath, orgname, path
                            var chk = false
                            for (var i = 0; i < result2.length; i++) {
                                if (result2[i].orgid == req.body.orgid) {
                                    if (result2[i].parent_orgid != null) {
                                        orgname = result2[i].org_name
                                        chk = true
                                    } else {
                                        orgname = result2[i].org_path
                                    }
                                }
                                if (result2[i].orgid == req.body.parent_id) {
                                    newpath = result2[i].org_path
                                }
                            }
                            if (chk) {
                                path = newpath + "/" + orgname
                            } else {
                                path = newpath + "/" + orgname
                            }
                            var sql2 = 'UPDATE ?? '
                                + 'SET parent_orgid = ? , org_path = ? '
                                + 'WHERE orgid = ?';
                            var values2 = [
                                'organizations',
                                req.body.parent_id,
                                path.replace('//', '/'),
                                req.body.orgid
                            ];

                            conn.query({
                                sql: sql2,
                                values: values2
                            }, function (err, result3) {
                                    if (result3) {
                                        conn.query({ sql: "UPDATE organizations SET parent_orgid  = NULL Where parent_orgid = 0" }, function () {
                                            res.json({ success: 'Move Success' })
                                        })
                                    } else {
                                        console.log(err)
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

router.post('/deletegroup', function (req, res, next) {
    if (!req.body.user.trim()) {
        res.status(500).send('User can not empty');
        return;
    }
    req.body.orgid = JSON.parse(req.body.orgid)
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
                    var sql = 'DELETE FROM organizations WHERE orgid = ?'
                    var updatesql = ''
                    for (var i = 1; i < req.body.orgid.length; i++) {
                        sql += ' OR orgid = ? '
                        updatesql += ' OR orgid = ? '
                    }
                    var values = req.body.orgid
                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, result2) {
                        if (result2) {
                            console.log(result2)
                            var sql2 = 'UPDATE extensions SET orgid = 0 WHERE orgid = ? ' + updatesql
                            conn.query({
                                sql: sql2,
                                values: values
                            }, function (err, result3) {
                                if (result3) {
                                    res.json({ success: 'Delete Group Success' })
                                } else {
                                    console.log(err)
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
                    if (err)
                        res.status(500).send(err);
                }
                conn.release();
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
})

router.get('/alls', function (req, res, next) {

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
                        + 'a.orgid, a.org_name, a.parent_orgid, '
                        + '(SELECT COUNT(*) FROM ?? WHERE parent_orgid = a.orgid) AS has_child '
                        + 'FROM ?? a WHERE a.clientid = ? '
                        + 'ORDER BY a.org_name';
                    var values = [
                        'organizations',
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
                        + 'a.orgid, a.org_name, a.parent_orgid, '
                        + '(SELECT COUNT(*) FROM ?? WHERE parent_orgid = a.orgid) AS has_child '
                        + 'FROM ?? a WHERE a.clientid = ? AND a.parent_orgid IS NULL '
                        + 'ORDER BY a.org_name';
                    var values = [
                        'organizations',
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

router.get('/all/:orgid', function (req, res, next) {

    if (!req.params.orgid.trim() && !req.query.user.trim()) {
        res.status(500).send('OrgId and User can not empty');
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
                        + 'a.orgid, a.org_name, a.parent_orgid, '
                        + '(SELECT COUNT(*) FROM ?? WHERE parent_orgid = a.orgid) AS has_child, '
                        + '(SELECT org_name FROM ?? WHERE orgid = a.parent_orgid) AS parent_name, '
                        + '(SELECT parent_orgid FROM ?? WHERE orgid = a.parent_orgid) AS pop '
                        + 'FROM ?? a WHERE a.clientid = ? AND a.parent_orgid = ? '
                        + 'ORDER BY org_name';
                    var values = [
                        'organizations',
                        'organizations',
                        'organizations',
                        'organizations',
                        result[0].clientid,
                        req.params.orgid
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

router.get('/parent/:orgid', function (req, res, next) {

    if (!req.params.orgid.trim() && !req.query.user.trim()) {
        res.status(500).send('OrgId and User can not empty');
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
                        + 'a.orgid, a.org_name, a.parent_orgid, '
                        + '(SELECT org_name FROM ?? WHERE orgid = a.parent_orgid) AS parent_name '
                        + 'FROM ?? a WHERE a.clientid = ? AND a.orgid = ? '
                        + '';
                    var values = [
                        'organizations',
                        'organizations',
                        result[0].clientid,
                        req.params.orgid
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

router.post('/edit', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'UPDATE organizations SET org_name = ? WHERE orgid = ? '
            var values = [
                req.body.org_name,
                req.body.orgid
            ];
            conn.query({
                sql: sql,
                values: values
            }, function (err, result2) {
                if (result2) {
                    //console.log(result2);
                    conn.release()
                    res.send(JSON.stringify(result2));
                } else {
                    if (err)
                        res.status(500).send(err);
                }
            });
        } else {
            res.status(500).send('Can not connect to database');
        }    });
})
router.post('/new', function (req, res, next) {
    if (!req.body.user.trim()) {
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
                req.body.user
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result) {
                //console.log(result[0].clientid);
                if (result) {
                    var sql = 'INSERT INTO organizations (org_name,clientid,org_path) values (?,?,?)'
                    var values = [
                        req.body.groupname,
                        result[0].clientid,
                        "/" + req.body.groupname
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
})

module.exports = router;
