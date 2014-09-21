var secrets = require('../config/secrets');
var randomWords = require('random-words')
var Twit = require('twit');
var _ = require('lodash');

exports.stream = function(socket) {

    // sendTestData(socket);
    setInterval(function() {
        sendTestData(socket);
    }, 1000);

    // var token = _.find(req.user.tokens, { kind: 'twitter' });
    // if (!token) {
    //     res.status(403).json({error: "Not authenticated"});
    // } else if (!req.param('query')) {
    //     res.status(400).json({error: "Bad query"});
    // } else {
    //     var T = new Twit({
    //        consumer_key: secrets.twitter.consumerKey,
    //        consumer_secret: secrets.twitter.consumerSecret,
    //        access_token: token.accessToken,
    //        access_token_secret: token.tokenSecret            
    //     });

    //     T.stream('statuses/filter', {
    //         track: query,
    //         locations: '-180,-90,180,90'
    //     });
    // }
};

function sendTestData(socket) {
    message = "";
    for (var i=0; i<16; i++) {
        message += randomWords();
        if (i<15) {
            message += " ";
        }
    }
    message += ".";
    socket.emit('twitterStream', {
        y: Math.random() * 635,
        x: Math.random() * 1225,
        message:  message
    });
 }