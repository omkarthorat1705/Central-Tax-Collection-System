function getFinancialYear() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth() + 1;

  if (month >= 4) {
    return `${year}-${year + 1}`;
  }

  return `${year - 1}-${year}`;
}

module.exports = {
  getFinancialYear,
};
