var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

//var libs = process.cwd() + '/libs/';
require('../db/mongoose');
//var config = require(libs + 'config');
var config = require('../config/config.json');

var User = require('../model/user');
var Client = require('../model/client');
var AccessToken = require('../model/accessToken');
var RefreshToken = require('../model/refreshToken');

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        console.log(user);
        done(err, user);
    });
});

passport.use(new BasicStrategy(
    function(username, password, done) {
        Client.findOne({ clientId: username }, function(err, client) {
            if (err) {
            	return done(err);
            }

            if (!client) {
            	return done(null, false);
            }

            if (client.clientSecret !== password) {
            	return done(null, false);
            }

            return done(null, client);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
        Client.findOne({ clientId: clientId }, function(err, client) {
            if (err) {
            	return done(err);
            }

            if (!client) {
            	return done(null, false);
            }

            if (client.clientSecret !== clientSecret) {
            	return done(null, false);
            }

            return done(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, done) {
        AccessToken.findOne({ token: accessToken }, function(err, token) {

            if (err) {
            	return done(err);
            }

            if (!token) {
            	return done(null, false);
            }

            if( Math.round((Date.now()-token.created)/1000) > config.security.tokenLife ) {

                AccessToken.remove({ token: accessToken }, function (err) {
                    if (err) {
                    	return done(err);
                    }
                });

                return done(null, false, { message: 'Token expired' });
            }

            User.findById(token.userId, function(err, user) {

                if (err) {
                	return done(err);
                }

                if (!user) {
                	return done(null, false, { message: 'Unknown user' });
                }

                var info = { scope: '*' };
                done(null, user, info);
            });
        });
    }
));
