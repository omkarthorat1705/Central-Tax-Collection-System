const paymentRepository = require("../repositories/paymentRepository");

const { createAuditLog } = require("./auditService");

const makePayment = async (payload, tenantId) => {
  const { assessment_id, payment_amount, payment_mode } = payload;

  const assessment = await paymentRepository.getAssessmentById(
    assessment_id,
    tenantId,
  );

  if (!assessment) {
    throw new Error("Assessment not found");
  }

  const totalPaid = Number(
    await paymentRepository.getTotalPaidAmount(assessment_id, tenantId),
  );

  const totalAmount = Number(assessment.total_amount);

  const remainingAmount = Math.max(0, totalAmount - totalPaid);

  if (remainingAmount <= 0) {
    throw new Error("Assessment is already fully paid.");
  }

  const payment = Number(payment_amount);

  if (payment <= 0) {
    throw new Error("Invalid payment amount.");
  }

  if (payment > remainingAmount) {
    throw new Error(
      `Payment exceeds pending balance. Remaining balance: ₹${remainingAmount.toFixed(2)}`,
    );
  }

  const paymentNumber = `RCPT-${Date.now()}`;

  const paymentId = await paymentRepository.createPayment({
    tenant_id: tenantId,
    assessment_id,
    payment_amount: payment,
    payment_mode,
    payment_number: paymentNumber,
    collected_by: 1,
  });

  const updatedPaid = totalPaid + payment;

  let status = "PENDING";

  if (updatedPaid >= totalAmount - 0.01) {
    status = "PAID";
  } else if (updatedPaid > 0) {
    status = "PARTIAL";
  }

  await paymentRepository.updateAssessmentStatus(
    assessment_id,
    tenantId,
    status.toUpperCase(),
  );

  try {
    await createAuditLog({
      tenant_id: tenantId,
      entity_name: "tax_payments",
      entity_id: paymentId,
      action_type: "CREATE",
      action_by: 1,
      new_value: {
        assessment_id,
        payment_amount: payment,
        payment_mode,
        payment_number: paymentNumber,
      },
    });
  } catch (err) {
    console.error(err.message);
  }

  return {
    payment_id: paymentId,
    payment_number: paymentNumber,
    assessment_status: status,
    remaining_amount: Math.max(0, totalAmount - updatedPaid),
  };
};

const listPayments = async (tenantId) => {
  return paymentRepository.getPayments(tenantId);
};

module.exports = {
  makePayment,
  listPayments,
};
