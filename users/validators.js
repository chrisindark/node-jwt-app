var validatorCheck = require('express-validator/check');

var User = require('./models');

module.exports = function () {
  return [
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
            // We have to send true if validation message needs to show up.
            // False wont work
            return true;
          }
        });
    })
    .withMessage('Username already exists. Please try another.')
  ];
};
