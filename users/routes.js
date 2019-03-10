var express = require('express');
var router = express.Router();
var passport = require('passport');

var userController = require('./controllers');
var expressValidators = require('../utils/express-validators');


router.get('/users', passport.authenticate('jwt'), userController.list);
router.post('/users', [
  expressValidators.email(), expressValidators.username(),
  expressValidators.password(), expressValidators.confirmPassword()
], userController.create);
router.get('/users/:id', passport.authenticate('jwt'), userController.detail);
router.put('/users/:id', passport.authenticate('jwt'), [
  expressValidators.username()
] ,userController.update);
router.delete('/users/:id', passport.authenticate('jwt'), userController.remove);

module.exports = router;
