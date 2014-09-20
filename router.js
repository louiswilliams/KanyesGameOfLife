var express = require('express');
var router = express.Router();

// Index
router.get('/', function (req, res) {
    res.render('index');
});


/*
router.get('/:query', function(req, res) {
    res.render('visual');
});
*/

exports.route = router;
