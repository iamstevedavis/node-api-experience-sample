Introduction
-----
index.js is the main script file for the demo app. You can run the app with npm run start. Any route that requires authentication will need to have in the header

    x-access-token: mytoken
    Authorization: Bearer <token>

Included is a Postman collection with all possible calls to the API.

The token should also be able to be passed in the body or the query string. Please follow the steps outlined in Quick Start to get started.

What is demonstrated:

Node
  - Understanding of async/sync calls with promises
  - Imports and exports of functions and modules
  - General file structure
  - Understanding of newer es6 constructs

VSCode
  - Included VSCode launch configs for debugging tests and the API

The ability to create an API
  - Understanding of CRUD functionality and route structures
  - Understanding of presentation layer and data hiding
  - Understanding of error handling
  - Understanding of response codes
  - Understanding of middleware
  - Understanding of authentication both generating and making use of an existing token
  - Understanding of using a .env file

The ability to interface with a database
  - Setting up the database with a script
  - Creating model definitions
  - Creating, reading updating and deleting from the database
  - Creating and running aggregations
  - Handling database error

The ability to create npm scripts in package.json
  - Linting, lint fixing, database setup, test running etc.

Code Maintainability
  - Linting and the importance of linting configuration
  - Code comments
  - API docs
  - Included Postman calls

Testing
  - More in depth knowledge of testing such as stubs, mocks and code coverage reports
  - Including a code coverage report to keep track of code coverage
  - Mocking out an API for integration testing
  - The difference between integration and unit tests

What does this need more of (in no particular order):

Authentication is weak
More robust controllers, they break easily (see more tests/error handling)
Unit tests/more tests in general
Error handling
Removal of code duplication in some areas
Better documentation and actual generated API documentation

Quick Start
-----
To get started you should follow these simple steps.

If you are not using a default local mongodb install, update .env with the parameters for your mongodb instance or nothing will work.

1) Run 'npm install'
2) Setup a .env file with your particulars or use the following for a default mongo instance and database
```
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_PORT=27017
DB_SCOPE=med
```
3) Run 'npm run db:setup'
4) Run 'npm start'

Load up the included postman collection to make API calls.

That is it!

Your database should be populated with the following data after `npm run db:setup`:
User:
    {
      fName: 'Steve',
      lName: 'Davis',
      email: 'me@stevesdavis.com',
      password: 'test',
      dateOfBirth: '07-16-1990'
    }

Medical Recommendation:
    {
      userId: user.id,
      number: '1235234',
      issuer: 'SomeIssuer',
      state: 'Virginia',
      expirationDate: '2020-07-16',
    }

ID Card:
    {
      userId: user.id,
      stateIdNumber: '74635',
      state: 'Texas',
      expirationDate: '2020-07-16',
      imagePath: '/test/abc.jpg',
    }

Tests
-----
Tests can be run with the command 'npm run test' and will output coverage.

API
-----
### Server Specific CRUD

#### POST /api/v1/auth
##### Get a token from the server.

__Request__

    {
      "email": "me@stevesdavis.com",
      "password": "test"
    }

__Response__

  200 Ok

__Sample Response Body__

    {
      "success": true,
      "message": "Enjoy your token!",
      "token": "abcd"
    }

#### POST /api/v1/user
##### Create a user.

__Request__

    {
      "fName": "Steve",
      "lName": "Davis",
      "email": "me@stevesdavis.com",
      "password": "test",
      "dateOfBirth": "07-16-1990"
    }

__Response__

  201 Created

__Sample Response Body__

    {
      "id": "5bde7f8cc1d622545ba8c7d3",
      "fName": "Steve",
      "lName": "Davis",
      "email": "me@stevesdavis.com",
      "dateOfBirth": "1990-07-16T04:00:00.000Z"
    }

#### GET /api/v1/user/me
##### Get the current user from the database.

__Authentication__

  Required

__Response__

  200 Ok

__Sample Response Body__

    {
      "id": "5bde7f8cc1d622545ba8c7d3",
      "fName": "Steve",
      "lName": "Davis",
      "email": "me@stevesdavis.com",
      "dateOfBirth": "1990-07-16T04:00:00.000Z"
    }

#### PUT /api/v1/user/me
##### Update the current user.

__Authentication__

  Required

__Request__

    {
      "fName": "Cteven",
      "lName": "Davis",
      "email": "me@stevesdavis.com",
      "password": "test",
      "dateOfBirth": "07-16-1990"
    }

__Response__

  200 Ok

__Sample Response Body__

    {
      "id": "5bde7f8cc1d622545ba8c7d3",
      "fName": "Cteven",
      "lName": "Davis",
      "email": "me@stevesdavis.com",
      "dateOfBirth": "1990-07-16T04:00:00.000Z"
    }

#### GET /api/v1/user/:userId/profile
##### Get all the medical reccomendations and userIds in one call

__Authentication__

  Required

__Response__

  200 Ok

__Sample Response Body__

    {
      "fName": "Steve",
      "lName": "Davis",
      "email": "me@stevesdavis.com",
      "dateOfBirth": "1990-07-16T04:00:00.000Z",
      "idcards": [
        {
          "id": "5bdf4436c453ff7079c27620",
          "expirationDate": "2010-07-16T00:00:00.000Z",
          "expired": true
        },
        {
          "id": "5bdf4436c453ff7079c2761f",
          "expirationDate": "2020-07-16T00:00:00.000Z",
          "userId": "5bdf4436c453ff7079c2761c",
          "stateIdNumber": 74635,
          "state": "Texas",
          "imagePath": "/test/abc.jpg"
        }
      ],
      "medrecs": [
        {
          "id": "5bdf4436c453ff7079c2761d",
          "expirationDate": "2020-07-16T00:00:00.000Z",
          "userId": "5bdf4436c453ff7079c2761c",
          "number": "1235234",
          "issuer": "SomeIssuer",
          "state": "Virginia"
        },
        {
          "id": "5bdf4436c453ff7079c2761e",
          "expirationDate": "2010-07-16T00:00:00.000Z",
          "expired": true
        }
      ]
    }

