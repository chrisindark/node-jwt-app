var validatorCheck = require('express-validator/check');

var User = require('../users/models');

module.exports = {
  email: function () {
    return validatorCheck.check('email')
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
      .withMessage('Email already exists. Was it you?');
  },
  username: function () {
    return validatorCheck.check('username')
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
              // We have to send true if validation message needs to show up.
              // False wont work
              return true;
            }
          });
      })
      .withMessage('Username already exists. Please try another.');
  },
  password: function () {
    return validatorCheck.check('password')
      .exists()
      .withMessage('This field is required.')
      .isLength({ min: 1 })
      .withMessage('This field may not be blank.')
      .isLength({ min: 8 })
      .withMessage('Ensure this field has at least 8 characters.')
      .isLength({ max: 20 })
      .withMessage('Ensure this field has no more than 20 characters.');
  },
  confirmPassword: function () {
    return validatorCheck.check('passwordConfirm')
      .exists()
      .withMessage('This field is required.')
      .isLength({ min: 1 })
      .withMessage('This field may not be blank.')
      .custom(function(value, options) {
        return value === options.req.body.password;
      })
      .withMessage('Passwords don\'t match.');
  }
};
