var express = require('express');
var bodyParser = require('body-parser');
var router = require('./router');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', router.route);

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Server started at port " + port);