const db = require("../config/db");

const getRevenueSummary = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT

        (
          SELECT
            IFNULL(SUM(total_amount), 0)
          FROM tax_assessments
          WHERE tenant_id = ?
          AND is_deleted = 0
        ) AS total_assessment,

        (
          SELECT
            IFNULL(SUM(payment_amount), 0)
          FROM tax_payments
          WHERE tenant_id = ?
        ) AS total_collection,

        (
          SELECT
            IFNULL(SUM(total_amount), 0)
          FROM tax_assessments
          WHERE tenant_id = ?
          AND assessment_status != 'PAID'
          AND is_deleted = 0
        ) AS total_pending,

        (
          SELECT
            COUNT(*)
          FROM tax_assessments
          WHERE tenant_id = ?
          AND assessment_status = 'PARTIAL'
          AND is_deleted = 0
        ) AS partial_cases
      `,
      [tenantId, tenantId, tenantId, tenantId],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      },
    );
  });
};

module.exports = {
  getRevenueSummary,
};
