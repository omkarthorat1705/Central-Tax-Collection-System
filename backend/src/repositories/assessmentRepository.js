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
      WHERE citizen_asset_id = ?
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

      WHERE citizen_asset_id = ?
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

const getAssessments = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        ta.id,
        ta.assessment_number,
        ta.financial_year,
        ta.calculated_amount,
        ta.arrears_amount,
        ta.penalty_amount,
        ta.total_amount,
        ta.assessment_status,
        ta.assessment_date,
        ta.due_date,
        ta.outstanding_amount,
        a.asset_code,
        a.asset_name,
        c.full_name AS citizen_name,
        tt.tax_name
      FROM tax_assessments ta
      LEFT JOIN citizen_assets a ON a.id = ta.asset_id AND a.tenant_id = ta.tenant_id
      LEFT JOIN citizens c ON c.id = ta.citizen_id AND c.tenant_id = ta.tenant_id
      LEFT JOIN tax_types tt ON tt.id = ta.tax_type_id AND tt.tenant_id = ta.tenant_id
      WHERE ta.tenant_id = ?
      AND ta.is_deleted = 0
      ORDER BY ta.created_at DESC
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
  getAssetById,
  getAssetTaxes,
  getAssetParameters,
  getRuleByTaxType,
  getPreviousOutstanding,
  createAssessment,
  getAssessmentById,
  getAssessments,
};
