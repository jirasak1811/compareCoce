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
    if (req.user.role != '') {
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
            var sql = `SELECT *, '-' AS profileid FROM permissions WHERE profileid = '1'`
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

async function check_permision_id(req, res, next) {
    var rolename = req.body.rolename.trim();
    var profileid = req.body.profileid.trim();
    var is_active = req.body.is_active; //fix1
    var permissionsObj = req.body.permissions;
    var permissions;
    var token = req.body.token;
    if (!permissionsObj) {
      permissions = [];
    } else if (typeof permissionsObj === 'string') {
      permissions = [JSON.parse(permissionsObj)];
    } else {
      permissions = permissionsObj.map(json => JSON.parse(json));
    }
    return new Promise(async (resolve) => {
        database.getConnection(function (err, conn) {
            if (conn) {
                    var sql = `SELECT * FROM roles WHERE profileid = '${profileid}'`;
                    conn.query(sql, (err, result) => {
                        if(err){
                            resolve(err)
                        }else{
                            resolve(result)
                        }
                    })
            } else {
                res.status(500).send('Can not connect to database');
            }
        });
})}


router.post('/insert', function (req, res, next) {
  var rolename = req.body.rolename.trim();
  var profileid = req.body.profileid.trim();
  var is_active = req.body.is_active;
  var permissionsObj = req.body.permissions;
  var permissions;
  var token = req.body.token;
  if (!permissionsObj) {
    permissions = [];
  } else if (typeof permissionsObj === 'string') {
    permissions = [JSON.parse(permissionsObj)];
  } else {
    permissions = permissionsObj.map(json => JSON.parse(json));
  }
    database.getConnection(async function (err, conn) {
        if (conn) {
            await check_permision_id(req, res, next).then(async (data) =>{
                if(data.length != 0) {
                    var sql = `SELECT *, '-' AS profileid FROM permissions WHERE profileid = '1'`
                    conn.query(sql, function (err, permsResult) {
                        res.render('v1/etbsRolesForm', {
                            title: 'eTBS | etbsRolesAdd',
                            error: 'profileid is in use',
                            action: '/api/v1/etbs-roles/insert',
                            permissions: permsResult,
                            config: config,
                            token: token,
                        });
                        conn.release();
                    });
                }else{
                    var sql = `INSERT INTO roles(rolename,profileid,is_active) VALUES('${rolename}','${profileid}','${is_active}')`
                    conn.query(sql, function (err, result) {
                        if(result) {
                            permissions.forEach(async function (element) {
                                var sql2 = `INSERT INTO permissions(permission, profileid, perm_type, is_active) VALUES(?, ?, ?, '1')`;
                                var setditions = [
                                    element.permission,
                                    profileid,
                                    element.perm_type
                                ];
                                conn.query(sql2, setditions, function (err, result) {
                                    if(err){
                                        res.send(err)
                                    }else{
                                        console.log('insert secess');
                                    }
                                });
                            });
                            res.redirect('/api/v1/etbs-roles?access_token=' + token);
                        }else{
                            if (err){
                                res.render('v1/etbsRolesForm', {
                                    action: '/api/v1/etbs-roles/insert',
                                    error: err,
                                    token: ''
                                });
                              }
                        }
                    });
                }
            })
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
            var sql = `SELECT DISTINCT p.permission, p.perm_type, r.rolename, r.profileid, r.is_active
            FROM permissions p LEFT JOIN roles r ON p.profileid = r.profileid`
            conn.query(sql, function (err,result) {
                var sql2 = `SELECT 
                COALESCE(q_all.permission,q_main.permission) as 'permission' , 
                COALESCE(q_all.perm_type,q_main.perm_type) as 'perm_type' ,
                COALESCE(q_all.rolename,q_main.rolename) as 'rolename' ,
                COALESCE(q_all.profileid,q_main.profileid) as 'profileid'
                FROM 
                (SELECT DISTINCT p.permission, p.perm_type, r.rolename,r.profileid 
                FROM permissions p LEFT JOIN roles r  ON p.profileid = r.profileid Where r.profileid = '${profileid}') as q_all
                RIGHT JOIN (SELECT DISTINCT p.permission, p.perm_type, r.rolename,r.profileid 
                FROM permissions p LEFT JOIN roles r  ON p.profileid = r.profileid Where r.profileid = '1') as q_main 
                ON q_all.perm_type = q_main.perm_type`
                conn.query(sql2, (err, result2) => {
                    var isActive = result.is_active
                    var originPermissions = result.filter(perm => perm.ListText == profileid);
                    res.render('v1/etbsRolesForm', {
                    action: '/api/v1/etbs-roles/updates',
                    rolename: rolename,
                    profileid: profileid,
                    is_active: isActive,
                    cnt: 0,
                    permsCnt: 0,
                    permissions: result2, //EDITHERE 
                    originPermissions: originPermissions,
                    error: error,
                    config: config,
                    token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                    user: req.cookies.username,
                    ext_lic: '',
                    lic_created_at: '',
                });
            })
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
    database.getConnection(async function (err, conn) {
        if (conn) {
            var sql = `UPDATE roles SET rolename='${rolename}', is_active='${is_active}' WHERE profileid = '${originProfileid}'`
            conn.query(sql,async function (err,result) {
                if(result){
                    await delele_permision_id(req,originProfileid).then(async (data) =>{
                        if(data = 'success'){
                            await insert_permision_id(req, res, next).then(data =>{
                            })
                        }else{
                            res.redirect('/api/v1/etbs-roles/edit/' + originRolename + '/' + originProfileid + '?error=1');
                        }
                    })
                    res.redirect('/api/v1/etbs-roles?access_token=' + token);
                }else{
                    res.redirect('/api/v1/etbs-roles/edit/' + originRolename + '/' + originProfileid + '?error=1');
                }
            })
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

async function insert_permision_id(req, res, next) {
    var rolename = req.body.rolename.trim();
    var profileid = req.body.profileid;
    var originProfileid = req.body.originProfileid;
    var is_active = req.body.is_active; //fix1
    var permissionsObj = req.body.permissions;
    var permissions;
    var token = req.body.token;
    if (!permissionsObj) {
      permissions = [];
    } else if (typeof permissionsObj === 'string') {
      permissions = [JSON.parse(permissionsObj)];
    } else {
      permissions = permissionsObj.map(json => JSON.parse(json));
    }
    return new Promise(async (resolve) => {
        database.getConnection(function (err, conn) {
            if (conn) {
                permissions.forEach(async function (element) {
                    var sql = `INSERT INTO permissions(permission, profileid, perm_type, is_active) VALUES(?, ?, ?, ?)`;
                    var setditions = [
                        element.permission,
                        originProfileid,
                        element.perm_type,
                        is_active
                    ];
                    conn.query(sql, setditions, (err, result) => {
                        if(err){
                            resolve(err)
                        }else{
                            resolve('insert success')
                        }
                    })
                }) 
            } else {
                res.status(500).send('Can not connect to database');
            }
        });
})}

async function delele_permision_id(req,originProfileid) {
    return new Promise(async (resolve) => {
        database.getConnection(function (err, conn) {
            if (conn) {
                var sql = `DELETE FROM permissions WHERE profileid = '${originProfileid}'`;
                conn.query(sql, function (err, result) {
                    if (result) {
                        resolve('success')
                    } else {    
                        if (err){
                            resolve(err)
                        }
                    }
                });
            } else {
                res.status(500).send('Can not connect to database');
            }
        });
})}

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
  var token = req.body.token
    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'DELETE FROM roles WHERE rolename = ? AND profileid = ? ';
            var conditions = [originRolename, originProfileid];
            conn.query(sql, conditions, function (err, result) {
                if (result) {
                    delele_permision_id(req,originProfileid).then(async(data)=>{
                        res.redirect('/api/v1/etbs-roles?access_token=' + token);
                    })
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
