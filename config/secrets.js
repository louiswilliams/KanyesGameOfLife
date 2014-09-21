/**
 * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT * IMPORTANT *
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" credentials so that
 * all features could work out of the box.
 *
 * Untrack secrets.js before pushing your code to public GitHub repository:
 *
 * git rm --cached config/secrets.js
 *
 * If you have already committed this file to GitHub with your keys, then
 * refer to https://help.github.com/articles/remove-sensitive-data
*/

module.exports = {

  db: process.env.MONGODB|| 'mongodb://admin:hello@kahana.mongohq.com:10059/hack_gt',

  sessionSecret: process.env.SESSION_SECRET || 'chrisbattagliatakesituptherear',

  twitter: {
      consumerKey: process.env.TWITTER_KEY || '3Muxu1Uudb989aVFcXqibvbvo',
      consumerSecret: process.env.TWITTER_SECRET || '8NkVZgGzoOn6gtyYdHk0YJi2Gu7sCy6iCnnfcpFJV9zOIm21gS',
      callbackURL: '/auth/twitter/callback',
      passReqToCallback: true
  }
};
