var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportJWT = require("passport-jwt");
var jwtConfig = require('../config/jwt-config');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
    },
    function(req, username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user || !user.validatePassword(password)) {
                return done(null, false, { msg: 'Unable to log in with provided credentials.' });
            }

            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = jwtConfig.secret;

passport.use(new JwtStrategy(jwtOptions,
  function(jwt_payload, next) {
    User.findOne({ _id: jwt_payload.id }, function (err, user) {
      if (err) {
        return next(err, false);
      }
      if (user) {
        return next(null, user);
      }

      return next(null, false);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: 'your-secret-clientID-here',
    clientSecret: 'your-client-secret-here',
    callbackURL: "http://127.0.0.1:8000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log('here');
    return done(null, {
      'accesstoken': accessToken,
      'refreshtoken': refreshToken,
      'profile': profile
    });
  }
));
