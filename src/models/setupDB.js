const dotenv = require('dotenv');
const mongoose = require('mongoose');
const MedRec = require('./medrec');
const IDCard = require('./idcard');
const User = require('./user');

dotenv.config();

// Connect to database
const dbUser = process.env.DB_USER;
if (dbUser) {
  mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SCOPE}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
} else {
  mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SCOPE}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
}

(function _dbSetup() {
  return mongoose.connection.dropDatabase()
    .then(() => User.create({
      fName: 'Steve',
      lName: 'Davis',
      email: 'me@stevesdavis.com',
      password: 'test',
      dateOfBirth: '07-16-1990',
    }))
    .then(user => Promise.all([
      MedRec.create([{
        userId: user.id,
        number: '1235234',
        issuer: 'SomeIssuer',
        state: 'Virginia',
        expirationDate: '2020-07-16',
      }, {
        userId: user.id,
        number: '4564646',
        issuer: 'SomeIssuer',
        state: 'Texas',
        expirationDate: '2010-07-16',
      }]),
      IDCard.create([{
        userId: user.id,
        stateIdNumber: '74635',
        state: 'Texas',
        expirationDate: '2020-07-16',
        imagePath: '/test/abc.jpg',
      }, {
        userId: user.id,
        stateIdNumber: '74635',
        state: 'Ohio',
        expirationDate: '2010-07-16',
        imagePath: '/test/abc.jpg',
      }]),
    ]))
    .then(() => {
      mongoose.disconnect();
      return Promise.resolve();
    })
    .catch((error) => {
      console.log(error);
      mongoose.disconnect();
      return Promise.resolve();
    });
}());
