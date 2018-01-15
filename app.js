var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose'); // mongoose for mongodb
var logger = require('morgan'); // log requests to the console
var bodyParser = require('body-parser'); // pull information with HTML POST
var validator = require('express-validator');
var paginate = require('express-paginate');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var dotenv = require('dotenv');
var passport = require('passport');

require('./users/models');
var users = require('./users/routes');

var index = require('./routes/index');
var auth = require('./routes/auth');
var oauth2 = require('./routes/oauth2');
var anonymousRoutes = require('./routes/anonymous-routes');
var protectedRoutes = require('./routes/protected-routes');

// connect to mongoDB database
mongoose.connect('mongodb://localhost/todo',
  { useMongoClient: true, promiseLibrary: global.Promise },
  function(err) {
  if (err) throw err;
});

require('./config/passport-config'); // configure passport strategies

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(paginate.middleware(10, 50)); // keep this before all routes that will use pagination
app.use(passport.initialize()); // initialize passport
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', users);
app.use('/api', anonymousRoutes);
app.use('/api', protectedRoutes);
app.use('/api', auth);
app.use('/', oauth2);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
