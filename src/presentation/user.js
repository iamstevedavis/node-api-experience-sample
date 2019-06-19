const { presentIDCards } = require('./idcard');
const { presentMedRecs } = require('./medrec');

/*
 * Strip out any secure information when we send back user info (password).
 */
function presentUser(user) {
  if (!user) {
    return null;
  }

  const cleanUser = {};
  cleanUser.id = user.id;
  cleanUser.fName = user.fName;
  cleanUser.lName = user.lName;
  cleanUser.email = user.email;
  cleanUser.dateOfBirth = user.dateOfBirth;

  if (user.idcards && user.idcards.length > 0) {
    cleanUser.idcards = presentIDCards(user.idcards);
  }

  if (user.medrecs && user.medrecs.length > 0) {
    cleanUser.medrecs = presentMedRecs(user.medrecs);
  }

  return cleanUser;
}

function presentUsers(users) {
  return users.map(user => presentUser(user));
}

module.exports = {
  presentUser,
  presentUsers,
};
