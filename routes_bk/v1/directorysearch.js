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
    else if(req.user.role === ' LEVEL 1'){
	return true;	
    }
})

//admin users can access all pages
roles.use(function (req) {
    if (req.user.role === 'Administrator') {
        return true;
    }else if(req.user.role === ' LEVEL 1 '){
   	return true;
    }
});

/* GET home page. */
router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/directorysearch/guest', session: false }), roles.can('view extensions')] , function (req, res, next) {

        res.render('v1/directorysearch', {
            title: 'eTBS | Directory Search',
            //config: config
            token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
            user: req.user.username,
            role: req.user.role,
            ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
            lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at
        });

});
router.get('/guest', function (req, res, next) {

        res.render('v1/directorysearch', {
            title: 'eTBS | Directory Search',
            //config: config
            token: '',
            user: 'Guest',
            role: 'guest',
            ext_lic: '',
            lic_created_at: ''
        });

});

router.get('/search/admin/callin/:keyword', function (req, res, next) {

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
                        + "smdr.caller, smdr.called , smdr.tolltype as 'toll type' , smdr.route , smdr.trunk "
                        + 'FROM smdr WHERE smdr.extension = ? AND smdr.callType = ' + "'IN'" + ' ORDER BY smdr.startTime DESC LIMIT 3'
                    var values = [
                        req.params.keyword
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
router.get('/search/admin/callout/:keyword', function (req, res, next) {

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
                        + "smdr.caller, smdr.called , smdr.tolltype as 'toll type' , smdr.route , smdr.trunk "
                        + 'FROM smdr WHERE smdr.extension = ? AND smdr.callType = ' + "'OUT'" + ' ORDER BY smdr.startTime DESC LIMIT 3'
                    var values = [
                        req.params.keyword
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
router.get('/search/admin/detail/:keyword', function (req, res, next) {

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
                        + 'extensions.extension , extensions.nameth , extensions.name , organizations.org_path , extensions.position ,extensions.rent_dial_number_fee ,extensions.special_service_fee ,extensions.email , extensions.employee_type , extensions.authorization_code '
                        + 'FROM extensions LEFT JOIN organizations ON organizations.orgid=extensions.orgid WHERE extensions.clientid = ? AND extensions.extension = ? '
                    var values = [
                        result[0].clientid,
                        req.params.keyword
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
router.get('/search/admin/:keyword', function (req, res, next) {

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
                        + 'extensions.extension , extensions.nameth , extensions.name , organizations.org_name , extensions.position ,extensions.email , extensions.employee_type '
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
router.get('/all/extension', function (req, res, next) {

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
                        //+ 'extensions.extension ,extensions.exttype , extensions.nameth , extensions.name , organizations.org_path ,extensions.email ,extensions.authorization_code,extensions.position, extensions.employee_line '
                        + 'FROM extensions LEFT JOIN organizations ON organizations.orgid=extensions.orgid WHERE extensions.clientid = ? '
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
router.get('/all/admin', function (req, res, next) {

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
                        + 'extensions.extension , extensions.nameth , extensions.name , organizations.org_name , extensions.position , extensions.email , extensions.employee_type '
                        + 'FROM organizations RIGHT JOIN extensions ON organizations.orgid=extensions.orgid WHERE extensions.clientid = ? '
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

router.get('/all/directory', function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {
                //console.log(result[0].clientid);
                if (conn) {
                    var sql = 'SELECT '
                        + 'extensions.extension , extensions.nameth , extensions.name , organizations.org_name , extensions.position , extensions.email , extensions.employee_type '
                        + 'FROM organizations RIGHT JOIN extensions ON organizations.orgid=extensions.orgid'

                    conn.query({
                        sql: sql,
                    }, function (err, result2) {
                        if (result2) {
                            conn.release();
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
        } 
    });
});
router.get('/search/user/callin/:keyword', function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT '
                + "smdr.caller, smdr.called , smdr.tolltype as 'toll type' , smdr.route , smdr.trunk "
                + 'FROM smdr WHERE smdr.extension = ? AND smdr.callType = ' + "'IN'" + ' ORDER BY smdr.startTime DESC LIMIT 3'
            var values = [
                req.params.keyword
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result2) {
                if (result2) {
                    res.json(result2)
                } else {
                    if (err) {
                        res.status(500).send(err);
                    }
                }
            });

            conn.release();
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});
router.get('/search/user/callout/:keyword', function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT '
                + "smdr.caller, smdr.called , smdr.tolltype as 'toll type' , smdr.route , smdr.trunk "
                + 'FROM smdr WHERE smdr.extension = ? AND smdr.callType = ' + "'OUT'" + ' ORDER BY smdr.startTime DESC LIMIT 3'
            var values = [
                req.params.keyword
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result2) {
                if (result2) {
                    res.json(result2)
                } else {
                    if (err) {
                        res.status(500).send(err);
                    }
                }
            });

            conn.release();
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});
router.get('/search/user/:keyword', function (req, res, next) {

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
                        + 'extensions.extension , extensions.nameth , extensions.name , organizations.org_name ,extensions.email '
                        + 'FROM organizations RIGHT JOIN extensions ON organizations.orgid=extensions.orgid WHERE extensions.clientid = ? AND extensions.extension LIKE ? OR extensions.email LIKE ? OR organizations.org_path LIKE ? OR extensions.nameth LIKE ? OR extensions.name LIKE ? '
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
router.get('/all/user', function (req, res, next) {

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
                        + 'extensions.extension , extensions.nameth , extensions.name , organizations.org_name ,extensions.email '
                        + 'FROM organizations RIGHT JOIN extensions ON organizations.orgid=extensions.orgid WHERE extensions.clientid = ? '
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

router.get('/search/guest/callin/:keyword', function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT '
                + "smdr.caller, smdr.called , smdr.tolltype as 'toll type' , smdr.route , smdr.trunk "
                + 'FROM smdr WHERE smdr.extension = ? AND smdr.callType = ' + "'IN'" + ' ORDER BY smdr.startTime DESC LIMIT 3'
            var values = [
                req.params.keyword
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result2) {
                if (result2) {
                    res.json(result2)
                } else {
                    if (err) {
                        res.status(500).send(err);
                    }
                }
            });

            conn.release();
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});
router.get('/search/guest/callout/:keyword', function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT '
                + "smdr.caller, smdr.called , smdr.tolltype as 'toll type' , smdr.route , smdr.trunk "
                + 'FROM smdr WHERE smdr.extension = ? AND smdr.callType = ' + "'OUT'" + ' ORDER BY smdr.startTime DESC LIMIT 3'
            var values = [
                req.params.keyword
            ];

            conn.query({
                sql: sql,
                values: values
            }, function (err, result2) {
                if (result2) {
                    res.json(result2)
                } else {
                    if (err) {
                        res.status(500).send(err);
                    }
                }
            });

            conn.release();
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});
router.get('/search/guest/:keyword', function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'SELECT '
                + 'extensions.extension , extensions.nameth , extensions.name , organizations.org_path ,extensions.email '
                + 'FROM organizations RIGHT JOIN extensions ON organizations.orgid=extensions.orgid'

            conn.query({
                sql: sql
            }, function (err, result2) {
                if (result2) {
                    //console.log(result2);
                    res.send(JSON.stringify(result2));
                    conn.release()
                } else {
                    if (err)
                        res.status(500).send(err);
                }
            });
        }

    });
});
router.get('/all/guest', function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'SELECT '
                + 'extensions.extension , extensions.nameth , extensions.name  '
                + 'FROM organizations RIGHT JOIN extensions ON organizations.orgid = extensions.orgid'

            conn.query({
                sql: sql
            }, function (err, result2) {
                if (result2) {
                    //console.log(result2);
                    res.send(JSON.stringify(result2));
                    conn.release()
                } else {
                    if (err)
                        res.status(500).send(err);
                }
            });
        }

    });
});


module.exports = router;
