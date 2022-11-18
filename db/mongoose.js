var mongoose = require('mongoose');

//var libs = process.cwd() + '/libs/';
var options = {
    useMongoClient: true,
    user: 'root',
    pass: 'convergenceDB@Admin_1'
};
//var log = require(libs + 'log')(module);
//var config = require(libs + 'config');
var config = require('../config/config.json');

mongoose.connect(config.mongoose.uri, options);

var db = mongoose.connection;

db.on('error', function(err) {
    //log.error('Connection error:', err.message);
    console.log('Connection error:', err.message);
});

db.once('open', function callback() {
    //log.info("Connected to DB!");
    console.log("Connected to DB!");
});

module.exports = mongoose;
