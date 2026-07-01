function generateCode(prefix) {
  return `${prefix}-${Date.now()}`;
}

module.exports = {
  generateCode,
};
