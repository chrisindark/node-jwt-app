var express = require('express');
var router = express.Router();
var passport = require('passport');

var oauthController = require('./controllers.js');


router.get('/auth/google', passport.authenticate('google', {
  scope : [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  failWithError: true
}));

router.get('/auth/google/callback', oauthController.googleCallback);

module.exports = router;
