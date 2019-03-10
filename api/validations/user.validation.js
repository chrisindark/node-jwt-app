var Joi = require('joi');

var User = require('../../users/models');


module.exports = {
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(User.roles)
    }
  },

  createUser: {
    body: {
      email: Joi.string().email().required(),
      // password: Joi.string().min(8).max(20).required(),
      username: Joi.string().min(8).max(20).required()
      // name: Joi.string().max(128),
      // role: Joi.string().valid(User.roles),
    }
  },

  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      // password: Joi.string().min(8).max(20).required(),
      username: Joi.string().min(8).max(20).required()
      // name: Joi.string().max(128),
      // role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
    }
  },

  updateUser: {
    body: {
      email: Joi.string().email(),
      // password: Joi.string().min(8).max(20).required(),
      username: Joi.string().min(8).max(20).required()
      // name: Joi.string().max(128),
      // role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
    }
  }
};
