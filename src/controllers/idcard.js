/**
 * @module controllers/idcard
 * This module performs all the work for the idcard routes.
 */
const _ = require('lodash');
const errs = require('restify-errors');
const IDCard = require('../models/idcard');
const { presentIDCard, presentIDCards } = require('../presentation/idcard');

/**
 * Create an ID Card
 */
function createIDCard(req, res, next) {
  const {
    stateIdNumber, state, expirationDate, imagePath,
  } = req.body;
  const { userId } = req.decoded;

  return IDCard.create({
    userId,
    stateIdNumber,
    state,
    expirationDate,
    imagePath,
  })
    .then(presentIDCard.bind(null))
    .then((presentedIDCard) => {
      res.send(201, presentedIDCard);
      return next();
    })
    .catch((err) => {
      if (err && err.code && err.code === 11000) {
        return next(new errs.ConflictError((err && err.message) || 'Resource already exists.'));
      }
      return next(new Error(err));
    });
}

/**
 * Get an ID Card
 */
function getIDCard(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  if (req.decoded.userId !== req.params.userId) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  return IDCard.findOne({ _id: req.params.idCardId, userId: req.params.userId })
    .then(presentIDCard.bind(null))
    .then((presentedIDCard) => {
      if (!presentedIDCard) {
        res.send(404, {});
        return next();
      }

      res.send(presentedIDCard);
      return next();
    });
}

/**
 * Get all the ID Cards for a user
 */
function getIDCards(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  if (req.decoded.userId !== req.params.userId) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  return IDCard.find({ userId: req.params.userId })
    .then(presentIDCards.bind(null))
    .then((presentedIDCards) => {
      res.send(presentedIDCards);
      return next();
    });
}

/**
 * Update an ID Card
 */
function updateIDCard(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  if (req.decoded.userId !== req.params.userId) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  return IDCard.findOne({ userId: req.params.userId, _id: req.params.idCardId })
    .then((idCard) => {
      if (!idCard) {
        return Promise.reject(new errs.NotFoundError('IDCard not found.'));
      }
      // Disable eslint because I can't think of a cleaner way to do this right now and this works.
      /* eslint-disable */
      const idCardUpdates = {
        userId, stateIdNumber, state, expirationDate, imagePath,
      } = req.body;
      /* eslint-enable */
      const updatedIDCard = _.merge(idCard, idCardUpdates);
      return IDCard.findByIdAndUpdate(idCard.id, updatedIDCard, { new: true });
    })
    .then(presentIDCard.bind(null))
    .then((presentedIDCard) => {
      res.send(presentedIDCard);
      return next();
    })
    .catch(error => next(error));
}

/**
 * Delete an ID Card
 */
function deleteIDCard(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  if (req.decoded.userId !== req.params.userId) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  return IDCard.deleteOne({ userId: req.params.userId, _id: req.params.idCardId })
    .then((response) => {
      if (response && response.n && response.n === 1) {
        res.send(204);
        return next();
      }
      return next(new errs.NotFoundError('IDCard not found.'));
    });
}

module.exports = {
  createIDCard,
  getIDCard,
  getIDCards,
  updateIDCard,
  deleteIDCard,
};
