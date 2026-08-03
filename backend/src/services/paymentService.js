const paymentRepository = require("../repositories/paymentRepository");

const { createAuditLog } = require("./auditService");

const makePayment = async (payload, tenantId) => {
  try {
    const { assessment_id, payment_amount, payment_mode } = payload;

    // =====================================
    // GET ASSESSMENT
    // =====================================

    const assessment = await paymentRepository.getAssessmentById(
      assessment_id,
      tenantId,
    );

    if (!assessment) {
      throw new Error("Assessment not found");
    }

    // =====================================
    // GET TOTAL PAID
    // =====================================

    const totalPaid = await paymentRepository.getTotalPaidAmount(
      assessment_id,
      tenantId,
    );

    const remainingAmount = Number(assessment.total_amount) - Number(totalPaid);

    // =====================================
    // VALIDATE PAYMENT
    // =====================================

    if (Number(payment_amount) > remainingAmount) {
      throw new Error("Payment exceeds pending balance");
    }

    // =====================================
    // PAYMENT NUMBER
    // =====================================

    const paymentNumber = "RCPT-" + Date.now();

    // =====================================
    // CREATE PAYMENT
    // =====================================

    const paymentId = await paymentRepository.createPayment({
      tenant_id: tenantId,
      assessment_id,
      payment_amount,
      payment_mode,
      payment_number: paymentNumber,
      collected_by: 1,
    });

    // =====================================
    // UPDATE STATUS
    // =====================================

    const updatedPaid = Number(totalPaid) + Number(payment_amount);

    const newStatus =
      updatedPaid >= Number(assessment.total_amount) ? "PAID" : "PARTIAL";

    await paymentRepository.updateAssessmentStatus(
      assessment_id,
      tenantId,
      newStatus,
    );

    // =====================================
    // AUDIT LOG
    // =====================================

    await createAuditLog({
      tenant_id: tenantId,
      entity_name: "tax_payments",
      entity_id: paymentId,
      action_type: "CREATE",
      action_by: 1,
      old_value: null,
      new_value: JSON.stringify({
        assessment_id,
        payment_amount,
        payment_mode,
      }),
      remarks: "Payment Collected",
    });

    return {
      payment_id: paymentId,
      payment_number: paymentNumber,
      assessment_status: newStatus,
      remaining_amount: Number(assessment.total_amount) - updatedPaid,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const listPayments = async (tenantId) => {
  return paymentRepository.getPayments(tenantId);
};

module.exports = {
  makePayment,
  listPayments,
};
