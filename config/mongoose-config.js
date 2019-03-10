var mongoose = require('mongoose'); // mongoose for mongodb
var Promise = require('bluebird');

var varsConfig = require('./vars-config');
var logger = require('./winston-logger-config');

var mongooseConfig = {
  promiseLibrary: Promise,
  keepAlive: 1,
  useNewUrlParser: true
};

// Exit application on error
mongoose.connection.on('error', function (err) {
  logger.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// print mongoose logs in dev env
if (varsConfig.env === 'development') {
  mongoose.set('debug', true);
}

var connect = function () {
  mongoose.connect(varsConfig.mongo.uri, mongooseConfig, function (err) {
    if (err) throw err;
  });

  return mongoose.connection;
};


module.exports = connect();
