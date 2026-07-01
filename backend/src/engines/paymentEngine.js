const db = require("../config/db");

// =========================================
// MAKE PAYMENT
// =========================================

const makePayment = async (assessment_id, payment_amount, payment_mode) => {
  return new Promise((resolve, reject) => {
    // =====================================
    // GET ASSESSMENT
    // =====================================

    db.get(
      `
      SELECT *
      FROM tax_assessments
      WHERE id = ?
      `,
      [assessment_id],

      (err, assessment) => {
        if (err || !assessment) {
          return reject("Assessment not found");
        }

        // =====================================
        // GET TOTAL PAID
        // =====================================

        db.get(
          `
          SELECT

            IFNULL(
              SUM(payment_amount),
              0
            ) AS total_paid

          FROM tax_payments

          WHERE assessment_id = ?
          `,
          [assessment_id],

          (err, paymentData) => {
            if (err) {
              return reject(err.message);
            }

            const totalPaid = Number(paymentData?.total_paid || 0);

            const remainingAmount = Number(assessment.total_amount) - totalPaid;

            // =====================================
            // VALIDATION
            // =====================================

            if (Number(payment_amount) <= 0) {
              return reject("Invalid payment amount");
            }

            if (Number(payment_amount) > remainingAmount) {
              return reject("Payment exceeds pending balance");
            }

            // =====================================
            // CREATE PAYMENT
            // =====================================

            createPayment(
              assessment,
              payment_amount,
              payment_mode,
              totalPaid,
              resolve,
              reject,
            );
          },
        );
      },
    );
  });
};

// =========================================
// CREATE PAYMENT
// =========================================

const createPayment = (
  assessment,
  payment_amount,
  payment_mode,
  totalPaid,
  resolve,
  reject,
) => {
  const paymentNumber = "RCPT-" + Date.now();

  db.run(
    `
    INSERT INTO tax_payments (

      tenant_id,
      assessment_id,
      payment_number,
      payment_date,
      payment_amount,
      payment_mode,
      collected_by

    )

    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      1,
      assessment.id,
      paymentNumber,
      new Date().toISOString(),
      payment_amount,
      payment_mode,
      1,
    ],

    function (err) {
      if (err) {
        return reject(err.message);
      }

      const { createAuditLog } = require("../services/auditService");

      // =====================================
      // UPDATE ASSESSMENT STATUS
      // =====================================

      updateAssessmentStatus(
        assessment,
        payment_amount,
        totalPaid,
        paymentNumber,
        resolve,
        reject,
      );
    },
  );
};

// =========================================
// UPDATE STATUS
// =========================================

const updateAssessmentStatus = (
  assessment,
  payment_amount,
  totalPaid,
  paymentNumber,
  resolve,
  reject,
) => {
  const totalAmount = Number(assessment.total_amount);

  const updatedPaid = totalPaid + Number(payment_amount);

  const outstandingAmount = Number(assessment.total_amount) - updatedPaid;

  let newStatus = "PARTIAL";

  if (outstandingAmount <= 0) {
    newStatus = "PAID";
  }
  db.run(
    `
    UPDATE tax_assessments

SET

  assessment_status = ?,

  outstanding_amount = ?,

  last_payment_date = ?

WHERE id = ?
    `,
    [newStatus, outstandingAmount, new Date().toISOString(), assessment_id],

    (err) => {
      if (err) {
        return reject(err.message);
      }

      resolve({
        success: true,
        payment_number: paymentNumber,
        assessment_status: newStatus,
      });
    },
  );
};

await createAuditLog(
  "PAYMENTS",

  "ASSESSMENT",

  assessment_id,

  "PAYMENT_RECEIVED",

  {
    payment_amount,
    payment_mode,
    payment_number: paymentNumber,
  },
);

module.exports = {
  makePayment,
};
