function restoreStubs(stubArray) {
  stubArray.forEach((stub) => {
    stub.restore();
  });
}

module.exports = {
  restoreStubs,
};
