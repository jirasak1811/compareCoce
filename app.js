var express = require('express');
var session = require('express-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var passport = require('passport');
var ConnectRoles = require('connect-roles');
var flash = require('connect-flash');


require('./auth/auth');

var routes = require('./routes/index');
var users = require('./routes/users');
var api = {
    checkapi:require('./routes/v1/checkapi'),
    dashboard: require('./routes/v1/dashboard'),
    reports: require('./routes/v1/reports'),
    locations: require('./routes/v1/locations'),
    areacodes: require('./routes/v1/areacodes'),
    rates: require('./routes/v1/rates'),
    status: require('./routes/api'),
    login: require('./routes/v1/signin'),
    logout: require('./routes/v1/signout'),
    extensions: require('./routes/v1/extensions'),
    extDetail: require('./routes/v1/extensionsDetail'),
    groups: require('./routes/v1/organizations'),
    groupDetail: require('./routes/v1/organizationDetail'),
    trunks: require('./routes/v1/trunks'),
    trunkDetail: require('./routes/v1/trunkDetail'),
    usersM: require('./routes/v1/usersM'),
    recalculate: require('./routes/v1/recalculate'),
    directorysearch: require('./routes/v1/directorysearch'),
    // etbs-get-post
    etbsRolesRouter: require('./routes/v1/etbsRoles'),
    etbsPermissionsRouter: require('./routes/v1/etbsPermissions'),
    etbsUsersRouter: require('./routes/v1/etbsUsers'),
    etbsExtensionsRouter: require('./routes/v1/etbsExtensions'),
    //connect
    pbxtest: require('./routes/v1/pbxtest'),
}
var b2e = {
    indexRouter: require('./routes/v1/b2e/index'),
    usersRouter: require('./routes/v1/b2e/users'),
    dashboardRouter: require('./routes/v1/b2e/dashboard'),
    schedulesRouter: require('./routes/v1/b2e/schedules'),
    reportRouter: require('./routes/v1/b2e/report'),
    settingEmailRouter: require('./routes/v1/b2e/setting_email'),
    settingSmtpRouter: require('./routes/v1/b2e/setting_smtp')
}
var oauth2 = require('./auth/oauth2');
var client_lic = require('./auth/client');

var app = express();

var roles = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // optional function to customise code that runs when
        // user fails authorisation
        var accept = req.headers.accept || '';
        res.status(403);
        if (~accept.indexOf('html')) {
            res.render('access-denied', {
                action: action
            });
        } else {
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});

// required for passport
//app.use(session({ secret: "etbsjs" })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(roles.middleware());
app.use(flash()); // use connect-flash for flash messages stored in session

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    maxAge: 3600000,
    secret: 'etbsjs',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}))
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/api/v1/dashboard', api.dashboard);
app.use('/api/v1/reports', api.reports);
app.use('/api/v1/locations', api.locations);
app.use('/api/v1/areacodes', api.areacodes);
app.use('/api/v1/rates', api.rates);
app.use('/api/v1/signin', api.login);
app.use('/api/v1/signout', api.logout);
app.use('/api/v1/extensions', api.extensions);
app.use('/api/v1/extensions/info', api.extDetail);
app.use('/api/v1/organize', api.groups);
app.use('/api/v1/organize/info', api.groupDetail);
app.use('/api/v1/trunk', api.trunks);
app.use('/api/v1/trunk/info', api.trunkDetail);
app.use('/api/v1/usersM', api.usersM);
//etbs-get-post
app.use('/api/v1/etbs-roles', api.etbsRolesRouter);
app.use('/api/v1/etbs-permissions', api.etbsPermissionsRouter);
app.use('/api/v1/etbs-users', api.etbsUsersRouter);
app.use('/api/v1/etbs-extensions', api.etbsExtensionsRouter);
app.use('/api/v1/recalculate', api.recalculate);
app.use('/api/v1/directorysearch', api.directorysearch);
//connect
app.use('/api/v1/pbxtest', api.pbxtest);
//
app.use('/b2e', b2e.indexRouter);
app.use('/b2e/users', b2e.usersRouter);
app.use('/b2e/dashboard', b2e.dashboardRouter);
app.use('/b2e/schedules', b2e.schedulesRouter);
app.use('/b2e/report', b2e.reportRouter);
app.use('/b2e/setting/email', b2e.settingEmailRouter);
app.use('/b2e/setting/smtp', b2e.settingSmtpRouter);

//app.use('/api/test', api.status);
//app.use('/api/users', users);
//app.use('/api/articles', articles);
app.use('/api/oauth/token', oauth2.token);
app.use('/api/client', client_lic);
app.use('/api/checkapi', api.checkapi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
