var express = require('express');
var passport = require('passport');
var database = require('./database');
var moment = require('moment');
var router = express.Router();
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

// set grant user for can view dashboard role
roles.use('view trunks', function (req) {

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
router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view trunks')], function (req, res, next) {

    //console.log(req.user);
    res.render('v1/trunks', {
        title: 'eTBS | Trunks',
        //config: config
        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
        user: req.user.username,
        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
        lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at
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
                        + 'systemName,route, trunk, name AS trk_name, '
                        + 'updated_on '
                        + 'FROM ?? a WHERE a.clientid = ? '
                        + 'ORDER BY route, trunk';
                    var values = [
                        'trunks',
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

router.post('/search/callout', function (req, res, next) { 
    console.log(req.body)
    if (!req.body.user.trim()) {
        res.status(500).send('User can not empty');
        return;
    }

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT '
                + "smdr.extension ,extensions.name , smdr.caller, smdr.called , smdr.tolltype as 'toll type' , smdr.startTime as 'starttime' "
                + 'FROM smdr RIGHT JOIN organizations RIGHT JOIN extensions ON organizations.orgid=extensions.orgid ON smdr.extension = extensions.extension Where smdr.route = ? AND smdr.trunk = ? AND smdr.callType = ' + "'OUT'" + ' ORDER BY smdr.startTime DESC LIMIT 3'
            var values = [
                req.body.route,
                req.body.trunk
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result2) {
                if (result2) {
                    res.json(result2)
                } else {
                    if (err) {
                        console.log("error search admin detail l2", result2)
                        res.status(500).send(err);
                    }
                }
            });
            conn.release();
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
})
router.post('/search/callin', function (req, res, next) { 
    console.log(req.body)
    if (!req.body.user.trim()) {
        res.status(500).send('User can not empty');
        return;
    }

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT '
                + "smdr.extension ,extensions.name , smdr.caller, smdr.called , smdr.tolltype as 'toll type' , smdr.startTime as 'starttime' "
                + 'FROM smdr RIGHT JOIN organizations RIGHT JOIN extensions ON organizations.orgid=extensions.orgid ON smdr.extension = extensions.extension Where smdr.route = ? AND smdr.trunk = ? AND smdr.callType = ' + "'IN'" + ' ORDER BY smdr.startTime DESC LIMIT 3'
            var values = [
                req.body.route,
                req.body.trunk
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result2) {
                if (result2) {
                    res.json(result2)
                } else {
                    if (err) {
                        console.log("error search admin detail l2", result2)
                        res.status(500).send(err);
                    }
                }
            });
            conn.release();
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
})

router.post('/search', function (req, res, next) { 
    console.log(req.body)
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
                    var sql = 'SELECT '
                        + 'systemName,route, trunk, name AS trk_name, '
                        + 'updated_on '
                        + 'FROM ?? a WHERE a.clientid = ? AND trunk like ? OR route like ? '
                        + 'ORDER BY route, trunk';
                    var values = [
                        'trunks',
                        result[0].clientid,
                        "%" + req.body.keyword + "%",
                        "%" + req.body.keyword + "%"
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

router.post('/new', function (req, res, next) {
    // console.log("Comming /new.....")
    database.getConnection(function (err, conn) {
        if (conn) {
            // console.log("check user ....... ")
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
                    console.log(req.body);
                    var sql = 'INSERT INTO ??(route, trunk, name, clientid, created_at) VALUES(?,?,?,?,?)';
                    // var sql = 'INSERT INTO ?? '
                    //     + '(route, trunk, name, created_at) '
                    //     + 'VALUES (?,?,?,?) '
                    //     + '';
                    var values = [
                        'trunks',
                        req.body.routeno.trim(),
                        req.body.trunkno.trim(),
                        req.body.trkname.trim(),
                        result[0].clientid,
                        moment().format('YYYY-MM-DD HH:mm:ss')
                    ];

                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, result2) {
                        if (result2) {
                            res.send(JSON.stringify({
                                success: true,
                                redirect: '/api/v1/trunks'
                            }));
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
// router.delete('/:route/:trunk', function (req, res, next) {
//     var conn = database.getConnection();
//     if (conn) {
//         conn.query({
//             sql: 'DELETE FROM ?? WHERE route=? AND trunk=?',
//             values: [
//                 'trunks',
//                 req.params.route.trim(),
//                 req.params.trunk.trim(),
//             ]
//         }, function (err, rows) {
//             if (err)
//                 res.status(500).send('Can not delete route \'' + req.params.route + '\' and trunk \'' + req.params.trunk);
//             else
//                 res.send(JSON.stringify({
//                     success: true
//                 }));
//         });
//     } else {
//         res.status(500).send('Can not connect to database');
//     }
// });

router.delete('/:route/:trunk', function (req, res, next) {
    //console.log(req);
    if (!req.params.route.trim() && !req.query.trunk.trim()) {
        res.status(500).send('Route and Trunk can not empty');
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
                    var sql = 'DELETE FROM ?? WHERE route=? AND trunk=?';
                    var values = [
                        'trunks',
                        req.params.route.trim(),
                        req.params.trunk.trim(),
                        // result[0].clientid
                    ];
                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, result2) {
                        conn.release()
                        if (result2) {
                            res.send(JSON.stringify({
                                success: true,
                                redirect: '/api/v1/trunks'
                            }));
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


router.post('/update', function (req, res, next) {

    var route = req.body['pk[route]'] || req.body.pk['route']
    var trunk = req.body['pk[trunk]'] || req.body.pk['trunk']
    var sql = `UPDATE trunks SET name='${req.body.value}' WHERE route = '${route}' AND trunk = '${trunk}'`
    database.getConnection(function (err, conn) {
        if(conn){
            conn.query({
                sql: sql
            }, function (err, rows) {
                if (err) { 
                    return next(err); 
                }
                else {
                    res.send(JSON.stringify({
                        success: true,
                        redirect: '/api/v1/trunks'
                    }));
                }
                conn.release()
            });
        }else{
            res.status(500).send('Can not connect to database');
        }

    })

})


module.exports = router;
