process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const server = require('../src/index');
const User = require('../src/models/user');

chai.should();

chai.use(chaiHttp);

describe('User Integration Tests', () => {
  /*
   * Test the POST /api/v1/user route
   */
  describe('POST /api/v1/user', () => {
    it('should POST to /api/v1/user and create a user with the supplied parameters', () => {
      const newUser = {
        fName: 'Steve',
        lName: 'Davis',
        email: 'me@stevesdavis.com',
        password: 'test',
        dateOfBirth: '07-16-1990',
      };

      const createUserStub = sinon.stub(User, 'create').callsFake((queryParams) => {
        queryParams.should.eql({
          fName: 'Steve',
          lName: 'Davis',
          email: 'me@stevesdavis.com',
          password: 'test',
          dateOfBirth: '07-16-1990',
        });
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId('5bdd0a7ba16f9d4c5fba905a'),
          id: '5bdd0a7ba16f9d4c5fba905a',
          fName: 'Steve',
          lName: 'Davis',
          email: 'me@stevesdavis.com',
          password: 'test',
          dateOfBirth: '07-16-1990',
        });
      });

      return chai
        .request(server)
        .post('/api/v1/user')
        .set('content-type', 'application/json')
        .send(newUser)
        .then((response) => {
          const expectedResponse = {
            id: '5bdd0a7ba16f9d4c5fba905a',
            fName: 'Steve',
            lName: 'Davis',
            email: 'me@stevesdavis.com',
            dateOfBirth: '07-16-1990',
          };
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.eql(expectedResponse);
          createUserStub.restore();
          return Promise.resolve();
        })
        .catch((err) => {
          createUserStub.restore();
          return Promise.reject(err);
        });
    });
  });
  /*
   * Test the PUT /api/v1/user route
   */
  describe('PUT /api/v1/user', () => {
    it('should PUT to /api/v1/user and update a user with the supplied parameters', () => {
      const userUpdates = {
        fName: 'Cteven',
      };

      const jwtVerifyStub = sinon.stub(jwt, 'verify').callsArgWith(2, null, {
        userId: '5bdd0a7ba16f9d4c5fba905a',
        userEmail: 'me@stevesdavis.com',
      });

      const userFindOneStub = sinon.stub(User, 'findOne').callsFake((queryParams) => {
        queryParams.should.exist.and.be.an('object');
        queryParams.should.eql({ _id: '5bdd0a7ba16f9d4c5fba905a', email: 'me@stevesdavis.com' });
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId('5bdd0a7ba16f9d4c5fba905a'),
          id: '5bdd0a7ba16f9d4c5fba905a',
          fName: 'Steve',
          lName: 'Davis',
          email: 'me@stevesdavis.com',
          password: 'test',
          dateOfBirth: '07-16-1990',
        });
      });

      const findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').callsFake((userId, updates) => {
        userId.should.eql('5bdd0a7ba16f9d4c5fba905a');
        updates.should.eql({
          _id: new mongoose.Types.ObjectId('5bdd0a7ba16f9d4c5fba905a'),
          id: '5bdd0a7ba16f9d4c5fba905a',
          fName: 'Cteven',
          lName: 'Davis',
          email: 'me@stevesdavis.com',
          password: 'test',
          dateOfBirth: '07-16-1990',
        });
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId('5bdd0a7ba16f9d4c5fba905a'),
          id: '5bdd0a7ba16f9d4c5fba905a',
          fName: 'Cteven',
          lName: 'Davis',
          email: 'me@stevesdavis.com',
          password: 'test',
          dateOfBirth: '07-16-1990',
        });
      });

      return chai
        .request(server)
        .put('/api/v1/user/me')
        .set('content-type', 'application/json')
        .set('x-access-token', 'foobar')
        .send(userUpdates)
        .then((response) => {
          const expectedResponse = {
            id: '5bdd0a7ba16f9d4c5fba905a',
            fName: 'Cteven',
            lName: 'Davis',
            email: 'me@stevesdavis.com',
            dateOfBirth: '07-16-1990',
          };
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.eql(expectedResponse);
          userFindOneStub.restore();
          jwtVerifyStub.restore();
          findByIdAndUpdateStub.restore();
          return Promise.resolve();
        })
        .catch((err) => {
          userFindOneStub.restore();
          jwtVerifyStub.restore();
          findByIdAndUpdateStub.restore();
          return Promise.reject(err);
        });
    });
  });
  /*
   * Test the GET /api/v1/user/me route
   */
  describe('PUT /api/v1/user/me', () => {
    it('should GET /api/v1/user/me and return the user', () => {
      const jwtVerifyStub = sinon.stub(jwt, 'verify').callsArgWith(2, null, {
        userId: '5bdd0a7ba16f9d4c5fba905a',
        userEmail: 'me@stevesdavis.com',
      });

      const userFindOneStub = sinon.stub(User, 'findOne').callsFake((queryParams) => {
        queryParams.should.exist.and.be.an('object');
        queryParams.should.eql({ _id: '5bdd0a7ba16f9d4c5fba905a', email: 'me@stevesdavis.com' });
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId('5bdd0a7ba16f9d4c5fba905a'),
          id: '5bdd0a7ba16f9d4c5fba905a',
          fName: 'Steve',
          lName: 'Davis',
          email: 'me@stevesdavis.com',
          password: 'test',
          dateOfBirth: '07-16-1990',
        });
      });

      return chai
        .request(server)
        .get('/api/v1/user/me')
        .set('x-access-token', 'foobar')
        .then((response) => {
          const expectedResponse = {
            id: '5bdd0a7ba16f9d4c5fba905a',
            fName: 'Steve',
            lName: 'Davis',
            email: 'me@stevesdavis.com',
            dateOfBirth: '07-16-1990',
          };
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.eql(expectedResponse);
          userFindOneStub.restore();
          jwtVerifyStub.restore();
          return Promise.resolve();
        })
        .catch((err) => {
          userFindOneStub.restore();
          jwtVerifyStub.restore();
          return Promise.reject(err);
        });
    });
  });
  /*
   * Test the GET /api/v1/user/:userId/profile route
   */
  describe('GET /api/v1/user/:userId/profile', () => {
    it('should GET /api/v1/user/:userId/profile and return the user', () => {
      const jwtVerifyStub = sinon.stub(jwt, 'verify').callsArgWith(2, null, {
        userId: '5bdd0a7ba16f9d4c5fba905a',
        userEmail: 'me@stevesdavis.com',
      });

      const userAggregateStub = sinon.stub(User, 'aggregate').callsFake((queryParams) => {
        queryParams.should.exist.and.be.an('array');
        queryParams.should.eql([
          {
            $match: {
              _id: new mongoose.Types.ObjectId('5bdd0a7ba16f9d4c5fba905a'),
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
        ]);
        return Promise.resolve([{
          _id: new mongoose.Types.ObjectId('5bdd0a7ba16f9d4c5fba905a'),
          fName: 'Steve',
          lName: 'Davis',
          email: 'me@stevesdavis.com',
          password: 'test',
          dateOfBirth: '1990-07-16T04:00:00.000Z',
          idcards: [
            {
              _id: new mongoose.Types.ObjectId('5bdf4436c453ff7079c27620'),
              userId: '5bdd0a7ba16f9d4c5fba905a',
              stateIdNumber: 74635,
              state: 'Ohio',
              expirationDate: '2010-07-16T00:00:00.000Z',
              imagePath: '/test/abc.jpg',
            },
            {
              _id: new mongoose.Types.ObjectId('5bdf4436c453ff7079c2761f'),
              userId: '5bdd0a7ba16f9d4c5fba905a',
              stateIdNumber: 74635,
              state: 'Texas',
              expirationDate: '2020-07-16T00:00:00.000Z',
              imagePath: '/test/abc.jpg',
            },
          ],
          medrecs: [
            {
              _id: new mongoose.Types.ObjectId('5bdf4436c453ff7079c2761d'),
              userId: '5bdd0a7ba16f9d4c5fba905a',
              number: '1235234',
              issuer: 'SomeIssuer',
              state: 'Virginia',
              expirationDate: '2020-07-16T00:00:00.000Z',
            },
            {
              _id: new mongoose.Types.ObjectId('5bdf4436c453ff7079c2761e'),
              userId: '5bdd0a7ba16f9d4c5fba905a',
              number: '4564646',
              issuer: 'SomeIssuer',
              state: 'Texas',
              expirationDate: '2010-07-16T00:00:00.000Z',
            },
          ],
        }]);
      });

      return chai
        .request(server)
        .get('/api/v1/user/5bdd0a7ba16f9d4c5fba905a/profile')
        .set('x-access-token', 'foobar')
        .then((response) => {
          const expectedResponse = {
            fName: 'Steve',
            lName: 'Davis',
            email: 'me@stevesdavis.com',
            dateOfBirth: '1990-07-16T04:00:00.000Z',
            idcards: [
              {
                id: '5bdf4436c453ff7079c27620',
                expirationDate: '2010-07-16T00:00:00.000Z',
                expired: true,
              },
              {
                id: '5bdf4436c453ff7079c2761f',
                expirationDate: '2020-07-16T00:00:00.000Z',
                userId: '5bdd0a7ba16f9d4c5fba905a',
                stateIdNumber: 74635,
                state: 'Texas',
                imagePath: '/test/abc.jpg',
              },
            ],
            medrecs: [
              {
                id: '5bdf4436c453ff7079c2761d',
                expirationDate: '2020-07-16T00:00:00.000Z',
                userId: '5bdd0a7ba16f9d4c5fba905a',
                number: '1235234',
                issuer: 'SomeIssuer',
                state: 'Virginia',
              },
              {
                id: '5bdf4436c453ff7079c2761e',
                expirationDate: '2010-07-16T00:00:00.000Z',
                expired: true,
              },
            ],
          };
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.eql(expectedResponse);
          userAggregateStub.restore();
          jwtVerifyStub.restore();
          return Promise.resolve();
        })
        .catch((err) => {
          userAggregateStub.restore();
          jwtVerifyStub.restore();
          return Promise.reject(err);
        });
    });
  });
});
