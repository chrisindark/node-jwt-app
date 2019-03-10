var passport = require('passport');


var googleCallback = function (req, res, next) {
  passport.authenticate('google', {
    successRedirect : '/',
    // failureRedirect : '/',
    failWithError: true
  }, function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      res.json(user);
    } else {
      res.status(401).json(info);
    }
  })(req, res, next);
};

module.exports = {
  googleCallback: googleCallback
};
