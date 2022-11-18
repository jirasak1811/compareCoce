var express = require('express');
var passport = require('passport');
var router = express.Router();
var database = require('./database');
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();
var config = require('../../config/config.json');

// set grant user for can view dashboard role
roles.use('view etbsRoles', function (req) {

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
router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view etbsRoles')], function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql =
                `SELECT rolename, profileid, is_active FROM roles`;

            conn.query(sql, function (err, result) {
                res.render('v1/etbsRoles',
                    {
                        title: 'eTBS | etbsRoles',
                        roles: result,
                        config: config,
                        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                        user: req.user.username,
                        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
                        lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at,
                    }
                );
                conn.release();
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/role', function (req, res, next) {

  database.getConnection(function (err, conn) {
      if (conn) {
          var sql =
              `SELECT rolename, profileid, is_active FROM roles`;

          conn.query(sql, function (err, result) {
              res.send(JSON.stringify(result))
              conn.release();
          });
      } else {
          res.status(500).send('Can not connect to database');
      }
  });
});

router.get('/add', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view etbsRoles')], function(req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = `SELECT DISTINCT p.permission, p.profileid, p.perm_type, r.rolename
    FROM permissions p
    LEFT JOIN roles r ON p.profileid = r.profileid`;

            conn.query(sql, function (err, permsResult) {
                res.render('v1/etbsRolesForm', {
                    title: 'eTBS | etbsRolesAdd',
                    action: '/api/v1/etbs-roles/insert',
                    permissions: permsResult,
                    config: config,
                    token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                    user: req.user.username,
                    ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
                    lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at,
                });

                conn.release();
            });

        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/insert', function (req, res, next) {
  var rolename = req.body.rolename.trim();
  var profileid = req.body.profileid.trim();
  var is_active = req.body.is_active;

  var permissionsObj = req.body.permissions;
  var permissions;
  var token = req.body.token;
  console.log('permissions = ' + req.body.permissions);
  if (!permissionsObj) {
    permissions = [];
  } else if (typeof permissionsObj === 'string') {
    permissions = [JSON.parse(permissionsObj)];
  } else {
    permissions = permissionsObj.map(json => JSON.parse(json));
  }
  
    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'INSERT INTO roles SET ?';
            var role = {
                rolename: rolename,
                profileid: profileid,
                is_active: is_active
            };

            conn.query(sql, role, function (err, result) {

                permissions.forEach(function (element) {
                    var sql = 'UPDATE permissions SET ? WHERE permission = ? AND profileid = ? AND perm_type = ?';
                    var setditions = [
                        {
                            profileid: profileid
                        },
                        element.permission,
                        element.profileid,
                        element.perm_type
                    ];

                    conn.query(sql, setditions, function (err, result) {

                    });
                });

                setTimeout(() => {
                    conn.release();
                }, 1000);

                if (!err)
                    res.redirect('/api/v1/etbs-roles?access_token=' + token);
                else
                    res.render('v1/etbsRolesForm', {
                        action: '/api/v1/etbs-roles/insert',
                        error: err,
                        token: token
                    });
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/edit/:rolename/:profileid', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view etbsRoles')], function (req, res, next) {
  var rolename = req.params.rolename;
  var profileid = req.params.profileid;

  var error = req.query.error;

  var is_active = '';

  var cnt = '';
  var permsCnt = '';

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT is_active FROM roles WHERE rolename = ? AND profileid = ? LIMIT 1 OFFSET 0';
            var conditions = [rolename, profileid];

            conn.query(sql, conditions, function (err, fieldResult) {
                is_active = fieldResult.length ? fieldResult[0].is_active : '';
                console.log('is_active = ' + is_active);

                var sql = 'SELECT COUNT(1) AS cnt FROM users WHERE rolename = ?';
                var conditions = [rolename];

                conn.query(sql, conditions, function (err, result) {
                    cnt = result.length ? result[0].cnt : 0;
                    console.log('cnt = ' + cnt);

                    if (result) {
                        var sql = 'SELECT COUNT(1) AS cnt FROM permissions WHERE profileid = ?';
                        var conditions = [profileid];

                        conn.query(sql, conditions, function (err, permsCntResult) {
                            permsCnt = permsCntResult.length ? permsCntResult[0].cnt : 0;
                            console.log('permsCnt = ' + permsCnt);

                            if (permsCntResult) {
                                var sql =
                                    `SELECT DISTINCT p.permission, p.profileid, p.perm_type, r.rolename
                FROM permissions p
                LEFT JOIN roles r ON p.profileid = r.profileid`;

                                conn.query(sql, function (err, permsResult) {
                                    var originPermissions = permsResult.filter(perm => perm.profileid == profileid);
                                    res.render('v1/etbsRolesForm', {
                                        action: '/api/v1/etbs-roles/updates',
                                        rolename: rolename,
                                        profileid: profileid,
                                        is_active: is_active,
                                        cnt: cnt,
                                        permsCnt: permsCnt,
                                        permissions: permsResult,
                                        originPermissions: originPermissions,
                                        error: error,
                                        config: config,
                                        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                                        user: req.user.username,
                                        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
                                        lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at,
                                    });

                                    conn.release();
                                });

                            }
                        });
                    }
                });
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/updates', function(req, res, next) {
  var originRolename = req.body.originRolename;
  var originProfileid = req.body.originProfileid;
  var rolename = req.body.rolename;
  var profileid = req.body.profileid;
  var is_active = req.body.is_active;
  var token = req.body.token;
  var permissionsObj = req.body.permissions;
  var permissions;

  // console.log('originRolename = ' + req.body.originRolename );
  // console.log('originProfileid = ' + req.body.originProfileid );
  // console.log('rolename = ' + req.body.rolename );
  // console.log('profileid = ' + req.body.profileid );
  // console.log('is_active = ' + req.body.is_active );
  // console.log('permissionsObj = ' + req.body.permissions );

  if (!permissionsObj) {
    permissions = [];
  } else if (typeof permissionsObj === 'string') {
    permissions = [JSON.parse(permissionsObj)];
  } else {
    permissions = permissionsObj.map(json => JSON.parse(json));
  }
  
  var originPermissionsObj = req.body.originPermissions;
  var originPermissions;

  if (!originPermissionsObj) {
    originPermissions = [];
  } else if (typeof originPermissionsObj === 'string') {
    originPermissions = [JSON.parse(originPermissionsObj)];
  } else {
    originPermissions = originPermissionsObj.map(json => JSON.parse(json));
  }

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'UPDATE roles SET ? WHERE rolename = ? AND profileid = ?';
            var setditions = [
                {
                    rolename: rolename,
                    profileid: profileid,
                    is_active: is_active
                },
                originRolename,
                originProfileid
            ];

            conn.query(sql, setditions, function (err, result) {
                var permsTemp;
                originPermissions.forEach(function (originElement) {
                    permsTemp = permissions.find(function (element) {
                        return (originElement.permission == element.permission &&
                            originElement.profileid == element.profileid &&
                            originElement.perm_type == element.perm_type
                        );
                    });

                    if (!permsTemp) {
                        var sql = 'UPDATE permissions SET ? WHERE permission = ? AND profileid = ? AND perm_type = ?';
                        var setditions = [
                            {
                                profileid: 0
                            },
                            originElement.permission,
                            originElement.profileid,
                            originElement.perm_type
                        ];

                        conn.query(sql, setditions, function (err, result) {

                        });
                    }
                });

                permissions.forEach(function (element) {
                    var sql = 'UPDATE permissions SET ? WHERE permission = ? AND profileid = ? AND perm_type = ?';
                    var setditions = [
                        {
                            permission: element.permission,
                            profileid: profileid,
                            perm_type: element.perm_type
                        },
                        element.permission,
                        element.profileid,
                        element.perm_type
                    ];

                    conn.query(sql, setditions, function (err, result) {

                    });

                });

                setTimeout(() => {
                    conn.release();
                }, 1000);

                if (!err)
                    res.redirect('/api/v1/etbs-roles?access_token=' + token);
                else
                    res.redirect('/api/v1/etbs-roles/edit/' + originRolename + '/' + originProfileid + '?error=1');
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/remove/:rolename/:profileid', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view etbsRoles')], function(req, res, next) {
  var rolename = req.params.rolename;
  var profileid = req.params.profileid;

  var is_active = '';

  var cnt = '';
  var permsCnt = '';

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT is_active FROM roles WHERE rolename = ? AND profileid = ? LIMIT 1 OFFSET 0';
            var conditions = [rolename, profileid];

            conn.query(sql, conditions, function (err, fieldResult) {
                is_active = fieldResult.length ? fieldResult[0].is_active : '';

                var sql = 'SELECT COUNT(1) AS cnt FROM users WHERE rolename = ?';
                var conditions = [rolename];

                conn.query(sql, conditions, function (err, result) {
                    cnt = result.length ? result[0].cnt : 0;

                    if (result) {
                        var sql = 'SELECT COUNT(1) AS cnt FROM permissions WHERE profileid = ?';
                        var conditions = [profileid];

                        conn.query(sql, conditions, function (err, permsResult) {
                            permsCnt = permsResult.length ? permsResult[0].cnt : 0;

                            res.render('v1/etbsRolesForm', {
                                action: '/api/v1/etbs-roles/delete',
                                rolename: rolename,
                                profileid: profileid,
                                is_active: is_active,
                                cnt: cnt,
                                permsCnt: permsCnt,
                                config: config,
                                token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                                user: req.user.username,
                                ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
                                lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at,
                            });

                            conn.release();
                        });
                    }
                });
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/delete', function(req, res, next) {
  var originRolename = req.body.originRolename;
  var originProfileid = req.body.originProfileid;

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'DELETE FROM roles WHERE rolename = ? AND profileid = ? ';
            var conditions = [originRolename, originProfileid];

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

router.get('/users/:rolename/:profileid', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view etbsRoles')], function (req, res, next) {
  var rolename = req.params.rolename;
  var profileid = req.params.profileid;

  var roleUsers = {};

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT username, rolename FROM users WHERE rolename = ?';
            var conditions = [rolename];

            conn.query(sql, conditions, function (err, result) {

                if (result) {
                    roleUsers = result;

                    var sql = 'SELECT username, rolename FROM users WHERE rolename != ?';
                    var conditions = [rolename];

                    conn.query(sql, conditions, function (err, unRoleResult) {
                        res.render('v1/etbsRoleUsers',
                            {
                                users: roleUsers,
                                unRoleUsers: unRoleResult,
                                rolename: rolename,
                                profileid: profileid,
                                config: config,
                                token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                                user: req.user.username,
                                ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
                                lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at,
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

router.post('/users/insert', function(req, res, next) {
  var username = req.body.username;
  var rolename = req.body.rolename;
  var profileid = req.body.profileid;

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'UPDATE users SET ? WHERE username = ?';
            var setditions = [
                { rolename: rolename },
                username
            ];

            conn.query(sql, setditions, function (err, result) {
                conn.release();
                res.redirect('/api/v1/etbs-roles/users/' + rolename + '/' + profileid);
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/users/delete', function(req, res, next) {
  var username = req.body.username;
  var rolename = req.body.rolename;
  var profileid = req.body.profileid;

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'UPDATE users SET ? WHERE username = ?';
            var setditions = [
                { rolename: '' },
                username
            ];

            conn.query(sql, setditions, function (err, result) {
                conn.release();
                res.redirect('/api/v1/etbs-roles/users/' + rolename + '/' + profileid);
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/permissions/:rolename/:profileid', function(req, res, next) {
  var rolename = req.params.rolename;
  var profileid = req.params.profileid;

  var permissions = {};

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql =
                `SELECT permission, p.profileid, perm_type, r.rolename 
      FROM permissions p
        LEFT JOIN roles r ON p.profileid = r.profileid
      WHERE p.profileid = ?`;
            var conditions = [profileid];

            conn.query(sql, conditions, function (err, result) {

                if (result) {
                    permissions = result.length ? result : [];

                    var sql =
                        `SELECT permission, p.profileid, perm_type, r.rolename 
          FROM permissions p
            LEFT JOIN roles r ON p.profileid = r.profileid
          WHERE p.profileid != ?`;
                    var conditions = [profileid];

                    conn.query(sql, conditions, function (err, unPermissionsResult) {
                        res.render('v1/etbsRolePermissions',
                            {
                                permissions: permissions,
                                unPermissions: unPermissionsResult,
                                rolename: rolename,
                                profileid: profileid,
                                config: config,
                                token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                                user: req.user.username,
                                ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
                                lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at,
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

router.post('/permissions/insert', function(req, res, next) {
  var rolename = req.body.rolename;

  var permission = req.body.permission;
  var profileid = req.body.profileid;
  var originProfileid = req.body.originProfileid;
  var perm_type = req.body.perm_type;

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = `UPDATE permissions SET ? 
    WHERE permission = ? AND profileid = ? AND perm_type = ?` ;
            var setditions = [
                {
                    profileid: originProfileid
                },
                permission,
                profileid,
                perm_type
            ];

            conn.query(sql, setditions, function (err, result) {
                conn.release();
                res.redirect('/api/v1/etbs-roles/permissions/' + rolename + '/' + originProfileid);
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/permissions/delete', function(req, res, next) {
  var rolename = req.body.rolename;

  var permission = req.body.permission;
  var profileid = req.body.profileid;
  var perm_type = req.body.perm_type;

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = `UPDATE permissions SET ? 
    WHERE permission = ? AND profileid = ? AND perm_type = ?` ;
            var setditions = [
                {
                    profileid: ''
                },
                permission,
                profileid,
                perm_type
            ];

            conn.query(sql, setditions, function (err, result) {
                conn.release();
                res.redirect('/api/v1/etbs-roles/permissions/' + rolename + '/' + profileid);
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/getpathaccess', function (req, res, next) {

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'select perm_type From roles right join permissions on roles.profileid = permissions.profileid right join users on users.rolename = roles.rolename  where users.username = ? AND permissions.is_active = 1'
            conn.query({
                sql: sql,
                values: [req.body.user]
            }, function (err, permsResult) {
                if (permsResult) {
                    res.send(JSON.stringify(permsResult));
                } else {
                    if (err)
                        res.status(500).send(err);
                }
                conn.release()
            });

        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

module.exports = router;
