const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// { session: false } -> means don't try to authenticate with cookies
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // require authentication before serving a request
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
