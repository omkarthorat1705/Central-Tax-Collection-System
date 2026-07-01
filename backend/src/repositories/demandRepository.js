const db = require("../config/db");

// =====================================
// GET TAX RECORD
// =====================================

const getCitizenTaxRecord = (tenantId, citizenTaxRecordId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT

        ctr.*,
        tt.tax_code,
        t.tenant_name

      FROM citizen_tax_records ctr

      LEFT JOIN tax_types tt
      ON ctr.tax_type_id = tt.id

      LEFT JOIN tenants t
      ON ctr.tenant_id = t.id

      WHERE ctr.id = ?
      AND ctr.tenant_id = ?
      `,
      [citizenTaxRecordId, tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
};

// =====================================
// GET DEMAND COUNT
// =====================================

const getDemandCount = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT COUNT(*) AS total
      FROM tax_demands
      WHERE tenant_id = ?
      `,
      [tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row.total || 0);
      },
    );
  });
};

// =====================================
// CREATE DEMAND
// =====================================

const createDemand = (payload) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO tax_demands (

        tenant_id,
        citizen_id,
        citizen_tax_record_id,
        demand_number,
        demand_date,
        financial_year,
        total_amount,
        paid_amount,
        pending_amount,
        status,
        is_deleted

      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.tenant_id,
        payload.citizen_id,
        payload.citizen_tax_record_id,
        payload.demand_number,
        payload.demand_date,
        payload.financial_year,
        payload.total_amount,
        payload.paid_amount,
        payload.pending_amount,
        payload.status,
        0,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

// =====================================
// GET ALL DEMANDS
// =====================================

const getDemands = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT

        td.*,
        c.full_name,
        tt.tax_name

      FROM tax_demands td

      LEFT JOIN citizens c
      ON td.citizen_id = c.id

      LEFT JOIN citizen_tax_records ctr
      ON td.citizen_tax_record_id = ctr.id

      LEFT JOIN tax_types tt
      ON ctr.tax_type_id = tt.id

      WHERE td.tenant_id = ?
      AND td.is_deleted = 0

      ORDER BY td.id DESC
      `,
      [tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
};

module.exports = {
  getCitizenTaxRecord,
  getDemandCount,
  createDemand,
  getDemands,
};
