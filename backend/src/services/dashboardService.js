const dashboardRepository = require("../repositories/dashboardRepository");

const getRevenueSummary = async (tenantId) => {
  return await dashboardRepository.getRevenueSummary(tenantId);
};

const getWardWiseCollection = async (tenantId) => {
  return await dashboardRepository.getWardWiseCollection(tenantId);
};

const getTaxWiseCollection = async (tenantId) => {
  return await dashboardRepository.getTaxWiseCollection(tenantId);
};

module.exports = {
  getRevenueSummary,
  getWardWiseCollection,
  getTaxWiseCollection,
};
