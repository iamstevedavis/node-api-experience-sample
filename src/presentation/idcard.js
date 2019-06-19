/*
 * Strip out any secure information when we send back ID Card info.
 */

function presentIDCard(idCard) {
  if (!idCard) {
    return null;
  }

  const cleanIdCard = {};
  if (new Date(idCard.expirationDate) < Date.now()) {
    // Disable eslint for this rule because aggregation does not return id on subdocuments
    // eslint-disable-next-line no-underscore-dangle
    cleanIdCard.id = idCard.id || idCard._id.toHexString();
    cleanIdCard.expirationDate = idCard.expirationDate;
    cleanIdCard.expired = true;
  } else {
    // eslint-disable-next-line no-underscore-dangle
    cleanIdCard.id = idCard.id || idCard._id.toHexString();
    cleanIdCard.expirationDate = idCard.expirationDate;
    cleanIdCard.userId = idCard.userId;
    cleanIdCard.stateIdNumber = idCard.stateIdNumber;
    cleanIdCard.state = idCard.state;
    cleanIdCard.imagePath = idCard.imagePath;
  }

  return cleanIdCard;
}

function presentIDCards(idCards) {
  return idCards.map(idCard => presentIDCard(idCard));
}

module.exports = {
  presentIDCards,
  presentIDCard,
};
