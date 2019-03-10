var passport = require('passport');

var User = require('../users/models');

var validatorCheck = require('express-validator/check');
var validatorMiddlewareOptions = require('../config/express-validator-config');


var login = function (req, res, next) {
  var errors = validatorCheck.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      errors.formatWith(validatorMiddlewareOptions.errorFormatter).mapped()
    );
  }

  passport.authenticate('local', {}, function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      return res.json(user.sendToken());
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
};

var register = function (req, res, next) {
  var errors = validatorCheck.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      errors.formatWith(function (error) {
        return error.msg;
      }).mapped()
    );
  }

  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user.save()
    .then(function (user) {
      res.json(user.sendToken());
    })
    .catch(function (err) {
      if (err) {
        res.send(err);
      }
    });
};

module.exports = {
  login: login,
  register: register
};
