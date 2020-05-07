const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./database');
const User = require('../models/users');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretkey;

module.exports = function(passport) {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.getUserById({ _id: jwt_payload._doc._id }, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
}