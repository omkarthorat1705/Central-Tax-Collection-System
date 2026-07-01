const repository = require("../repositories/demandRepository");

const generateDemand = async (payload) => {
  const { tenant_id, citizen_id, citizen_tax_record_id, amount } = payload;

  // =====================================
  // GET TAX RECORD
  // =====================================

  const taxRecord = await repository.getCitizenTaxRecord(
    tenant_id,
    citizen_tax_record_id,
  );

  if (!taxRecord) {
    throw new Error("Tax record not found");
  }

  // =====================================
  // FINANCIAL YEAR
  // =====================================

  const currentYear = new Date().getFullYear();

  const financialYear = `${currentYear}-${String(currentYear + 1).slice(2)}`;

  // =====================================
  // DEMAND NUMBER
  // =====================================

  const totalDemands = await repository.getDemandCount(tenant_id);

  const nextNumber = String(totalDemands + 1).padStart(6, "0");

  const demandNumber =
    `${tenant_id}` +
    `${taxRecord.tenant_name}` +
    `-` +
    `${taxRecord.tax_code}` +
    `-` +
    `${financialYear}` +
    `-` +
    nextNumber;

  // =====================================
  // CREATE DEMAND
  // =====================================

  const demandPayload = {
    tenant_id,
    citizen_id,
    citizen_tax_record_id,
    demand_number: demandNumber,
    demand_date: new Date().toISOString(),
    financial_year: financialYear,
    total_amount: amount,
    paid_amount: 0,
    pending_amount: amount,
    status: "PENDING",
  };

  const demandId = await repository.createDemand(demandPayload);

  return {
    demand_id: demandId,
    demand_number: demandNumber,
  };
};

const getDemands = async (tenantId) => {
  return await repository.getDemands(tenantId);
};

module.exports = {
  generateDemand,
  getDemands,
};
