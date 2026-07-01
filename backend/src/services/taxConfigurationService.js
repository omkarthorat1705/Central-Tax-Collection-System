const repository = require("../repositories/taxConfigurationRepository");

// =====================================
// TAX TYPES
// =====================================

const getTaxTypes = async (tenantId) => {
  return await repository.getTaxTypes(tenantId);
};

const addTaxType = async (payload) => {
  return await repository.createTaxType(payload);
};

const deleteTaxType = async (tenantId, id) => {
  return await repository.deleteTaxType(tenantId, id);
};

// =====================================
// PARAMETERS
// =====================================

const getParameters = async (tenantId) => {
  return await repository.getParameters(tenantId);
};

const addParameter = async (payload) => {
  return await repository.createParameter(payload);
};

// =====================================
// RULES
// =====================================

const getRules = async (tenantId) => {
  return await repository.getRules(tenantId);
};

const addRule = async (payload) => {
  return await repository.createRule(payload);
};

module.exports = {
  getTaxTypes,
  addTaxType,
  deleteTaxType,

  getParameters,
  addParameter,

  getRules,
  addRule,
};
