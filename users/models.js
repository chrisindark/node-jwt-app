var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');
var mongoosePaginate = require('mongoose-paginate');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../config/jwt-config');
var APIError = require('../api/utils/api-error');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'], index: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true,
    unique: true,
    minlength: 8,
    maxlength: 20
  },
  // password: {
  //   type: String,
  //   required: true,
  //   minlength: 8,
  //   maxlength: 20
  // },
  // services: {
  //   facebook: String,
  //   google: String
  // },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  admin: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null }
}, {
  timestamps: true
});

var roles = ['user', 'admin'];

UserSchema.plugin(mongooseUniqueValidator, {message: 'is already taken.'});
UserSchema.plugin(mongoosePaginate);

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.salt;
  delete obj.hash;
  return obj;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.validatePassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this.id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, jwtConfig.secret);
};

UserSchema.methods.sendToken = function () {
  return {
    token: this.generateJWT()
  };
};

UserSchema.statics = {
  roles: roles,
  get: function (id) {
    try {
      var user;
      if (mongoose.Types.ObjectId.isValid(id)) {
        this.findById(id, function (err, user) {
          if (user) {
            return user;
          }

          throw new APIError({
            message: 'User does not exist',
            status: httpStatus.NOT_FOUND
          });
        });
      }
    } catch (error) {
      throw error;
    }
  },

  checkDuplicateEmail: function (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['Email already exists']
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack
      });
    }
    return error;
  }
};

module.exports = mongoose.model('User', UserSchema);
