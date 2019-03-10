var path = require('path');
var dotenv = require('dotenv');

// import .env variables
dotenv.config({
  path: path.join(__dirname, '../.env'),
  sample: path.join(__dirname, '../.env.example'),
  debug: process.env.DEBUG
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri: process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TESTS
      : process.env.MONGO_URI
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
};
