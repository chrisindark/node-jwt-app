var app = require('./config/express-config');

// connect to mongoDB database
require('./config/mongoose-config');

module.exports = app;
