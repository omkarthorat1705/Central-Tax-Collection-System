const {
  createAssessment,
  getAssessmentById,
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

    const total_amount =
      Number(calculated_amount || 0) + Number(arrears_amount || 0);

    const assessment_number = "ASM-" + Date.now();

    const assessmentData = {
      tenant_id: tenantId,
      citizen_id,
      asset_id,
      tax_type_id,
      financial_year,
      assessment_number,
      assessment_date: new Date().toISOString(),
      calculated_amount,
      arrears_amount,
      total_amount,
      generated_by,
      assessment_status: "PENDING",
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

module.exports = {
  generateAssessment,
};