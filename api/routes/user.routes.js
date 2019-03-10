var express = require('express');
var validate = require('express-validation');

var controller = require('../controllers/user.controller');
var authMiddleware = require('../middlewares/auth');
var userValidations = require('../validations/user.validation');
