var validatorCheck = require('express-validator/check');
var validatorMiddlewareOptions = require('../config/express-validator-config');

var User = require('./models');

var filterColumns = ['username', 'email'];
var orderingColumns = ['createdAt', '-createdAt'];
var pageSizes = [10, 20, 50, 100];

// var list = function (req, res) {
//     User.find(function (err, users) {
//       if (err) {
//         res.status(400).send(err);
//       }
//       res.json(users);
//     });
// };

var list = function (req, res) {
  var paginateOptions = {};
  if (req.query.page) {
    paginateOptions.page = req.query.page;
  }
  paginateOptions.limit = pageSizes[0];
  if (req.query.limit && pageSizes.indexOf(parseInt(req.query.limit, 10)) !== -1) {
    paginateOptions.limit = req.query.limit;
  }
  if (req.query.o && orderingColumns.indexOf(req.query.o) !== -1) {
    paginateOptions.sort = req.query.o;
  }

  var filterOptions = {};
  filterColumns.forEach(function (value, index, array) {
    if (req.query[value]) {
      filterOptions[value] = req.query[value];
    }
  });

  User
    .paginate(filterOptions, paginateOptions,
    function (err, users) {
      if (err) {
        res.status(400).json(err);
      }
      res.json(users);
    });
};

var detail = function (req, res) {
  User
    .checkPermissions(req.user)
    .findById(req.params.id, function (err, user) {
      if (err) {
        res.json(err);
      }
      return res.json(user);
    });
};

var update = function (req, res, next) {
  var errors = validatorCheck.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      errors.formatWith(validatorMiddlewareOptions.errorFormatter).mapped()
    );
  }
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      msg: 'You do not have permission to perform this action.'
    })
  }

  User.findByIdAndUpdate(req.params.id, { username: req.body.username }, { new: true },
    function (err, user) {
      if (err) {
        res.json(err);
      }
      res.json(user);
    });
};

var remove = function (req, res) {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      msg: 'You do not have permission to perform this action.'
    })
  }

  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (!user) {
      res.status(404).json(err);
    }
    return res.json(user);
  });
};

module.exports = {
  list: list,
  detail: detail,
  remove: remove,
  update: update
};
