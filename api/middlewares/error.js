var httpStatus = require('http-status');
var expressValidation = require('express-validation');

var APIError = require('../utils/api-error');
var varsConfig  = require('../../config/vars-config');


// Error handler. Send stacktrace only during development
var handler = function (err, req, res, next) {
  var response = {
    code: err.status || httpStatus.INTERNAL_SERVER_ERROR,
    message: err.message || httpStatus[err.status],
    errors: err.errors || {},
    stack: err.stack
  };

  if (varsConfig.env !== 'development') {
    delete response.stack;
  }

  res.status(response.code);
  res.json(response);
};

exports.handler = handler;

// If error is not an instanceOf APIError, convert it.
exports.converter = function (err, req, res, next) {
  var convertedError = err;

  if (err instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: 'Validation Error',
      errors: err.errors,
      status: err.status,
      stack: err.stack
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack
    });
  }

  return handler(convertedError, req, res);
};

// Catch 404 and forward to error handler
exports.notFound = function (req, res, next) {
  var err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND
  });

  return handler(err, req, res);
};
