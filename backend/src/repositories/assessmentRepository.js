const db = require("../config/db");

const getAssetById = (assetId, tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT *
      FROM citizen_assets
      WHERE id = ?
      AND tenant_id = ?
      AND is_deleted = 0
      `,
      [assetId, tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
};

const getAssetTaxes = (assetId, tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM asset_tax_mapping
      WHERE asset_id = ?
      AND tenant_id = ?
      AND is_deleted = 0
      `,
      [assetId, tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
};

const getAssetParameters = (assetId, tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        apv.*,
        p.parameter_code

      FROM asset_parameter_values apv

      LEFT JOIN parameters p
      ON apv.parameter_id = p.id
      AND apv.tenant_id = p.tenant_id

      WHERE apv.asset_id = ?
      AND apv.tenant_id = ?
      AND apv.is_deleted = 0
      `,
      [assetId, tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
};

const getRuleByTaxType = (taxTypeId, tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT *
      FROM tax_rules
      WHERE tax_type_id = ?
      AND tenant_id = ?
      AND is_deleted = 0
      ORDER BY priority ASC
      `,
      [taxTypeId, tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
};

const getPreviousOutstanding = (assetId, tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        IFNULL(SUM(total_amount), 0) AS pending_amount

      FROM tax_assessments

      WHERE asset_id = ?
      AND tenant_id = ?
      AND assessment_status != 'PAID'
      AND is_deleted = 0
      `,
      [assetId, tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row?.pending_amount || 0);
      },
    );
  });
};

const createAssessment = (payload, tenantId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO tax_assessments (

        tenant_id,
        citizen_id,
        asset_id,
        tax_type_id,
        financial_year,
        assessment_number,
        assessment_date,
        calculated_amount,
        arrears_amount,
        total_amount,
        generated_by,
        assessment_status,
        is_deleted

      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        tenantId,
        payload.citizen_id,
        payload.asset_id,
        payload.tax_type_id,
        payload.financial_year,
        payload.assessment_number,
        payload.assessment_date,
        payload.calculated_amount,
        payload.arrears_amount,
        payload.total_amount,
        payload.generated_by,
        payload.assessment_status,
        0,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

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

module.exports = {
  getAssetById,
  getAssetTaxes,
  getAssetParameters,
  getRuleByTaxType,
  getPreviousOutstanding,
  createAssessment,
  getAssessmentById,
};