#### POST /api/v1/user/:userId/idcard
##### Create an ID Card for a user.

__Request__

    {
      "userId": "5bdcf2df25890d43ac821525",
      "stateIdNumber": "12345",
      "state": "Ohio",
      "expirationDate": "2020-07-16",
      "imagePath": "/test/abc.jpg"
    }

__Response__

  201 Created

__Sample Response Body__

    {
      "id": "5bdf2aeed61f4f5486fb71cc",
      "expirationDate": "2020-07-16T00:00:00.000Z",
      "userId": "5bdcf2df25890d43ac821525",
      "stateIdNumber": 12345,
      "state": "Ohio",
      "imagePath": "/test/abc.jpg"
    }

#### GET /api/v1/user/:userId/idcard
##### Get all the ID Cards for a given user.

__Authentication__

  Required

__Response__

  200 Ok

__Sample Response Body__

    [{
      "id": "5bdf2b69d61f4f5486fb71cd",
      "expirationDate": "2020-07-16T00:00:00.000Z",
      "userId": "5bdcf2df25890d43ac821525",
      "stateIdNumber": 74635,
      "state": "Texas",
      "imagePath": "/test/abc.jpg"
    },
    {
      "id": "5bdf2b7ed61f4f5486fb71ce",
      "expirationDate": "2015-07-16T00:00:00.000Z",
      "expired": true
    }]

#### GET /api/v1/user/:userId/idcard/:idCardId
##### Get a specific id card for a user based on id.

__Authentication__

  Required

__Response__

  200 Ok

__Sample Response Body__

    {
      "id": "5bdf2b69d61f4f5486fb71cd",
      "expirationDate": "2020-07-16T00:00:00.000Z",
      "userId": "5bdcf2df25890d43ac821525",
      "stateIdNumber": 74635,
      "state": "Texas",
      "imagePath": "/test/abc.jpg"
    }

#### PUT /api/v1/user/:userId/idcard/:idCardId
##### Update the ID Card specified by ID. Any valid ID Card property can be passed in body.

__Authentication__

  Required

__Request__

    {
      "state": "Florida"
    }

__Response__

  200 Ok

__Sample Response Body__

    {
      "id": "5bdf2aeed61f4f5486fb71cc",
      "expirationDate": "2020-07-16T00:00:00.000Z",
      "userId": "5bdcf2df25890d43ac821525",
      "stateIdNumber": 12345,
      "state": "Florida",
      "imagePath": "/test/abc.jpg"
    }

#### DELETE /api/v1/user/:userId/idcard/:idCardId
##### Delete a specified ID Card for the given user.

__Authentication__

  Required

__Response__

  204 No Content

#### POST /api/v1/user/:userId/medrec
##### Create a Medical Reccomendation for a user.

__Request__

    {
      "userId": "5bdcf2df25890d43ac821525",
      "number": "1235234",
      "issuer": "SomeIssuer",
      "state": "Virginia",
      "expirationDate": "2020-07-16"
    }

__Response__

  201 Created

__Sample Response Body__

    {
      "id": "5bdf2edcd16d8c648d83cb3c",
      "expirationDate": "2020-07-16T00:00:00.000Z",
      "userId": "5bdcf2df25890d43ac821525",
      "number": "1235234",
      "issuer": "SomeIssuer",
      "state": "Virginia"
    }

#### GET /api/v1/user/:userId/medrec
##### Get all the Medical Recommendations for a user.

__Authentication__

  Required

__Response__

  200 Ok

__Sample Response Body__

    [{
      "id": "5bde622cc6c72842b357670d",
      "expirationDate": "2020-07-16T00:00:00.000Z",
      "userId": "5bdcf2df25890d43ac821525",
      "number": "1235234",
      "issuer": "SomeIssuer",
      "state": "Ohio"
    },
    {
      "id": "5bde69cd167f0f46f8610e0a",
      "expirationDate": "2010-07-16T00:00:00.000Z",
      "expired": true
    }]

#### GET /api/v1/user/:userId/medrec/:medRecId
##### Get a specific Medical Recommendation for a user based on id.

__Authentication__

  Required

__Response__

  200 Ok

__Sample Response Body__

    {
      "id": "5bde622cc6c72842b357670d",
      "expirationDate": "2020-07-16T00:00:00.000Z",
      "userId": "5bdcf2df25890d43ac821525",
      "number": "1235234",
      "issuer": "SomeIssuer",
      "state": "Ohio"
    }

#### PUT /api/v1/user/:userId/medrec/:medRecId
##### Update the Medical Recommendation specified by ID. Any valid Med Rec property can be passed in body.

__Authentication__

  Required

__Request__

    {
      "state": "Texas",
      "issuer": "Government"
    }

__Response__

  200 Ok

__Sample Response Body__

    {
      "id": "5bde622cc6c72842b357670d",
      "expirationDate": "2020-07-16T00:00:00.000Z",
      "userId": "5bdcf2df25890d43ac821525",
      "number": "1235234",
      "issuer": "Government",
      "state": "Texas"
    }

#### DELETE /api/v1/user/:userId/medrec/:medRecId
##### Delete a specified Medical Recommendation for the given user.

__Authentication__

  Required

__Response__

  204 No Content

#### DELETE /api/v1/user/:userId/medrec
##### Delete all medical recommendations for a user.

__Authentication__

  Required

__Response__

  204 No Content
