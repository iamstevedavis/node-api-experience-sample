const dotenv = require('dotenv');
const mongoose = require('mongoose');
const restify = require('restify');
const Logger = require('bunyan');
const {
  authenticate, getToken,
} = require('./controllers/authentication');
const {
  getUser, createUser, updateUser, getUserProfile,
} = require('./controllers/user');
const {
  getIDCard, getIDCards, createIDCard, updateIDCard, deleteIDCard,
} = require('./controllers/idcard');
const {
  getMedRec, getMedRecs, createMedRec, updateMedRec, deleteMedRec,
} = require('./controllers/medrec');

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

// eslint-disable-next-line new-cap
const log = new Logger.createLogger({
  name: 'restify-api-example',
  serializers: {
    req: Logger.stdSerializers.req,
  },
});

const server = restify.createServer({
  name: 'restify-api-example',
  version: '1.0.0',
  log,
});

server.use(restify.plugins.requestLogger());
server.pre((request, response, next) => {
  request.log.info({ req: request }, 'REQUEST');
  return next();
});

server.use(restify.plugins.queryParser({
  mapParams: true,
}));
server.use(restify.plugins.bodyParser({
  mapParams: true,
}));
server.use(restify.plugins.acceptParser(server.acceptable));


// Get an auth token
server.post('/api/v1/auth', getToken);
// Create a user
server.post('/api/v1/user', createUser);
// Get info about the current user
server.get('/api/v1/user/me', authenticate, getUser);
// Update info about the current user
server.put('/api/v1/user/me', authenticate, updateUser);

// Get all the idcards and medrecs for a user in one call
server.get('/api/v1/user/:userId/profile', authenticate, getUserProfile);

// ID Card CRUD
server.post('/api/v1/user/:userId/idcard', authenticate, createIDCard);
// Get all ID Cards for a user
server.get('/api/v1/user/:userId/idcard', authenticate, getIDCards);
// Get one ID card
server.get('/api/v1/user/:userId/idcard/:idCardId', authenticate, getIDCard);
server.put('/api/v1/user/:userId/idcard/:idCardId', authenticate, updateIDCard);
server.del('/api/v1/user/:userId/idcard/:idCardId', authenticate, deleteIDCard);

// Medical Recommendation CRUD
server.post('/api/v1/user/:userId/medrec', authenticate, createMedRec);
server.get('/api/v1/user/:userId/medrec', authenticate, getMedRecs);
server.get('/api/v1/user/:userId/medrec/:medRecId', authenticate, getMedRec);
server.put('/api/v1/user/:userId/medrec/:medRecId', authenticate, updateMedRec);
server.del('/api/v1/user/:userId/medrec/:medRecId', authenticate, deleteMedRec);


// Delete all medical recommendations for this user
server.del('/api/v1/user/:userId/medrec', authenticate, deleteIDCard);


server.listen(8980, () => {
  console.log(`${server.name} listening at ${server.url}`);
});

function stop() {
  server.close();
}

module.exports = server;
module.exports.stop = stop;
