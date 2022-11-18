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

router.get('/', [passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), roles.can('view etbsExtensions')], function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            var sql =
                `SELECT extension, clientid, name, orgid, exttype,
          has_license, budget, balance, tenant, authorization_code,
          rent_charge, created_at, updated_on 
        FROM extensions`;

            conn.query(sql, function (err, result) {
                res.render('v1/etbsExtensions',
                    {
                        title: 'eTBS | etbsExtensions',
                        extensions: result,
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
router.get('/', function(req, res, next) {

  
});

module.exports = router;
