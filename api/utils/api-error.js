var util = require('util');
var httpStatus = require('http-status');


var ExtendableError = function (options) {
  // console.log('ExtendableError', options);
  Error.call(this, options.message);
  this.name = this.constructor.name;
  this.message = options.message;
  this.errors = options.errors;
  this.status = options.status;
  this.isPublic = options.isPublic;
  this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
  this.stack = options.stack;
  // Error.captureStackTrace(this, this.constructor.name);
};
util.inherits(ExtendableError, Error);

/**
 * Creates an API error.
 * @param {string} options.message - Error message.
 * @param {number} options.status - HTTP status code of error.
 * @param {boolean} options.isPublic - Whether the message should be visible to user or not.
 */
var APIError = function (options) {
  options.status = options.status ? options.status : httpStatus.INTERNAL_SERVER_ERROR;
  options.isPublic = options.isPublic ? options.isPublic : false;
  // console.log('APIError', options);
  ExtendableError.call(this, options);
};
util.inherits(APIError, ExtendableError);

module.exports = APIError;
