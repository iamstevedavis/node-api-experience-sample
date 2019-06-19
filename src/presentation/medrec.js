
/*
 * Strip out any secure information when we send back the med rec.
 * Also account for expired med recs.
 */
function presentMedRec(medrec) {
  if (!medrec) {
    return null;
  }

  const cleanMedRec = {};
  if (new Date(medrec.expirationDate) < Date.now()) {
    // Disable eslint for this rule because aggregation does not return id on subdocuments
    // eslint-disable-next-line no-underscore-dangle
    cleanMedRec.id = medrec.id || medrec._id.toHexString();
    cleanMedRec.expirationDate = medrec.expirationDate;
    cleanMedRec.expired = true;
  } else {
    // eslint-disable-next-line no-underscore-dangle
    cleanMedRec.id = medrec.id || medrec._id.toHexString();
    cleanMedRec.expirationDate = medrec.expirationDate;
    cleanMedRec.userId = medrec.userId;
    cleanMedRec.number = medrec.number;
    cleanMedRec.issuer = medrec.issuer;
    cleanMedRec.state = medrec.state;
  }

  return cleanMedRec;
}

function presentMedRecs(medrecs) {
  return medrecs.map(medrec => presentMedRec(medrec));
}

module.exports = {
  presentMedRecs,
  presentMedRec,
};
