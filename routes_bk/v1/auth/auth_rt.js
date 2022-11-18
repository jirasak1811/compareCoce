//
var express = require('express');
var router = express.Router();
const passport = require('passport');


/* GET home page. */
router.get('/', passport.authenticate('bearer', { failureRedirect: '/api/v1/signin' }), function(req, res) {
    console.log('Authentication was called in the Sample');
    //res.redirect('/');
});

router.get('/openid/return', passport.authenticate('bearer', { failureRedirect: '/api/v1/signin' }), function(req, res) {
    console.log('We received a return from AzureAD. (GET)')
    //res.redirect('/')
});

router.post('/openid/return', passport.authenticate('bearer', { failureRedirect: '/api/v1/signin' }), function(req, res) {
    console.log('We received a return from AzureAD. (POST)')
    //res.redirect('/')
});

module.exports = router;