var varsConfig = require('./vars-config');

var jwtConfig = {
  'secret': varsConfig.jwtSecret
};

module.exports = jwtConfig;
