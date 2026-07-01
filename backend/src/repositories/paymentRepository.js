const db = require("../config/db");

const getAssessmentById = (assessmentId, tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT *
      FROM tax_assessments

      WHERE id = ?
      AND tenant_id = ?
      AND is_deleted = 0
      `,
      [assessmentId, tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
};

const getTotalPaidAmount = (assessmentId, tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT

        IFNULL(
          SUM(payment_amount),
          0
        ) AS total_paid

      FROM tax_payments

      WHERE assessment_id = ?
      AND tenant_id = ?
      `,
      [assessmentId, tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row?.total_paid || 0);
      },
    );
  });
};

const createPayment = (payload) => {
  return new Promise((resolve, reject) => {
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
        payload.tenant_id,
        payload.assessment_id,
        payload.payment_number,
        new Date().toISOString(),
        payload.payment_amount,
        payload.payment_mode,
        payload.collected_by,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

const updateAssessmentStatus = (assessmentId, tenantId, status) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE tax_assessments

      SET assessment_status = ?

      WHERE id = ?
      AND tenant_id = ?
      `,
      [status, assessmentId, tenantId],
      (err) => {
        if (err) reject(err);
        else resolve(true);
      },
    );
  });
};

module.exports = {
  getAssessmentById,
  getTotalPaidAmount,
  createPayment,
  updateAssessmentStatus,
};
