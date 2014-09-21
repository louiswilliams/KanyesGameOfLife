/**
 * Module dependencies.
 */

// main
var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('express-flash');
var path = require('path');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

// storage
var session = require('express-session');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')({ session: session });

// passport
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy

// dev tools & security
var logger = require('morgan');
var csrf = require('lusca').csrf();
var _ = require('lodash');


/**
 * Controllers (route handlers).
 */
var ajaxController = require('./controllers/ajax');

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * CSRF whitelist.
 */
var csrfExclude = ['/url1', '/url2'];

/**
 * Create Express server.
 */
var app = express();

/**
 * Socket setup.
 */

// socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

// session store
var sessionStore = new MongoStore({
    url: secrets.db,
    auto_reconnect: true
});

// setup
io.use(function(socket, accept) {
  handshake = socket.handshake;

  if (handshake.headers.cookie) {
    handshake.cookie = cookie.parse(handshake.headers.cookie);

    handshake.sessionId = cookieParser.signedCookie(handshake.cookie['express.sid'], secrets.sessionSecret);
    // console.log(handshake.sessionId);
    sessionStore.get(handshake.sessionId, function(err, session) {
        handshake.session = session;
        if (!err && !session ) {
            err = new Error('session not found');
        }
        handshake.session = session;
        //accept(err, true);
    });

    accept(null, true);
  }
});

//connect
io.on('connection', function(socket) {
    console.log("connection from client: ",socket.id);
    socket.on('queryStream', function(msg) {
        ajaxController.stream(socket, msg);
    });
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(connectAssets({
    paths: ['public/css', 'public/js'],
    helperContext: app.locals
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    secret: secrets.sessionSecret,
    store: sessionStore,
    key: 'express.sid'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
    // CSRF protection.
    if (_.contains(csrfExclude, req.path)) return next();
    csrf(req, res, next);
});
app.use(function(req, res, next) {
    // Make user object available in templates.
    res.locals.user = req.user;
    next();
});
app.use(function(req, res, next) {
    // Remember original destination before login.
    var path = req.path.split('/')[1];
    if (/auth|login|logout|signup|img|fonts|favicon/i.test(path)) {
        return next();
    }
    req.session.returnTo = req.path;
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));
app.use(function(req, res, next) {
    req.io = io;
    next();
});


/**
 * Setup new SimpleUser model schema.
 */

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    provider: String,
    uid: String,
    name: String,
    image: String,
    token: String,
    tokenSecret: String,
    created: {type: Date, default: Date.now}
});
mongoose.model('SimpleUser', UserSchema);
var SimpleUser = mongoose.model('SimpleUser');

/**
 * Setup TwitterStrategy passport.
 */
passport.use(new TwitterStrategy(secrets.twitter,
    function(request, token, tokenSecret, profile, done) {
        SimpleUser.findOne({uid: profile.id}, function(err, user) {
            if(user) {
                done(null, user);
            } else {
                var user = new SimpleUser();
                user.provider = "twitter";
                user.uid = profile.id;
                user.name = profile.displayName;
                user.image = profile._json.profile_image_url;
                user.token = token;
                user.tokenSecret = tokenSecret;
                user.save(function(err) {
                    if(err) { throw err; }
                    done(null, user);
                });
            }
        })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function(uid, done) {
    SimpleUser.findOne({uid: uid}, function (err, user) {
        done(err, user);
    });
});

/**
 * Main routes.
 */
app.get('/', function(req, res){
    res.render('home', { user: req.user });
});
app.get('/auth/twitter',
    passport.authenticate('twitter'),
    function(req, res){
        // The request will be redirected to Twitter for authentication, so this
        // function will not be called.
});
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
});
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

/**
 * Start Express server.
 */
http.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;