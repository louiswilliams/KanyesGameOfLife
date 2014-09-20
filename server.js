var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var indexRouter = require('./router');
var ajaxRouter = require('./ajax');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var logger = morgan("dev");

app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', indexRouter.route);
app.use('/ajax', ajaxRouter.route);

// io.on('connection', function(socket){ 
//   console.log("connection!");
// });

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Server started at port " + port);
