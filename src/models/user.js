// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true, index: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
}));
