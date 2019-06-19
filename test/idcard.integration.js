process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const server = require('../src/index');
const IDCard = require('../src/models/idcard');

chai.should();

chai.use(chaiHttp);

describe('ID Card Integration Tests', () => {
  /*
   * Test the POST /api/v1/user/:userId/idcard route
   */
  describe('POST /api/v1/user/:userId/idcard', () => {
    it('should POST to /api/v1/user/:userId/idcard and create an idcard with the supplied parameters for the supplied user', () => {
      const newIDCard = {
        userId: '5bdd0a7ba16f9d4c5fba905a',
        stateIdNumber: '12345',
        state: 'Ohio',
        expirationDate: '2020-07-16',
        imagePath: '/test/abc.jpg',
      };

      const jwtVerifyStub = sinon.stub(jwt, 'verify').callsArgWith(2, null, {
        userId: '5bdd0a7ba16f9d4c5fba905a',
        userEmail: 'me@stevesdavis.com',
      });

      const createIDCardStub = sinon.stub(IDCard, 'create').callsFake(() => Promise.resolve({
        _id: new mongoose.Types.ObjectId('40ac007ff16f9d4c5fbb567c'),
        id: '40ac007ff16f9d4c5fbb567c',
        userId: '5bdd0a7ba16f9d4c5fba905a',
        stateIdNumber: '12345',
        state: 'Ohio',
        expirationDate: '2020-07-16',
        imagePath: '/test/abc.jpg',
      }));

      return chai
        .request(server)
        .post('/api/v1/user/5bdd0a7ba16f9d4c5fba905a/idcard')
        .set('content-type', 'application/json')
        .set('x-access-token', 'foobar')
        .send(newIDCard)
        .then((response) => {
          const expectedResponse = {
            id: '40ac007ff16f9d4c5fbb567c',
            userId: '5bdd0a7ba16f9d4c5fba905a',
            stateIdNumber: '12345',
            state: 'Ohio',
            expirationDate: '2020-07-16',
            imagePath: '/test/abc.jpg',
          };
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.eql(expectedResponse);
          jwtVerifyStub.restore();
          createIDCardStub.restore();
          return Promise.resolve();
        })
        .catch((err) => {
          jwtVerifyStub.restore();
          createIDCardStub.restore();
          return Promise.reject(err);
        });
    });
  });
  /*
   * Test the GET /api/v1/user/:userId/idcard/:idCardId route
   */
  describe('GET /api/v1/user/:userId/idcard/:idCardId', () => {
    it('should GET /api/v1/user/:userId/idcard/:idCardId and return an ID Card', () => {
      const jwtVerifyStub = sinon.stub(jwt, 'verify').callsArgWith(2, null, {
        userId: '5bdd0a7ba16f9d4c5fba905a',
        userEmail: 'me@stevesdavis.com',
      });

      const idCardFindOneStub = sinon.stub(IDCard, 'findOne').callsFake((queryParams) => {
        queryParams.should.exist.and.be.an('object');
        queryParams.should.eql({ _id: '5bdf4436c453ff7079c2761f', userId: '5bdd0a7ba16f9d4c5fba905a' });
        return Promise.resolve(
          {
            _id: new mongoose.Types.ObjectId('5bdf4436c453ff7079c2761f'),
            userId: '5bdd0a7ba16f9d4c5fba905a',
            stateIdNumber: 74635,
            state: 'Texas',
            expirationDate: '2020-07-16T00:00:00.000Z',
            imagePath: '/test/abc.jpg',
          },
        );
      });

      return chai
        .request(server)
        .get('/api/v1/user/5bdd0a7ba16f9d4c5fba905a/idcard/5bdf4436c453ff7079c2761f')
        .set('content-type', 'application/json')
        .set('x-access-token', 'foobar')
        .then((response) => {
          const expectedResponse = {
            id: '5bdf4436c453ff7079c2761f',
            expirationDate: '2020-07-16T00:00:00.000Z',
            userId: '5bdd0a7ba16f9d4c5fba905a',
            stateIdNumber: 74635,
            state: 'Texas',
            imagePath: '/test/abc.jpg',
          };
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.eql(expectedResponse);
          jwtVerifyStub.restore();
          idCardFindOneStub.restore();
          return Promise.resolve();
        })
        .catch((err) => {
          jwtVerifyStub.restore();
          idCardFindOneStub.restore();
          return Promise.reject(err);
        });
    });
  });
  /*
   * Test the PUT /api/v1/user/:userId/idcard/:idCardId route
   */
  describe('PUT /api/v1/user/:userId/idcard/:idCardId', () => {
    it('should PUT to /api/v1/user/:userId/idcard/:idCardId and update an IDCard with the supplied parameters', () => {
      const idCardUpdates = {
        state: 'Texas',
      };

      const jwtVerifyStub = sinon.stub(jwt, 'verify').callsArgWith(2, null, {
        userId: '5bdd0a7ba16f9d4c5fba905a',
        userEmail: 'me@stevesdavis.com',
      });

      const idCardFindOneStub = sinon.stub(IDCard, 'findOne').callsFake((queryParams) => {
        queryParams.should.exist.and.be.an('object');
        queryParams.should.eql({ userId: '5bdd0a7ba16f9d4c5fba905a', _id: '40ac007ff16f9d4c5fbb567c' });
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId('40ac007ff16f9d4c5fbb567c'),
          id: '40ac007ff16f9d4c5fbb567c',
          userId: '5bdd0a7ba16f9d4c5fba905a',
          stateIdNumber: '12345',
          state: 'Ohio',
          expirationDate: '2020-07-16',
          imagePath: '/test/abc.jpg',
        });
      });

      const idCardFindByIdAndUpdateStub = sinon.stub(IDCard, 'findByIdAndUpdate').callsFake((idCardId, updates) => {
        idCardId.should.eql('40ac007ff16f9d4c5fbb567c');
        updates.should.eql({
          _id: new mongoose.Types.ObjectId('40ac007ff16f9d4c5fbb567c'),
          id: '40ac007ff16f9d4c5fbb567c',
          userId: '5bdd0a7ba16f9d4c5fba905a',
          stateIdNumber: '12345',
          state: 'Texas',
          expirationDate: '2020-07-16',
          imagePath: '/test/abc.jpg',
        });
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId('40ac007ff16f9d4c5fbb567c'),
          id: '40ac007ff16f9d4c5fbb567c',
          userId: '5bdd0a7ba16f9d4c5fba905a',
          stateIdNumber: '12345',
          state: 'Texas',
          expirationDate: '2020-07-16',
          imagePath: '/test/abc.jpg',
        });
      });

      return chai
        .request(server)
        .put('/api/v1/user/5bdd0a7ba16f9d4c5fba905a/idcard/40ac007ff16f9d4c5fbb567c')
        .set('content-type', 'application/json')
        .set('x-access-token', 'foobar')
        .send(idCardUpdates)
        .then((response) => {
          const expectedResponse = {
            id: '40ac007ff16f9d4c5fbb567c',
            userId: '5bdd0a7ba16f9d4c5fba905a',
            stateIdNumber: '12345',
            state: 'Texas',
            expirationDate: '2020-07-16',
            imagePath: '/test/abc.jpg',
          };
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.eql(expectedResponse);
          jwtVerifyStub.restore();
          idCardFindOneStub.restore();
          idCardFindByIdAndUpdateStub.restore();
          return Promise.resolve();
        })
        .catch((err) => {
          jwtVerifyStub.restore();
          idCardFindOneStub.restore();
          idCardFindByIdAndUpdateStub.restore();
          return Promise.reject(err);
        });
    });
  });
  /*
 * Test the GET /api/v1/user/:userId/idcard route
 */
  describe('GET /api/v1/user/:userId/idcard', () => {
    it('should GET /api/v1/user/:userId/idcard and return an ID Card', () => {
      const jwtVerifyStub = sinon.stub(jwt, 'verify').callsArgWith(2, null, {
        userId: '5bdd0a7ba16f9d4c5fba905a',
        userEmail: 'me@stevesdavis.com',
      });

      const idCardFindStub = sinon.stub(IDCard, 'find').callsFake((queryParams) => {
        queryParams.should.exist.and.be.an('object');
        queryParams.should.eql({ userId: '5bdd0a7ba16f9d4c5fba905a' });
        return Promise.resolve(
          [
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
        );
      });

      return chai
        .request(server)
        .get('/api/v1/user/5bdd0a7ba16f9d4c5fba905a/idcard')
        .set('content-type', 'application/json')
        .set('x-access-token', 'foobar')
        .then((response) => {
          const expectedResponse = [
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
          ];
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.should.eql(expectedResponse);
          jwtVerifyStub.restore();
          idCardFindStub.restore();
          return Promise.resolve();
        })
        .catch((err) => {
          jwtVerifyStub.restore();
          idCardFindStub.restore();
          return Promise.reject(err);
        });
    });
  });
});
