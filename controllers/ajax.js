var secrets = require('../config/secrets');
var randomWords = require('random-words')
var Twit = require('twit');
var User = require('../models/User')
var _ = require('lodash');
var sentiment = require('sentiment');

exports.stream = function(socket, msg) {

            var T = new Twit({
               consumer_key: secrets.twitter.consumerKey,
               consumer_secret: secrets.twitter.consumerSecret,
               access_token: "391188422-TGrNHdpWElJrzqELkpXJBQhe8EK2KIUuO5ojh4CG",
               access_token_secret: "SMOTGnAixh2kf8R4V5SkEdJwJjG95EuDWUYnaVs0LOR3C",
            });
            var usBox = ['-124.13', '48.0', '-69.90', '30.1'];
            var stream = T.stream('statuses/filter', {
                track: msg.query,
                language: "en"
            });

            stream.on('tweet', function(tweet) {
                if (tweet.geo) {
                    socket.emit('twitterStream', tweet);                
                }
            });

};

function textToScore(text) {
    result1 = sentiment(text);
    //console.log(result1);

    score = result1.score / 10;

    if (score > 1) score = 1;
    if (score < -1) score = -1;
    return score;
}

function sendTestData(socket) {
    message = "";
    for (var i=0; i<16; i++) {
        message += randomWords();
        if (i<15) {
            message += " ";
        }
    }
    message += ".";
    score = textToScore(message);
    socket.emit('twitterStream', {
        y: Math.random() * 635,
        x: Math.random() * 1225,
        message:  message,
        score: score
    });
 }
