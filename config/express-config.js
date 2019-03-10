var path = require('path');
var express = require('express');
var morgan = require('morgan'); // log requests to the console
var bodyParser = require('body-parser'); // pull information with HTML POST
var compress = require('compression');
var methodOverride = require('method-override');
var cors = require('cors');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var passport = require('passport');

var validator = require('express-validator');
var paginate = require('express-paginate');


var varsConfig = require('./vars-config');
var error = require('../api/middlewares/error');

require('./../users/models');

var coreRoutes = require('./../core');
var anonymousRoutes = require('./../core/anonymous-routes');
var protectedRoutes = require('./../core/protected-routes');
var users = require('./../users/routes');
var auth = require('./../auth/routes');
var oauth = require('./../oauth/routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// request logging. dev: console | production: file
app.use(morgan(varsConfig.logs));

// parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(cookieParser());

app.use(validator());
app.use(paginate.middleware(10, 50)); // keep this before all routes that will use pagination

app.use(passport.initialize()); // initialize passport
require('./passport-config'); // configure passport strategies

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', coreRoutes);
app.use('/api', anonymousRoutes);
app.use('/api', protectedRoutes);
app.use('/api', users);
app.use('/api', auth);
app.use('/', oauth);


// if error is not an instanceOf APIError, convert it.
// app.use(error.converter);

// catch 404 and forward to error handler
// app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
