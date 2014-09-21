var secrets = require('../config/secrets');
var User = require('../models/User');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');
var request = require('request');
var Twit = require('twit');
var _ = require('lodash');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');

/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
//    var token = _.find(req.user.tokens, { kind: 'twitter' });
//
//    var T = new Twit({
//        consumer_key: secrets.twitter.consumerKey,
//        consumer_secret: secrets.twitter.consumerSecret,
//        access_token: token.accessToken,
//        access_token_secret: token.tokenSecret
//    });
//
//    T.get('search/tweets', { q: 'nodejs since:2013-01-01', geocode: '40.71448,-74.00598,5mi', count: 10 }, function(err, reply) {
//        if (err) return next(err);
//    });
    res.render('home', {
        title: 'Home'
    });
};

//exports.postAuth = function(req, res, next) {
//    passport.authenticate('twitter-token', function (req, res) {
//        res.send(req.user? 200 : 401);
//    })(req, res, next);
//};


