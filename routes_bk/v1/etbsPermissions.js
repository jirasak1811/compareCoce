var express = require('express');
var passport = require('passport');
var router = express.Router();
var database = require('./database');
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

// set grant user for can view dashboard role
roles.use('view etbsExtensions', function (req) {

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

/* GET etbs-users listing. */
router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view etbsExtensions')], function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql =
                `SELECT permission, profileid, perm_type, is_active 
      FROM permissions`;

            conn.query(sql, function (err, result) {
                res.render('v1/etbsPermissions',
                    {
                        title: 'eTBS | etbsPermissions',
                        permissions: result,
                        //config: config
                        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                        user: req.user.username,
                        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
                        lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at
                    }
                );

                conn.release();
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/allpermiss', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            var sql =
                `SELECT permission, profileid, perm_type, is_active 
      FROM permissions`;

            conn.query(sql, function (err, rows) {
                if (rows) {
                    res.send(JSON.stringify({
                        data: rows
                    }));
                } else {
                    return next(err);
                }
                conn.release();
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/add', function(req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'SELECT rolename, profileid, is_active FROM roles';

            conn.query(sql, function (err, rolesResult) {

                res.render('v1/etbsPermissionsForm', {
                    action: '/api/v1/etbs-permissions/insert',
                    token: req.originalUrl.split('?access_token=')[1],
                    roles: rolesResult
                });

                conn.release();
            })
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/insert', function (req, res, next) {
  var permission = req.body.permission;
  var profileid = req.body.profileid;
  var perm_type = req.body.perm_type;
  var is_active = req.body.is_active;

    if (req.body.role == '-') {
        profileid = '0'
    } else {
        profileid = req.body.role
    }

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'INSERT INTO permissions SET ?';
            var perm = {
                permission: permission,
                profileid: profileid,
                perm_type: perm_type,
                is_active: is_active
            };

            conn.query(sql, perm, function (err, result) {
                console.log(err)
                if (!err) {
                    res.redirect('/api/v1/etbs-permissions?access_token=' + req.originalUrl.split('?access_token=')[1]);
                }
                else {
                    conn.release()
                    res.render('v1/etbsPermissionsForm', {
                        action: '/api/v1/etbs-permissions/insert',
                        token: req.originalUrl.split('?access_token=')[1],
                        error: err
                    });
                }
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/edit/:permission/:profileid/:perm_type', function(req, res, next) {
  var permission = req.params.permission;
  var profileid = req.params.profileid;
  var perm_type = req.params.perm_type;
    const searchRegExp = new RegExp(',', 'g');
    perm_type = perm_type.replace(searchRegExp, '/')
    console.log(perm_type)
    var error = req.query.error;
    console.log(req.originalUrl)
  var is_active = '';

  var rolename = '';

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT is_active FROM permissions WHERE permission = ? AND profileid = ? AND perm_type = ?';
            var conditions = [permission, profileid, perm_type];

            conn.query(sql, conditions, function (err, fieldResult) {
                is_active = fieldResult.length ? fieldResult[0].is_active : '';

                var sql = 'SELECT rolename, profileid FROM roles WHERE profileid = ? LIMIT 1 OFFSET 0';
                var conditions = [profileid];

                conn.query(sql, conditions, function (err, result) {
                    rolename = result.length ? result[0].rolename : 'Not yet assign ROLE';

                    var sql = 'SELECT rolename, profileid, is_active FROM roles';

                    conn.query(sql, function (err, rolesResult) {

                        res.render('v1/etbsPermissionsForm', {
                            action: '/api/v1/etbs-permissions/update/all',
                            permission: permission,
                            profileid: profileid,
                            perm_type: perm_type,
                            is_active: is_active,
                            token: req.originalUrl.split('?access_token=')[1],
                            rolename: rolename,
                            error: error,
                            roles: rolesResult
                        });

                        conn.release();
                    });

                });
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/update', function (req, res, next) {
    var sql = 'UPDATE permissions SET ??=? WHERE permission = ? AND profileid = ? AND perm_type = ?';
    var key = req.body.pk.split(",")
    var values = [
        req.body.name,
        req.body.value.trim() ? req.body.value.trim() : null,
        key[0],
        key[1],
        key[2]
    ];
    console.log(values);
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: sql,
                values: values
            }, function (err, rows) {
                if (err)
                    return next(err);
                else
                    res.send(JSON.stringify({
                        success: true
                    }));
            });

        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/update/all', function(req, res, next) {
  var originPermission = req.body.originPermission;
  var originProfileid = req.body.originProfileid;
  var originPerm_type = req.body.originPerm_type;
  var permission = req.body.permission;
  var profileid = req.body.profileid;
  var perm_type = req.body.perm_type;
  var is_active = req.body.is_active;
  var token = req.body.token;
    if (req.body.role == originProfileid) {
        profileid = originProfileid
    } else {
        profileid = req.body.role
    }

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'UPDATE permissions SET ? WHERE permission = ? AND profileid = ? AND perm_type = ?';
            var setditions = [
                {
                    permission: permission,
                    profileid: profileid,
                    perm_type: perm_type,
                    is_active: is_active
                },
                originPermission,
                originProfileid,
                originPerm_type
            ];

            conn.query(sql, setditions, function (err, result) {
                conn.release();
                if (!err)
                    res.redirect('/api/v1/etbs-permissions/?access_token=' + token);
                else
                    res.redirect('/api/v1/etbs-permissions/edit/' + originPermission + '/' + originProfileid + '/' + originPerm_type + '?error=1');
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/remove/:permission/:profileid/:perm_type', function(req, res, next) {
  var permission = req.params.permission;
  var profileid = req.params.profileid;
  var perm_type = req.params.perm_type;

  var is_active = '';

  var rolename = '';

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT is_active FROM permissions WHERE permission = ? AND profileid = ? AND perm_type = ?';
            var conditions = [permission, profileid, perm_type];

            conn.query(sql, conditions, function (err, fieldResult) {
                is_active = fieldResult.length ? fieldResult[0].is_active : '';

                var sql = 'SELECT rolename, profileid FROM roles WHERE profileid = ? LIMIT 1 OFFSET 0';
                var conditions = [profileid];

                conn.query(sql, conditions, function (err, result) {
                    rolename = result.length ? result[0].rolename : 'Not yet assign ROLE';

                    res.render('v1/etbsPermissionsForm', {
                        action: '/etbs-permissions/delete',
                        permission: permission,
                        profileid: profileid,
                        perm_type: perm_type,
                        is_active: is_active,
                        rolename: rolename
                    });

                    conn.release();
                });
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/delete', function(req, res, next) {
  var originPermission = req.body.originPermission;
  var originProfileid = req.body.originProfileid;
  var originPerm_type = req.body.originPerm_type;

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'DELETE FROM permissions WHERE permission = ? AND profileid = ? AND perm_type = ?';
            var conditions = [originPermission, originProfileid, originPerm_type];

            conn.query(sql, conditions, function (err, result) {
                if (result) {
                    res.json(result)
                } else {
                    if (err) { res.status(500).send(err) }
                }
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/roles/:permission/:profileid/:perm_type', function(req, res, next) {
  var permission = req.params.permission;
  var profileid = req.params.profileid;
  var perm_type = req.params.perm_type;
  var rolename = '';

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT rolename, profileid FROM roles WHERE profileid = ? LIMIT 1 OFFSET 0';
            var conditions = [profileid];

            conn.query(sql, conditions, function (err, result) {

                if (result) {
                    rolename = result.length ? result[0].rolename : 'Not yet assign ROLE';

                    var sql = 'SELECT rolename, profileid FROM roles';

                    conn.query(sql, function (err, roleResult) {
                        res.render('v1/etbsPermissionRoles',
                            {
                                permission: permission,
                                profileid: profileid,
                                perm_type: perm_type,
                                rolename: rolename,
                                roles: roleResult
                            }
                        );
                        conn.release();
                    });
                }
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/roles/update', function(req, res, next) {
  var permission = req.body.permission;
  var profileid = req.body.profileid;
  var perm_type = req.body.perm_type;
  var roleProfileid = req.body.roleProfileid;

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'UPDATE permissions SET ? WHERE permission = ? AND profileid = ? AND perm_type = ?';
            var setditions = [
                { profileid: roleProfileid },
                permission,
                profileid,
                perm_type
            ];

            conn.query(sql, setditions, function (err, result) {
                conn.release();
                res.redirect('/etbs-permissions/roles/' + permission + '/' + roleProfileid + '/' + perm_type);
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

module.exports = router;
