const dashboardRepository = require("../repositories/dashboardRepository");

const getRevenueSummary = async (tenantId) => {
  return await dashboardRepository.getRevenueSummary(tenantId);
};

module.exports = {
  getRevenueSummary,
};
