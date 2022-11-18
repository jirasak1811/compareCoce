var faker = require('faker');

//var libs = process.cwd() + '/libs/';

//var log = require(libs + 'log')(module);
var db = require('../db/mongoose');
//var config = require(libs + 'config');
var config = require('../config/config.json');

var User = require('../model/user');
var Client = require('../model/client');
var AccessToken = require('../model/accessToken');
var RefreshToken = require('../model/refreshToken');

//User.remove({}, function(err) {
User.findOneAndRemove({ username: config.default.user.username }, function(err) {
    var user = new User({
        username: config.default.user.username,
        password: config.default.user.password,
        role: config.default.user.role
    });

    user.save(function(err, user) {
        if(!err) {
            //log.info("New user - %s:%s", user.username, user.password);
            console.log("New user - %s:%s:%s", user.username, user.password, user.role);
        }else {
            //return log.error(err);
            return console.log(err);
        }
    });
});

//Client.remove({}, function(err) {
Client.findOneAndRemove({ name: config.default.client.name, clientId: config.default.client.clientId }, function(err) {

    var today = new Date();
    var curr_year = today.getFullYear();

    var client = new Client({
        name: config.default.client.name,
        clientId: config.default.client.clientId,
        clientSecret: config.default.client.clientSecret,
        extLicense: config.default.client.extLicense,
        createdAt: new Date(),
        licExpires: today.setFullYear(curr_year + 70)
    });

    client.save(function(err, client) {

        if(!err) {
            //log.info("New client - %s:%s", client.clientId, client.clientSecret);
            console.log("New client - %s:%s", client.clientId, client.clientSecret);
        } else {
            //return log.error(err);
            return console.log(err);
        }

    });
});

AccessToken.remove({}, function (err) {
    if (err) {
        //return log.error(err);
        return console.log(err);
    }
});

RefreshToken.remove({}, function (err) {
    if (err) {
        //return log.error(err);
        return console.log(err);
    }
});

setTimeout(function() {
    db.disconnect();
}, 3000);
