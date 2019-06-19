// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('IDCard', new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  stateIdNumber: { type: Number, required: true },
  state: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  imagePath: { type: String, required: true },
}));
