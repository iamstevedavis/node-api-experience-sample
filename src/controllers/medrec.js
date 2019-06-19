/**
 * @module controllers/medrec
 * This module performs all the work for the medical recommendation (medrec) routes.
 */
const _ = require('lodash');
const errs = require('restify-errors');
const MedRec = require('../models/medrec');
const { presentMedRec, presentMedRecs } = require('../presentation/medrec');

/**
 * Create a Medical Recommendation
 */
function createMedRec(req, res, next) {
  // Acceptable medical recommendation creation fields
  const {
    number, issuer, state, expirationDate,
  } = req.body;
  const { userId } = req.decoded;

  return MedRec.create({
    userId,
    number,
    issuer,
    state,
    expirationDate,
  })
    .then(presentMedRec.bind(null))
    .then((presentedMedRec) => {
      res.send(201, presentedMedRec);
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
 * Create a specifical medical recommendation for a user
 */
function getMedRec(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  if (req.decoded.userId !== req.params.userId) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  return MedRec.findOne({ _id: req.params.medRecId, userId: req.params.userId })
    .then(presentMedRec.bind(null))
    .then((presentedMedRec) => {
      if (!presentedMedRec) {
        res.send(404, {});
        return next();
      }
      res.send(presentedMedRec);
      return next();
    });
}

/**
 * Get all the medical recommendations for a user
 */
function getMedRecs(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  if (req.decoded.userId !== req.params.userId) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  return MedRec.find({ userId: req.params.userId })
    .then(presentMedRecs.bind(null))
    .then((presentedMedRecs) => {
      res.send(presentedMedRecs);
      return next();
    });
}

/**
 * Update a Medical Recommendation
 */
function updateMedRec(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  if (req.decoded.userId !== req.params.userId) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  return MedRec.findOne({ userId: req.params.userId, _id: req.params.medRecId })
    .then((medrec) => {
      if (!medrec) {
        return Promise.reject(new errs.NotFoundError('Medical recommendation not found.'));
      }
      // Disable eslint because I can't think of a cleaner way to do this right now and this works.
      /* eslint-disable */
      const medRecUpdates = {
        userId, number, issuer, state, expirationDate,
      } = req.body;
      /* eslint-enable */
      const updatedMedRec = _.merge(medrec, medRecUpdates);
      return MedRec.findByIdAndUpdate(medrec.id, updatedMedRec, { new: true });
    })
    .then(presentMedRec.bind(null))
    .then((presentedMedRec) => {
      res.send(presentedMedRec);
      return next();
    })
    .catch(error => next(error));
}

/**
 * Delete a Medical Recommendation
 */
function deleteMedRec(req, res, next) {
  if (!req.decoded) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  if (req.decoded.userId !== req.params.userId) {
    return next(new errs.ForbiddenError('Current user does not have access to the requested resource.'));
  }

  return MedRec.deleteMany({ userId: req.params.userId, _id: req.params.medRecId })
    .then((response) => {
      if (response && response.n && response.n === 1) {
        res.send(204);
        return next();
      }
      return next(new errs.NotFoundError('Medical recommendation not found.'));
    });
}

module.exports = {
  createMedRec,
  getMedRec,
  getMedRecs,
  updateMedRec,
  deleteMedRec,
};
