const db = require("../config/db");

const getActiveFinancialYear = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT *
      FROM financial_years
      WHERE tenant_id = ?
      AND status = 'ACTIVE'
      AND is_deleted = 0
      LIMIT 1
      `,
      [tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
};

const getFinancialYearById = (tenantId, id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT *
      FROM financial_years
      WHERE tenant_id = ?
      AND id = ?
      `,
      [tenantId, id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
};

const getAllFinancialYears = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM financial_years
      WHERE tenant_id = ?
      AND is_deleted = 0
      ORDER BY id DESC
      `,
      [tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
};

const freezeFinancialYear = (tenantId, id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE financial_years
      SET freeze_status = 'FROZEN'
      WHERE tenant_id = ?
      AND id = ?
      `,
      [tenantId, id],
      function (err) {
        if (err) reject(err);
        else resolve(true);
      },
    );
  });
};

module.exports = {
  getActiveFinancialYear,
  getFinancialYearById,
  getAllFinancialYears,
  freezeFinancialYear,
};
