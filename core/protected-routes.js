var express = require('express');
var router = express.Router();
var passport = require('passport');
var quoter = require('../utils/quoter');


router.get('/protected/random-quote', passport.authenticate('jwt'), function(req, res) {
  res.status(200).json({
    "quote": quoter.getRandomOne()
  });
});

module.exports = router;
