const financialYearRepository = require("../repositories/financialYearRepository");

const getCurrentFinancialYear = async (tenantId) => {
  return await financialYearRepository.getActiveFinancialYear(tenantId);
};

const getFinancialYears = async (tenantId) => {
  return await financialYearRepository.getAllFinancialYears(tenantId);
};

const freezeYear = async (tenantId, financialYearId) => {
  return await financialYearRepository.freezeFinancialYear(
    tenantId,
    financialYearId,
  );
};

module.exports = {
  getCurrentFinancialYear,
  getFinancialYears,
  freezeYear,
};
