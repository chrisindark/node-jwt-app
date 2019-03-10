var Joi = require('joi');


module.exports = {
  register: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8).max(20)
    }
  },

  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8).max(20)
    }
  },

  oAuth: {
    body: {
      access_token: Joi.string().required()
    }
  },

  refresh: {
    body: {
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required()
    }
  }
};
