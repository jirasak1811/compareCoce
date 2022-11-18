var express = require('express');
var passport = require('passport');
var router = express.Router();
var database = require('./database');
var ConnectRoles = require('connect-roles');

var roles = new ConnectRoles();

// set grant user for can view dashboard role
roles.use('view etbsUsers', function (req) {

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

router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view etbsUsers')], function (req, res, next) {
    currentPage = req.query.page && !isNaN(req.query.page) ? req.query.page : 1;

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql =
                `SELECT username, clientid, rolename, extension, name, 
          logo, company, email, mobile, fax, is_active 
        FROM users`;

            conn.query(sql, function (err, result) {
                res.render('v1/etbsUsers',
                    {
                        title: 'eTBS | etbsUsers',
                        users: result,
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
/* GET etbs-users listing. */
// router.get('/', function(req, res, next) {
//   currentPage = req.query.page && !isNaN(req.query.page) ? req.query.page : 1;

//   database.getConnection();

//   if (conn) {
//     var sql = 
//       `SELECT username, clientid, rolename, extension, name, 
//         logo, company, email, mobile, fax, is_active 
//       FROM users`;

//     conn.query(sql, function (err, result) {
//       res.render('v1/etbsUsers', 
//         {
//           users: result
//         }
//       );
      
//       conn.release();
//     });
//   } else {
//     res.status(500).send('Can not connect to database');
//   }
// });

router.get('/add', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view etbsUsersForm')], function (req, res, next) {
    var error = req.query.error;

    database.getConnection(function (err, conn) {
        if (conn) {
            var extensions;
            var groups;
            var roles;

            var sql = 'SELECT rolename, is_active FROM roles ORDER BY is_active DESC';

            conn.query(sql, function (err, rolesResult) {
                roles = rolesResult;

                var sql = 'SELECT extension FROM extensions';

                conn.query(sql, function (err, extensionsResult) {
                    extensions = extensionsResult;

                    var sql = 'SELECT group_id, group_name FROM groups';

                    conn.query(sql, function (err, groupsResult) {
                        groups = groupsResult;

                        var sql = `SELECT orgid, org_name, parent_orgid, budget, clientid, 
            org_path, created_at, updated_on
          FROM organizations`;

                        conn.query(sql, function (err, orgsResult) {

                            res.render('v1/etbsUsersForm', {
                                action: '/etbs-users/insert',
                                extensions: extensions,
                                groups: groups,
                                organizations: orgsResult,
                                roles: roles,
                                error: error,
                                //config: config
                                token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                                user: req.user.username,
                                ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license,
                                lic_created_at: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).created_at
                            });

                            conn.release();
                        });

                    });

                });
            });

        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/insert', function(req, res, next) {
  var username  = req.body.username;
  var password  = req.body.password;
  var retypePassword = req.body.retypePassword;
  var clientid  = req.body.clientid;
  var rolename  = req.body.rolename;
  var extension = req.body.extension;
  var name      = req.body.name;
  var logo      = req.body.logo;
  var company   = req.body.company;
  var email     = req.body.email;
  var mobile    = req.body.mobile;
  var fax       = req.body.fax;
  var is_active = req.body.is_active;

  clientid = req.body.organization != '-' ? JSON.parse(req.body.organization).clientid : '';
  rolename = req.body.role != '-' ? JSON.parse(req.body.role).rolename : '';
  extension = req.body.extensionComboBox != '-' ? JSON.parse(req.body.extensionComboBox).extension : '';

  var groupsObj = req.body.groups;
  var groups;

  if (!groupsObj) {
    groups = [];
  } else if (typeof groupsObj === 'string') {
    groups = [JSON.parse(groupsObj)];
  } else {
    groups = groupsObj.map(json => JSON.parse(json));
  }

  if (password != retypePassword) {
    res.redirect('/etbs-users/add' + '?error=1');

    return;
  }

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'INSERT INTO users SET ?';
            var user = {
                username: username,
                password: password,
                clientid: clientid,
                rolename: rolename,
                extension: extension,
                name: name,
                logo: logo,
                company: company,
                email: email,
                mobile: mobile,
                fax: fax,
                is_active: is_active
            };

            conn.query(sql, user, function (err, result) {

                groups.forEach(function (element) {
                    var sql_ins = 'INSERT INTO user_group SET ?';
                    var ug = {
                        username: username,
                        group_id: element.group_id
                    };

                    conn.query(sql_ins, ug, function (err, result) {
                        console.log(sql_ins);
                    });
                });

                setTimeout(() => {
                    conn.release();
                }, 1000);

                if (!err)
                    res.redirect('/etbs-users');
                else
                    res.render('v1/etbsUsersForm', {
                        action: '/etbs-users/insert',
                        error: err

                    });
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/edit/:username', function(req, res, next) {
  var username = req.params.username;

  var error = req.query.error;

  var password  = '';
  var clientid  = '';
  var extension = '';
  var name      = '';
  var logo      = '';
  var company   = '';
  var email     = '';
  var mobile    = '';
  var fax       = '';
  var is_active = '';
  
  var rolename  = '';
  var cnt       = '';

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = `SELECT password, clientid, extension, name, logo, 
      company, email, mobile, fax, is_active, rolename 
    FROM users WHERE username = ? LIMIT 1 OFFSET 0`;
            var conditions = [username];

            conn.query(sql, conditions, function (err, result) {
                password = result.length ? result[0].password : '';
                clientid = result.length ? result[0].clientid : '';
                extension = result.length ? result[0].extension : '';
                name = result.length ? result[0].name : '';
                logo = result.length ? result[0].logo : '';
                company = result.length ? result[0].company : '';
                email = result.length ? result[0].email : '';
                mobile = result.length ? result[0].mobile : '';
                fax = result.length ? result[0].fax : '';
                is_active = result.length ? result[0].is_active : '';

                rolename = result.length && result[0].rolename ? result[0].rolename : '';

                var sql = 'SELECT COUNT(1) AS cnt FROM user_group WHERE username = ?';
                var conditions = [username];

                conn.query(sql, conditions, function (err, resultCnt) {
                    cnt = resultCnt.length ? resultCnt[0].cnt : 0;

                    var sql = 'SELECT rolename, is_active FROM roles ORDER BY is_active DESC';

                    conn.query(sql, function (err, rolesResult) {

                        var sql = 'SELECT extension FROM extensions';

                        conn.query(sql, function (err, extensionsResult) {

                            var sql = `SELECT g.group_id, g.group_name, ug.username 
            FROM groups g
            LEFT JOIN (SELECT username, group_id FROM user_group WHERE username = ?) as ug 
              ON g.group_id = ug.group_id`;
                            var conditions = [username];

                            conn.query(sql, conditions, function (err, groupsResult) {

                                var sql = `SELECT orgid, org_name, parent_orgid, budget, clientid, 
                org_path, created_at, updated_on
              FROM organizations`;

                                conn.query(sql, function (err, orgsResult) {

                                    res.render('v1/etbsUsersForm', {
                                        action: '/etbs-users/update',
                                        username: username,
                                        password: password,
                                        clientid: clientid,
                                        extension: extension,
                                        name: name,
                                        logo: logo,
                                        company: company,
                                        email: email,
                                        mobile: mobile,
                                        fax: fax,
                                        is_active: is_active,
                                        rolename: rolename,
                                        cnt: cnt,
                                        error: error,
                                        extensions: extensionsResult,
                                        groups: groupsResult,
                                        organizations: orgsResult,
                                        roles: rolesResult
                                    });

                                    conn.release();
                                });

                            });

                        });

                    });

                });

            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/update', function(req, res, next) {
  var originUsername = req.body.originUsername;

  var username  = req.body.username;
  var password  = req.body.password;
  var clientid  = req.body.clientid;
  var rolename  = req.body.rolename;
  var extension = req.body.extension;
  var name      = req.body.name;
  var logo      = req.body.logo;
  var company   = req.body.company;
  var email     = req.body.email;
  var mobile    = req.body.mobile;
  var fax       = req.body.fax;
  var is_active = req.body.is_active;

  clientid = req.body.organization != '-' ? JSON.parse(req.body.organization).clientid : '';
  rolename = req.body.role != '-' ? JSON.parse(req.body.role).rolename : '';
  extension = req.body.extensionComboBox != '-' ? JSON.parse(req.body.extensionComboBox).extension : '';

  var groupsObj = req.body.groups;
  var groups;

  if (!groupsObj) {
    groups = [];
  } else if (typeof groupsObj === 'string') {
    groups = [JSON.parse(groupsObj)];
  } else {
    groups = groupsObj.map(json => JSON.parse(json));
  }

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'UPDATE users SET ? WHERE username = ?';
            var setditions = [
                {
                    username: username,
                    password: password,
                    clientid: clientid,
                    rolename: rolename,
                    extension: extension,
                    name: name,
                    logo: logo,
                    company: company,
                    email: email,
                    mobile: mobile,
                    fax: fax,
                    is_active: is_active
                },
                originUsername
            ];

            conn.query(sql, setditions, function (err, result) {
                var sql_del = 'DELETE FROM user_group WHERE username = ?';
                var conditions = [username];

                conn.query(sql_del, conditions, function (err, result) {
                    console.log(sql_del);
                });

                groups.forEach(function (element) {
                    var sql_ins = 'INSERT INTO user_group SET ?';
                    var ug = {
                        username: username,
                        group_id: element.group_id
                    };

                    conn.query(sql_ins, ug, function (err, result) {
                        console.log(sql_ins);
                    });
                });

                setTimeout(() => {
                    conn.release();
                }, 1000);

                if (!err)
                    res.redirect('/etbs-users');
                else
                    res.redirect('/etbs-users/edit/' + originUsername + '?error=1');
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/remove/:username', function(req, res, next) {
  var username = req.params.username;

  var password  = '';
  var clientid  = '';
  var extension = '';
  var name      = '';
  var logo      = '';
  var company   = '';
  var email     = '';
  var mobile    = '';
  var fax       = '';
  var is_active = '';
  
  var rolename  = '';
  var cnt       = '';

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = `SELECT password, clientid, extension, name, logo, company, 
      email, mobile, fax, is_active, rolename 
    FROM users WHERE username = ? LIMIT 1 OFFSET 0`;
            var conditions = [username];

            conn.query(sql, conditions, function (err, result) {
                password = result.length ? result[0].password : '';
                clientid = result.length ? result[0].clientid : '';
                extension = result.length ? result[0].extension : '';
                name = result.length ? result[0].name : '';
                logo = result.length ? result[0].logo : '';
                company = result.length ? result[0].company : '';
                email = result.length ? result[0].email : '';
                mobile = result.length ? result[0].mobile : '';
                fax = result.length ? result[0].fax : '';
                is_active = result.length ? result[0].is_active : '';

                if (result.length) {
                    rolename = result[0].rolename ? result[0].rolename : '';
                }

                var sql = 'SELECT COUNT(1) AS cnt FROM user_group WHERE username = ?';
                var conditions = [username];

                conn.query(sql, conditions, function (err, resultCnt) {
                    cnt = resultCnt.length ? resultCnt[0].cnt : 0;

                    res.render('v1/etbsUsersForm', {
                        action: '/etbs-users/delete',
                        username: username,
                        password: password,
                        clientid: clientid,
                        extension: extension,
                        name: name,
                        logo: logo,
                        company: company,
                        email: email,
                        mobile: mobile,
                        fax: fax,
                        is_active: is_active,
                        rolename: rolename,
                        cnt: cnt
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
  var originUsername = req.body.originUsername;

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'DELETE FROM users WHERE username = ?';
            var conditions = [originUsername];

            conn.query(sql, conditions, function (err, result) {
                conn.release();
                res.redirect('/etbs-users');
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/user-group/:username', function(req, res, next) {
  var username = req.params.username;

  var groups = {};

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql =
                `SELECT username, user_group.group_id, group_name 
      FROM user_group 
        LEFT JOIN groups ON user_group.group_id = groups.group_id
      WHERE username = ?`;
            var conditions = [username];

            conn.query(sql, conditions, function (err, result) {

                if (result) {
                    groups = result.length ? result : [];

                    var sql =
                        `SELECT group_id, group_name
          FROM groups
          WHERE NOT EXISTS (
            SELECT 1 FROM user_group
            WHERE user_group.group_id = groups.group_id
              AND username = ?
          )`;
                    var conditions = [username];

                    conn.query(sql, conditions, function (err, unGroupsResult) {
                        res.render('v1/etbsUserGroups',
                            {
                                username: username,
                                groups: groups,
                                unGroups: unGroupsResult
                            }
                        );
                        conn.release();
                    });
                };
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/user-group/insert', function(req, res, next) {
  var username = req.body.preUsername;
  var group_id = req.body.unGroupId;

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'INSERT INTO user_group SET ?';
            var user_group = {
                username: username,
                group_id: group_id
            };

            conn.query(sql, user_group, function (err, result) {
                conn.release();
                res.redirect('/etbs-users/user-group/' + username);
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/user-group/delete', function(req, res, next) {
  var username = req.body.username;
  var group_id = req.body.groupId;

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'DELETE FROM user_group WHERE username = ? AND group_id = ?';
            var conditions = [
                username,
                group_id
            ];

            conn.query(sql, conditions, function (err, result) {
                conn.release();
                res.redirect('/etbs-users/user-group/' + username);
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/roles/:username', function(req, res, next) {
  var username = req.params.username;

    database.getConnection(function (err, conn) {
        if (conn) {
            var sql = 'SELECT rolename FROM users WHERE username = ? LIMIT 1 OFFSET 0';
            var conditions = [username];

            conn.query(sql, conditions, function (err, result) {

                if (result) {
                    rolename = result.length ? result[0].rolename : 'Not yet assign ROLE';

                    var sql = 'SELECT rolename, profileid FROM roles';

                    conn.query(sql, function (err, roleResult) {
                        res.render('v1/etbsUserRoles',
                            {
                                username: username,
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
  var username = req.body.username;
  var rolename = req.body.rolename;

    database.getConnection(function (err, conn) {
        if (conn) {

            var sql = 'UPDATE users SET ? WHERE username = ?';
            var setditions = [
                { rolename: rolename },
                username
            ];

            conn.query(sql, setditions, function (err, result) {
                conn.release();
                res.redirect('/etbs-users/roles/' + username);
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

module.exports = router;
