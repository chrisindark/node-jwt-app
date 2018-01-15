var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var User = mongoose.model('User');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../config/jwt-config');
var validatorCheck = require('express-validator/check');
var validatorMiddlewareOptions = require('../config/express-validator-config');


function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

router.post('/auth/login', [
  validatorCheck.check('username')
    .exists()
    .withMessage('This field is required.')
    .isLength({ min: 1 })
    .withMessage('This field may not be blank.'),

  validatorCheck.check('password')
    .exists()
    .withMessage('This field is required.')
    .isLength({ min: 1 })
    .withMessage('This field may not be blank.')

], function(req, res, next) {
  var errors = validatorCheck.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      errors.formatWith(validatorMiddlewareOptions.errorFormatter).mapped()
    );
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }

    if (user) {
      return res.json(user.sendToken());
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/auth/register', [
  validatorCheck.check('email')
    .exists()
    .withMessage('This field is required.')
    .isLength({ min: 1 })
    .withMessage('This field may not be blank.')
    .isEmail()
    .withMessage('Enter a valid email address.')
    // .isLength({ min: 8 })
    // .withMessage('Ensure this field has at least 8 characters.')
    .isLength({ max: 255 })
    .withMessage('Ensure this field has no more than 255 characters.')
    .custom(function (value) {
      return User.findOne({email: value})
        .exec()
        .then(function (err, user) {
          if (!user) {
            return true;
          }
        });
    })
    .withMessage('Email already exists. Was it you?'),

  validatorCheck.check('username')
    .exists()
    .withMessage('This field is required.')
    .isLength({ min: 1 })
    .withMessage('This field may not be blank.')
    .isLength({ min: 8 })
    .withMessage('Ensure this field has at least 8 characters.')
    .isLength({ max: 20 })
    .withMessage('Ensure this field has no more than 20 characters.')
    .custom(function (value) {
      return User.findOne({username: value})
        .exec()
        .then(function (user) {
          if (!user) {
            return true;
          }
        });
    })
    .withMessage('Username already exists. Please try another.'),

  validatorCheck.check('password')
    .exists()
    .withMessage('This field is required.')
    .isLength({ min: 1 })
    .withMessage('This field may not be blank.')
    .isLength({ min: 8 })
    .withMessage('Ensure this field has at least 8 characters.')
    .isLength({ max: 20 })
    .withMessage('Ensure this field has no more than 20 characters.'),

  validatorCheck.check('passwordConfirm')
    .exists()
    .withMessage('This field is required.')
    .isLength({ min: 1 })
    .withMessage('This field may not be blank.')
    .custom(function(value, options) {
      return value === options.req.body.password;
    })
    .withMessage('Passwords don\'t match.')

], function(req, res, next) {
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
    .then(function(user) {
      res.json(user.sendToken());
    })
    .catch(function (err) {
      if (err) {
        res.send(err);
      }
    });
});

module.exports = router;
