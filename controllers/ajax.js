var secrets = require('../config/secrets');
var Twit = require('twit');
var _ = require('lodash');

exports.stream = function(req, res) {

    res.send("Starting socket");

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
