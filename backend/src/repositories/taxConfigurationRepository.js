const db = require("../config/db");

// =====================================
// TAX TYPES
// =====================================

const getTaxTypes = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM tax_types
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

const createTaxType = (payload) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO tax_types (

        tenant_id,
        tax_code,
        tax_name,
        description,
        is_active,
        created_by,
        is_deleted

      )

      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.tenant_id,
        payload.tax_code,
        payload.tax_name,
        payload.description,
        1,
        payload.created_by,
        0,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

const deleteTaxType = (tenantId, id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE tax_types
      SET is_deleted = 1
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

// =====================================
// PARAMETERS
// =====================================

const getParameters = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT

        p.*,
        t.tax_name

      FROM parameters p

      LEFT JOIN tax_types t
      ON p.tax_type_id = t.id

      WHERE p.tenant_id = ?

      ORDER BY p.display_order ASC
      `,
      [tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
};

const createParameter = (payload) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO parameters (

        tenant_id,
        tax_type_id,
        parameter_code,
        parameter_name,
        data_type,
        ui_type,
        possible_values,
        default_value,
        validation_rule,
        required_flag,
        display_order

      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.tenant_id,
        payload.tax_type_id,
        payload.parameter_code,
        payload.parameter_name,
        payload.data_type,
        payload.ui_type,
        payload.possible_values,
        payload.default_value,
        payload.validation_rule,
        payload.required_flag,
        payload.display_order,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

// =====================================
// RULES
// =====================================

const getRules = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT

        r.*,
        t.tax_name

      FROM rules r

      LEFT JOIN tax_types t
      ON r.tax_type_id = t.id

      WHERE r.tenant_id = ?
      AND r.is_deleted = 0

      ORDER BY r.priority ASC
      `,
      [tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
};

const createRule = (payload) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO rules (

        tenant_id,
        tax_type_id,
        rule_code,
        rule_name,
        formula_expression,
        output_value,
        priority,
        is_active,
        created_by,
        is_deleted

      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.tenant_id,
        payload.tax_type_id,
        payload.rule_code,
        payload.rule_name,
        payload.formula_expression,
        payload.output_value,
        payload.priority,
        1,
        payload.created_by,
        0,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

module.exports = {
  getTaxTypes,
  createTaxType,
  deleteTaxType,

  getParameters,
  createParameter,

  getRules,
  createRule,
};
