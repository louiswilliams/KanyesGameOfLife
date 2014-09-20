/**
 * Module dependencies.
 */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');

/**
 * API keys and Passport configuration.
 */
// nothing yet

/**
 * Create Express server.
 */
var app = express();

/**
 * Socket setup.
 */
//var http = require('http').Server(app);
//var io = require('socket.io')(http);

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//io.on('connection', function(socket){
//   console.log("connection!");
//});

/**
 * Main routes.
 */
app.get('/', homeController.index);

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;