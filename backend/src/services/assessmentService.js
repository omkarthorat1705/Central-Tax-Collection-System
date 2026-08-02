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

  try {
    await createAuditLog({
      tenant_id: 1,
      action: "CREATE",
      table_name: "tax_assessments",
      record_id: assessment.id,
      module_name: "Assessment",
      new_values: assessment,
      created_by: 1,
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }

  return getAssessments(tenantId);
};

const listAssessments = async (tenantId) => {
  return getAssessments(tenantId);
};

module.exports = {
  generateAssessment,
  listAssessments,
};
