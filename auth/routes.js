var express = require('express');
var router = express.Router();

var expressValidators = require('../utils/express-validators');
var authController = require('./controllers');

router.post('/auth/login', [
  expressValidators.username(), expressValidators.password()
], authController.login);
router.post('/auth/register', [
  expressValidators.email(), expressValidators.username(),
  expressValidators.password(), expressValidators.confirmPassword()
], authController.register);

module.exports = router;
