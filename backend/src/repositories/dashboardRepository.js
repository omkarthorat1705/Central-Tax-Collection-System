const db = require("../config/db");

const getRevenueSummary = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        (
          SELECT COUNT(*)
          FROM citizens
          WHERE tenant_id = ?
          AND is_deleted = 0
        ) AS total_citizens,

        (
          SELECT COUNT(*)
          FROM citizen_assets
          WHERE tenant_id = ?
          AND is_deleted = 0
        ) AS total_assets,

        (
          SELECT COUNT(*)
          FROM tax_assessments
          WHERE tenant_id = ?
          AND is_deleted = 0
        ) AS total_assessments,

        (
          SELECT IFNULL(SUM(payment_amount), 0)
          FROM tax_payments
          WHERE tenant_id = ?
        ) AS total_collection,

        (
          SELECT IFNULL(SUM(total_amount), 0)
          FROM tax_assessments
          WHERE tenant_id = ?
          AND assessment_status != 'PAID'
          AND is_deleted = 0
        ) AS total_pending,

        (
          SELECT COUNT(*)
          FROM tax_assessments
          WHERE tenant_id = ?
          AND assessment_status IN ('PARTIAL','PARTIALLY_PAID')
          AND is_deleted = 0
        ) AS partial_cases
      `,
      [tenantId, tenantId, tenantId, tenantId, tenantId, tenantId],
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

const getWardWiseCollection = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        COALESCE(c.ward_number, 'UNASSIGNED') AS ward_number,
        IFNULL(SUM(tp.payment_amount), 0) AS total_collection
      FROM tax_payments tp
      LEFT JOIN tax_assessments ta ON ta.id = tp.assessment_id AND ta.tenant_id = tp.tenant_id
      LEFT JOIN citizens c ON c.id = ta.citizen_id AND c.tenant_id = tp.tenant_id
      WHERE tp.tenant_id = ?
      GROUP BY COALESCE(c.ward_number, 'UNASSIGNED')
      ORDER BY total_collection DESC
      `,
      [tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      },
    );
  });
};

const getTaxWiseCollection = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        tt.tax_name,
        IFNULL(SUM(tp.payment_amount), 0) AS total_collection
      FROM tax_payments tp
      LEFT JOIN tax_assessments ta ON ta.id = tp.assessment_id AND ta.tenant_id = tp.tenant_id
      LEFT JOIN tax_types tt ON tt.id = ta.tax_type_id AND tt.tenant_id = tp.tenant_id
      WHERE tp.tenant_id = ?
      GROUP BY ta.tax_type_id, tt.tax_name
      ORDER BY total_collection DESC
      `,
      [tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      },
    );
  });
};

module.exports = {
  getRevenueSummary,
  getWardWiseCollection,
  getTaxWiseCollection,
};
