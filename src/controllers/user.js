/**
 * @module controllers/user
 * This module performs all the work for the user routes.
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const errs = require('restify-errors');
const User = require('../models/user');
const { presentUser } = require('../presentation/user');

/**
 * Create a User
 */
function createUser(req, res, next) {
  // Accepted params for new users
  const {
    fName, lName, email, password, dateOfBirth,
  } = req.body;

  return User.create({
    fName,
    lName,
    email,
    password,
    dateOfBirth,
  })
    .then(presentUser.bind(null)) // Present the user
    .then((presentedUser) => {
      // Return the presented user
      res.send(201, presentedUser);
      return next();
    })
    .catch((err) => {
      // Handle duplicate resource when email is set as unique
      if (err && err.code && err.code === 11000) {
        return next(new errs.ConflictError((err && err.message) || 'Resource already exists.'));
      }
      return next(new Error(err));
    });
}

/**
 * Get a User
 */
function getUser(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  // Use the data from the token for search
  return User.findOne({ _id: req.decoded.userId, email: req.decoded.userEmail })
    .then(presentUser.bind(null))
    .then((presentedUser) => {
      if (!presentedUser) {
        res.send(404, {});
        return next();
      }
      res.send(presentedUser);
      return next();
    });
}

/**
 * Update a User
 */
function updateUser(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  return User.findOne({ _id: req.decoded.userId, email: req.decoded.userEmail })
    .then((user) => {
      if (!user) {
        return Promise.reject(new errs.NotFoundError('User not found.'));
      }
      // Disable eslint because I can't think of a cleaner way to do this right now and this works.
      /* eslint-disable */
      // Acceptable parameters to update on a user.
      const userUpdates = {
        fName, lName, email, password, dateOfBirth,
      } = req.body;
      /* eslint-enable */
      // Update the object from the database
      const updatedUser = _.merge(user, userUpdates);
      // Save the updated user object
      return User.findByIdAndUpdate(user.id, updatedUser, { new: true });
    })
    .then(presentUser.bind(null))
    .then((presentedUser) => {
      res.send(presentedUser);
      return next();
    })
    .catch(error => next(error));
}

/**
 * Performs an aggregation returning a user and all of their ID Cards and Medical Recommendations.
 */
function getUserProfile(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resources.'));
  }

  // Aggregate query
  const aggQuery = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.decoded.userId),
      },
    },
    {
      $lookup: {
        from: 'idcards',
        localField: '_id',
        foreignField: 'userId',
        as: 'idcards',
      },
    },
    {
      $lookup: {
        from: 'medrecs',
        localField: '_id',
        foreignField: 'userId',
        as: 'medrecs',
      },
    },
  ];

  // Perform the aggregation
  return User.aggregate(aggQuery)
    .then(([userData]) => {
      if (!userData) {
        res.send(404, {});
        return next();
      }

      res.send(presentUser(userData));
      return next();
    });
}

module.exports = {
  getUserProfile,
  createUser,
  getUser,
  updateUser,
};
