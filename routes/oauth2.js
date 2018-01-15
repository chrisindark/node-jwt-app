var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/auth/google', passport.authenticate('google', {
  scope : [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  failWithError: true
}));

router.get('/auth/google/callback', function (req, res, next) {
  passport.authenticate('google', {
    successRedirect : '/',
    // failureRedirect : '/',
    failWithError: true
  }, function(err, user, info) {
    if (err) { return next(err); }

    if (user) {
      res.json(user);
    } else {
      res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
