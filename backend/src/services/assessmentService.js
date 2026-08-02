const {
  createAssessment,
  getAssessmentById,
  getAssessments,
  getAssetById,
} = require("../repositories/assessmentRepository");

const { createAuditLog } = require("./auditService");
const assessmentEngine = require("../engines/assessmentEngine");

const generateAssessment = async (payload, tenantId) => {
  const { asset_id, financial_year, generated_by } = payload;

  if (!asset_id) {
    throw new Error("Asset is required.");
  }

  if (!financial_year) {
    throw new Error("Financial year is required.");
  }

  await assessmentEngine.generateAssessment(Number(asset_id), financial_year);

  await createAuditLog({
    tenant_id: tenantId,
    module_name: "ASSESSMENT",
    entity_name: "tax_assessments",
    entity_id: asset_id,
    action_type: "GENERATE",
    action_by: generated_by || 1,
    old_value: null,
    new_value: JSON.stringify(payload),
    remarks: "Assessment generated using assessment engine",
  });

  return getAssessments(tenantId);
};

const listAssessments = async (tenantId) => {
  return getAssessments(tenantId);
};

module.exports = {
  generateAssessment,
  listAssessments,
};
