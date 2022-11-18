var express = require('express');
var passport = require('passport');
var router = express.Router();
var database = require('./database');
var ConnectRoles = require('connect-roles');
var md5 = require('md5');

var User = require('../../model/user');

var roles = new ConnectRoles();

// set grant user for can view dashboard role
roles.use('view usersM', function (req) {

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

router.delete('/:username', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: 'DELETE FROM users WHERE username=?',
                values: [req.params.username]
            }, function (err, rows) {
                if (err)
                    res.status(500).send('Can not delete user \'' + req.params.username + '\'');
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

router.post('/update', function (req, res, next) {
    // console.log(req.body);
    if (req.body.name == 'rolename') {
        var sql = 'UPDATE users SET ??=? WHERE username=?';
        var values = [
            req.body.name,
            req.body.value.trim() ? req.body.value.trim() : null,
            req.body.pk
        ];
        database.getConnection(function (err, conn) {
            User.update(
                { "username": req.body.pk },
                { $set: { "role": req.body.value } }, function (err, row) {
                    // console.log(err)
                    // console.log(row)
                });
            if (conn) {

                conn.query({
                    sql: sql,
                    values: values
                }, function (err, rows) {
                    conn.release()
                    if (err)
                        return next(err);
                    else
                        res.send(JSON.stringify({
                            success: true,
                            //redirect: '/api/v1/usersM',
                        }));
                });
            } else {
                res.status(500).send('Can not connect to database');
            }
        });
    } else {
        var sql = 'UPDATE users SET ??=? WHERE username=?';
        var values = [
            req.body.name,
            req.body.value.trim() ? req.body.value.trim() : null,
            req.body.pk
        ];
        console.log("values = " + values);
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
    }
});

router.post('/new', function (req, res, next) {
    if (!req.body.newUsername) {
        res.status(500).send('Username can not empty');
        return;
    } else if (!req.body.newPassword) {
        res.status(500).send('Password can not empty');
        return;
    } else if (!req.body.newRolename) {
        res.status(500).send('Rolename can not empty');
        return;
    } else if (!req.body.newName) {
        res.status(500).send('Name can not empty');
        return;
    }

    var sql = 'INSERT INTO users(username, password, clientid, rolename, name, company, email, mobile, fax, extension, is_active) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
    var values = [
        req.body.newUsername.trim(),
        md5('etbsjs' + req.body.newPassword.toString()),
        '2115BBBK0931',
        req.body.newRolename.trim(),
        req.body.newName.trim(),
        req.body.newCompany.trim(),
        req.body.newEmail.trim(),
        req.body.newMobile.trim(),
        req.body.newFax.trim(),
        req.body.newExtension.trim(),
        req.body.newActive.trim()
    ];
    database.getConnection(function (err, conn) {

        User.findOneAndRemove({ username: req.body.newUsername.trim() }, function (err) {
            var user = new User({
                username: req.body.newUsername.trim(),
                password: req.body.newPassword.trim(),
                role: req.body.newRolename.trim()
            });

            user.save(function (err, user) {
                if (!err) {
                    //log.info("New user - %s:%s", user.username, user.password);
                    console.log("New user - %s:%s:%s", user.username, user.password, user.role);
                } else {
                    //return log.error(err);
                    return console.log(err);
                }
            });
        });

        if (conn) {

            conn.query({
                sql: sql,
                values: values
            }, function (err, rows) {
                conn.release()
                if (err)
                    return next(err);
                else
                    res.send(JSON.stringify({
                        success: true,
                        //redirect: '/api/v1/usersM',
                    }));
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view users')], function (req, res, next) {

    database.getConnection(function (err, conn) { 
        if (conn) {
            conn.query({
                sql: 'SELECT username, password, rolename, extension, name, company, mobile, fax, email, is_active FROM users ORDER BY user_id'
            }, function (err, rows) {
                conn.release();
                if (rows) {
                    res.render('v1/usersM', {
                        title: 'usersM',
                        data: rows,
                        token: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token,
                        user: req.user.username,
                        ext_lic: JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).ext_license
                    });
                } else {
                    return next(err);
                }
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/alluser', function (req, res, next) {

    database.getConnection(function (err, conn) { 
        if (conn) {
            conn.query({
                sql: 'SELECT username, password, rolename, extension, name, company, mobile, fax, email, is_active FROM users ORDER BY user_id'
            }, function (err, rows) {
                conn.release();
                if (rows) {
                    res.send(JSON.stringify(rows));
                } else {
                    return next(err);
                }
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/:offset/:count', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query('SELECT COUNT(*) total FROM users', function (err, rows) {
                var total = rows[0].total;

                conn.query({
                    sql: 'SELECT username, password, rolename, extension, name, company, mobile, fax, email, is_active FROM users ORDER BY user_id LIMIT ?,?',
                    values: [
                        req.params.offset < 0 ? 0 : req.params.offset,
                        req.params.count <= 0 ? 15 : req.params.count
                    ]
                }, function (err, users) {
                    conn.release();
                    if (rows) {
                        res.send(JSON.stringify({
                            total: total,
                            data: users
                        }));
                    } else {
                        return next(err);
                    }
                });
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

module.exports = router;
