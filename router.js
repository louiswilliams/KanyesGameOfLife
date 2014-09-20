var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.write("HELLO");
    res.end();
});

exports.route = router;
