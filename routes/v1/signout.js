var express = require('express');
var passport = require('passport');
var router = express.Router();

var AccessToken = require('../../model/accessToken');

/* GET home page. */
router.get('/', passport.authenticate('bearer', { failureRedirect: '/api/v1/signin', session: false }), function (req, res, next) {

    //res.send(JSON.stringify(req));
    console.log(req.user);
    console.log(req.cookies);
    //res.clearCookie('admin');
    if (req.user) {

        console.log('signout by cookies');

        res.clearCookie(req.cookies[encodeURIComponent(req.user.username)]);
        //console.log(JSON.parse(req.cookies["admin%40convergence.co.th"]).access_token);
        var accessToken = JSON.parse(req.cookies[encodeURIComponent(req.user.username)]).access_token;

        AccessToken.remove({ token: accessToken }, function (err) {
            if (err) {
                //return done(err);
                console.log(err);
                req.flash('error', err);
            }

            //req.logout();
            req.session.destroy(function (err) {
                //console.log(req.cookies);
                res.redirect('/api/v1/signin'); //Inside a callback… bulletproof!
            });
        });
    } /*else {

        console.log('signout by param');

        res.clearCookie(req.cookies[encodeURIComponent(req.query["u"])]);
        //console.log(JSON.parse(req.cookies["admin%40convergence.co.th"]).access_token);
        console.log(encodeURIComponent(req.query["u"]));
        var accessToken = JSON.parse(req.cookies[encodeURIComponent(req.query["u"])]).access_token;
        console.log(accessToken);

        AccessToken.remove({ token: accessToken }, function (err) {
            if (err) {
                //return done(err);
            }

            req.logout();
            req.session.destroy(function (err) {
                //console.log(req.cookies);
                res.redirect('/api/v1/signin'); //Inside a callback… bulletproof!
            });
        });
    }*/
    //res.send(req.query["u"]);
});

module.exports = router;
