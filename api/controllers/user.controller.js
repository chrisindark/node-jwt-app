var httpStatus = require('http-status');
var omit = require('lodash').omit;
var User = require('../models/user.model');


exports.load = function (req, res, next, id) {
  try {
    User.get(id).exec().then(function (user) {
      req.locals = { user: user };
      return next();
    });
  } catch (error) {
    return next(error);
  }
};

exports.getUser = function (req, res) {
  res.json(req.locals.user.transform());
};

exports.loggedIn = function (req, res) {
  res.json(req.user.transform());
};

exports.list = function (req, res, next) {
  try {
    User.list(req.query).exec().then(function (users) {
      var transformedUsers = users.map(function (user) {
        return user.transform();
      });
      res.json(transformedUsers);
    });
  } catch (error) {
    next(error);
  }
};

exports.create = function (req, res, next) {
  try {
    var user = new User(req.body);
    user.save()
      .then(function (user) {
        res.status(httpStatus.CREATED);
        res.json(user.transform());
      });
  } catch (e) {
    next(User.checkDuplicateEmail(e));
  }
};

exports.update = function (req, res, next) {
  var omitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  var updatedUser = omit(req.body, omitRole);
  var user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then(function (user) {
      res.json(savedUser.transform())
    })
    .catch(function (e) {
      next(User.checkDuplicateEmail(e));
    });
};

exports.remove = function (req, res, next) {
  var user = req.locals.user;

  user.remove()
    .then(function () {
      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(function (e) {
      next(e)
    });
};

exports.replace = function (req, res, next) {
  try {
    var user = req.locals.user;
    var newUser = new User(req.body);
    var omitRole = user.role !== 'admin' ? 'role' : '';
    var newUserObject = omit(newUser.toObject(), '_id', omitRole);

    user.update(newUserObject, { override: true, upsert: true }).exec()
      .then(function (user) {
        if (!user) {}
        User.findById(user._id).exec().then(function (user) {
          res.json(user.transform());
        });
      });
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};
