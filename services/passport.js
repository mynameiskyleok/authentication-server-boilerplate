const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy for dealing with Sign Ups and Sign Ins.
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function( email, password, done) {
  // verify this username and password, call done with the user
  // if it is the correct username and password
  // otherwise, call done with false
  User.findOne({ email: email}, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }  // no error, but user not found

    // compare passwords - is 'password' equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    })
  })
});


// Create JWT strategy for dealing with Authenticated Requests.
// Setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'), // look at the authorization request header for the token
  secretOrKey: config.secret
};

// payload is the decoded payload ( i.e., { sub: user.id, iat: timestamp } ) passed to encode in auth
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // see if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // otherwise, call done with a user object
  User.findById(payload.sub, function(err, user) {
    if ( err ) { return done(err, false); } // false means user not found

    if (user){
      done( null, user);  // no error, user found
    } else {
      done(null, false);  // no error, but user not found
    }

  })
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
