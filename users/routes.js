var express = require('express');
var router = express.Router();
var passport = require('passport');

var userController = require('./controllers');
var userValidator = require('./validators');

router.get('/users', passport.authenticate('jwt'), userController.list);
router.get('/users/:id', passport.authenticate('jwt'), userController.detail);
router.put('/users/:id', passport.authenticate('jwt'), userValidator() ,userController.update);
router.delete('/users/:id', passport.authenticate('jwt'), userController.remove);

module.exports = router;
