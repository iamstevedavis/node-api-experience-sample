process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const server = require('../src/index');
const MedRec = require('../src/models/medrec');

chai.should();

chai.use(chaiHttp);

describe('Medical Recommendation Integration Tests', () => {
  /*
   * Test the GET /api/v1/user/:userId/medrec route
   */
  describe('GET /api/v1/user/:userId/medrec', () => {
    it('should GET /api/v1/user/:userId/medrec and return medrecs', () => {
      const jwtVerifyStub = sinon.stub(jwt, 'verify').callsArgWith(2, null, {
        userId: '5bdd0a7ba16f9d4c5fba905a',
        userEmail: 'me@stevesdavis.com',
      });

      const medRecFindStub = sinon.stub(MedRec, 'find').callsFake(() => Promise.resolve([
        {
          _id: new mongoose.Types.ObjectId('5bde622cc6c72842b3bc231c'),
          id: '5bde622cc6c72842b3bc231c',
          userId: '5bdd0a7ba16f9d4c5fba905a',
          number: '12345',
          issuer: 'ASDF',
          state: 'Texas',
          expirationDate: '2018-10-31T03:12:49.959Z',
        },
        {
          _id: new mongoose.Types.ObjectId('5bde622cc6c72842b357670d'),
          id: '5bde622cc6c72842b357670d',
          userId: '5bdd0a7ba16f9d4c5fba905a',
          number: '12345',
          issuer: 'ASDF',
          state: 'Texas',
          expirationDate: `${new Date().getFullYear()}-11-08T04:12:49.959Z`,
        },
      ]));

      return chai
        .request(server)
        .get('/api/v1/user/5bdd0a7ba16f9d4c5fba905a/medrec')
        .set('content-type', 'application/json')
        .set('x-access-token', 'foobar')
        .then((response) => {
          const expectedResponse = [
            {
              id: '5bde622cc6c72842b3bc231c',
              expirationDate: '2018-10-31T03:12:49.959Z',
              expired: true,
            },
            {
              id: '5bde622cc6c72842b357670d',
              userId: '5bdd0a7ba16f9d4c5fba905a',
              number: '12345',
              issuer: 'ASDF',
              state: 'Texas',
              expirationDate: `${new Date().getFullYear()}-11-08T04:12:49.959Z`,
            },
          ];
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.should.eql(expectedResponse);
          jwtVerifyStub.restore();
          medRecFindStub.restore();
          return Promise.resolve();
        })
        .catch((err) => {
          jwtVerifyStub.restore();
          medRecFindStub.restore();
          return Promise.reject(err);
        });
    });
  });
  /*
   * Test the PUT /api/v1/user/:userId/medrec/:medRecId route
   */
  describe('PUT /api/v1/user/:userId/medrec/:medRecId', () => {
    it('should PUT to /api/v1/user/:userId/medrec/:medRecId and update a medrec with the supplied parameters', () => {
      const medRecUpdates = {
        state: 'Texas',
        issuer: 'Government',
      };

      const jwtVerifyStub = sinon.stub(jwt, 'verify').callsArgWith(2, null, {
        userId: '5bdd0a7ba16f9d4c5fba905a',
        userEmail: 'me@stevesdavis.com',
      });

      const medRecFindOneStub = sinon.stub(MedRec, 'findOne').callsFake((queryParams) => {
        queryParams.should.exist.and.be.an('object');
        queryParams.should.eql({ userId: '5bdd0a7ba16f9d4c5fba905a', _id: '5bde622cc6c72842b357670d' });
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId('5bdf4436c453ff7079c2761d'),
          id: '5bdf4436c453ff7079c2761d',
          userId: '5bdf4436c453ff7079c2761c',
          number: '1235234',
          issuer: 'SomeIssuer',
          state: 'Virginia',
          expirationDate: '2020-07-16T00:00:00.000Z',
        });
      });

      const medRecFindByIdAndUpdateStub = sinon.stub(MedRec, 'findByIdAndUpdate').callsFake((medrecId, updates) => {
        medrecId.should.eql('5bdf4436c453ff7079c2761d');
        updates.should.eql({
          _id: new mongoose.Types.ObjectId('5bdf4436c453ff7079c2761d'),
          id: '5bdf4436c453ff7079c2761d',
          userId: '5bdf4436c453ff7079c2761c',
          number: '1235234',
          issuer: 'Government',
          state: 'Texas',
          expirationDate: '2020-07-16T00:00:00.000Z',
        });
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId('5bdf4436c453ff7079c2761d'),
          id: '5bdf4436c453ff7079c2761d',
          userId: '5bdf4436c453ff7079c2761c',
          number: '1235234',
          issuer: 'Government',
          state: 'Texas',
          expirationDate: '2020-07-16T00:00:00.000Z',
          __v: 0,
        });
      });

      return chai
        .request(server)
        .put('/api/v1/user/5bdd0a7ba16f9d4c5fba905a/medrec/5bde622cc6c72842b357670d')
        .set('content-type', 'application/json')
        .set('x-access-token', 'foobar')
        .send(medRecUpdates)
        .then((response) => {
          const expectedResponse = {
            id: '5bdf4436c453ff7079c2761d',
            expirationDate: '2020-07-16T00:00:00.000Z',
            userId: '5bdf4436c453ff7079c2761c',
            number: '1235234',
            issuer: 'Government',
            state: 'Texas',
          };
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.eql(expectedResponse);
          jwtVerifyStub.restore();
          medRecFindOneStub.restore();
          medRecFindByIdAndUpdateStub.restore();
          return Promise.resolve();
        })
        .catch((err) => {
          jwtVerifyStub.restore();
          medRecFindOneStub.restore();
          medRecFindByIdAndUpdateStub.restore();
          return Promise.reject(err);
        });
    });
  });
});
