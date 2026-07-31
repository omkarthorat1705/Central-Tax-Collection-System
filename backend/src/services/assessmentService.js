const {
  createAssessment,
  getAssessmentById,
  getAssessments,
  getAssetById,
} = require("../repositories/assessmentRepository");

const { createAuditLog } = require("./auditService");

const generateAssessment = async (payload, tenantId) => {
  try {
    const {
      citizen_id,
      asset_id,
      tax_type_id,
      financial_year,
      calculated_amount,
      arrears_amount,
      generated_by,
    } = payload;

    const selectedAssetId = asset_id;
    const assetRecord = selectedAssetId
      ? await getAssetById(selectedAssetId, tenantId)
      : null;

    const resolvedCitizenId = citizen_id || assetRecord?.citizen_id || null;
    const resolvedTaxTypeId = tax_type_id || null;
    const resolvedCalculatedAmount =
      calculated_amount != null ? Number(calculated_amount) : 0;
    const resolvedArrearsAmount =
      arrears_amount != null ? Number(arrears_amount) : 0;
    const total_amount = resolvedCalculatedAmount + resolvedArrearsAmount;

    const assessment_number = "ASM-" + Date.now();

    const assessmentData = {
      tenant_id: tenantId,
      citizen_id: resolvedCitizenId,
      asset_id: selectedAssetId,
      tax_type_id: resolvedTaxTypeId,
      financial_year,
      assessment_number,
      assessment_date: new Date().toISOString(),
      calculated_amount: resolvedCalculatedAmount,
      arrears_amount: resolvedArrearsAmount,
      total_amount,
      generated_by: generated_by || 1,
      assessment_status: "GENERATED",
      is_deleted: 0,
    };

    // =====================================
    // CREATE ASSESSMENT
    // =====================================

    const assessmentId = await createAssessment(
      assessmentData,
      tenantId,
    );

    // =====================================
    // AUDIT LOG
    // =====================================

    await createAuditLog({
      tenant_id: tenantId,
      module_name: "ASSESSMENT",
      entity_name: "tax_assessments",
      entity_id: assessmentId,
      action_type: "CREATE",
      action_by: generated_by,
      old_value: null,
      new_value: JSON.stringify(assessmentData),
      remarks: "Assessment Generated",
    });

    // =====================================
    // RETURN FINAL OBJECT
    // =====================================

    return await getAssessmentById(
      assessmentId,
      tenantId,
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const listAssessments = async (tenantId) => {
  return getAssessments(tenantId);
};

module.exports = {
  generateAssessment,
  listAssessments,
};