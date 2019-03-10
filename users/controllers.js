var Promise = require('bluebird');
var paginate = require('express-paginate');

var validatorCheck = require('express-validator/check');

var validatorMiddlewareOptions = require('../config/express-validator-config');

var User = require('./models');


var filterColumns = ['username', 'email'];
var orderingColumns = ['createdAt', '-createdAt', 'updatedAt', '-updatedAt'];
var pageSizes = [2, 5, 10, 20, 50, 100];

// var list = function (req, res) {
//   User.find(function (err, users) {
//     if (err) {
//       res.status(400).send(err);
//     }
//     res.json(users);
//   });
// };

var list = function (req, res) {
  var paginateOptions = {};
  paginateOptions.page = 1;
  if (req.query.page) {
    paginateOptions.page = parseInt(req.query.page, 10);
  }

  paginateOptions.limit = pageSizes[0];
  if (req.query.limit && pageSizes.indexOf(parseInt(req.query.limit, 10)) !== -1) {
    paginateOptions.limit = req.query.limit;
  }

  paginateOptions.skip = (paginateOptions.page - 1) * paginateOptions.limit;

  var sortOptions = orderingColumns[0];
  if (req.query.o && orderingColumns.indexOf(req.query.o) !== -1) {
    sortOptions = req.query.o;
  }

  var filterOptions = {};
  filterColumns.forEach(function (value, index, array) {
    if (req.query[value]) {
      filterOptions[value] = req.query[value];
    }
  });

  // query for results
  var resultsQuery = User
    .find(filterOptions)
    .sort(sortOptions)
    .limit(paginateOptions.limit)
    .skip(paginateOptions.skip)
    .lean()
    .exec();

  // query for total count
  var resultsCountQuery = User.count();

  Promise.all([resultsQuery, resultsCountQuery])
    .then(function (values) {
      var pageCount = Math.ceil(values[1] / req.query.limit);
      var nextPage = null;
      var previousPage = null;

      var pages = paginate.getArrayPages(req)(3, pageCount, paginateOptions.page);
      var pagesObj = {};
      pages.map(function (page) {
        pagesObj[page.number] = page;
      });

      if (paginate.hasNextPages(req)(pageCount)) {
        nextPage = pagesObj[paginateOptions.page + 1].url;
      }
      if (paginateOptions.page > 1) {
        previousPage = pagesObj[paginateOptions.page - 1].url;
      }

      res.json({
        results: values[0],
        count: values[1],
        next: nextPage,
        previous: previousPage
      });
    })
    .catch(function (err) {
      res.status(400).json(err);
    });
};

var create = function (req, res) {
  var errors = validatorCheck.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      errors.formatWith(validatorMiddlewareOptions.errorFormatter).mapped()
    );
  }

  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user.save()
    .then(function(user) {
      res.json(user.sendToken());
    })
    .catch(function (err) {
      if (err) {
        res.send(err);
      }
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
  create: create,
  detail: detail,
  remove: remove,
  update: update
};
