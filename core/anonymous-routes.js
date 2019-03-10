var express = require('express');
var router = express.Router();
var quoter = require('../utils/quoter');

router.get('/random-quote', function(req, res) {
  res.status(200).json({
    "quote": quoter.getRandomOne()
  });
});

module.exports = router;
