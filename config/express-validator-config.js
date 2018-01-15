var middlewareOptions = {
  errorFormatter: function(error) {
    return error.msg;
  }
};

module.exports = middlewareOptions;
