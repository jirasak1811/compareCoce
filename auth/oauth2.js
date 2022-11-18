var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');

//var libs = process.cwd() + '/libs/';
//var appPath = path.dirname(require.main.filename); // app root path

//var config = require(libs + 'config');
var config = require('../config/config.json');
//var log = require(libs + 'log')(module);

var db = require('../db/mongoose');
var User = require('../model/user');
var AccessToken = require('../model/accessToken');
var RefreshToken = require('../model/refreshToken');

// create OAuth 2.0 server
var aserver = oauth2orize.createServer();

//console.log('test');

// Generic error handler
var errFn = function (cb, err) {
	if (err) {
        console.log(err);
		return cb(err);
	}
};

// Destroys any old tokens and generates a new access and refresh token
var generateTokens = function (data, opts, done) {

	// curries in `done` callback so we don't need to pass it
    var errorHandler = errFn.bind(undefined, done),
	    refreshToken,
	    refreshTokenValue,
	    token,
	    tokenValue;

    RefreshToken.remove(data, errorHandler);
    AccessToken.remove(data, errorHandler);

    tokenValue = crypto.randomBytes(32).toString('hex');
    refreshTokenValue = crypto.randomBytes(32).toString('hex');

    data.token = tokenValue;
    token = new AccessToken(data);

    data.token = refreshTokenValue;
    refreshToken = new RefreshToken(data);

    refreshToken.save(errorHandler);

    token.save(function (err) {
    	if (err) {

			log.error(err);
    		return done(err);
    	}
    	done(null, tokenValue, refreshTokenValue, {
    		'expires_in': config.security.tokenLife,
			'created_at': opts.createdAt,
			'ext_license': opts.extLicense,
			'lic_expired': opts.licExpires
    	});
    });
};

// Exchange username & password for access token.
aserver.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {

    console.log('username: '+username);
    console.log('password: ' + password);
	console.log('client: '+client);

	User.findOne({ username: username }, function(err, user) {

		if (err) {
			return done(err);
		}

		if (!user || !user.checkPassword(password)) {
			return done(null, false);
		}

		var model = {
			userId: user.userId,
			clientId: client.clientId
		};

		var options = {
			createdAt: client.createdAt,
			extLicense: client.extLicense,
			licExpires: client.licExpires
		};

		generateTokens(model, options, done);
	});

}));

// Exchange refreshToken for access token.
aserver.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {

	RefreshToken.findOne({ token: refreshToken, clientId: client.clientId }, function(err, token) {
		if (err) {
			return done(err);
		}

		if (!token) {
			return done(null, false);
		}

		User.findById(token.userId, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }

			var model = {
				userId: user.userId,
				clientId: client.clientId
			};

			generateTokens(model, done);
		});
	});
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
	passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
	aserver.token(),
	aserver.errorHandler()
];
