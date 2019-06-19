const errs = require('restify-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

/*
 * Validate a users auth token
 */
function authenticate(req, res, next) {
  // check header or url parameters or post parameters for token
  const token = (req.body && req.body.token) || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return next(new errs.ForbiddenError());
  }

  // verifies secret and checks exp
  return new Promise((pResolve, pReject) => {
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return pReject(err);
      }
      return pResolve(decoded);
    });
  })
    .then((decoded) => {
      // if everything is good, save to request for use in other routes
      req.decoded = decoded;
      return next();
    })
    .catch(err => next(new errs.ForbiddenError(err)));
}

/*
 * Create a token for a user.
 */
function getToken(req, res, next) {
  return User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
        return next();
      }
      if (user.password !== req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        return next();
      }
      const payload = {
        userId: user.id,
        userEmail: user.email,
      };
      const token = jwt.sign(payload, 'secret', {
        expiresIn: 1440, // expires in 24 hours
      });
      res.json({
        success: true,
        message: 'Enjoy your token!',
        token,
      });
      return next();
    })
    .catch(err => next(new Error(err)));
}

module.exports = {
  authenticate,
  getToken,
};
