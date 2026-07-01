const db = require("../config/db");

// =====================================
// GET ASSETS
// =====================================

const getAssets = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        ca.*,
        c.citizen_code,
        c.full_name

      FROM citizen_assets ca

      LEFT JOIN citizens c
      ON c.id = ca.citizen_id

      WHERE ca.tenant_id = ?
      AND ca.is_deleted = 0

      ORDER BY ca.id DESC
      `,
      [tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
};

// =====================================
// GET ASSET BY ID
// =====================================

const getAssetById = (assetId, tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        ca.*,
        c.citizen_code,
        c.full_name

      FROM citizen_assets ca

      LEFT JOIN citizens c
      ON c.id = ca.citizen_id

      WHERE ca.id = ?
      AND ca.tenant_id = ?
      AND ca.is_deleted = 0
      `,
      [assetId, tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
};

// =====================================
// CREATE ASSET
// =====================================

const createAsset = (payload) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO citizen_assets
      (
        tenant_id,
        citizen_id,
        asset_code,
        asset_type,
        asset_name,
        asset_address,
        status,
        is_deleted
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.tenant_id,
        payload.citizen_id,
        payload.asset_code,
        payload.asset_type,
        payload.asset_name,
        payload.asset_address,
        payload.status,
        payload.is_deleted,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

// =====================================
// SAVE ASSET TAXES
// =====================================

const createAssetTaxMappings = (assetId, taxTypeIds, tenantId) => {
  return Promise.all(
    (taxTypeIds || []).map(
      (taxTypeId) =>
        new Promise((resolve, reject) => {
          db.run(
            `
            INSERT INTO asset_tax_mapping
            (
              tenant_id,
              citizen_asset_id,
              tax_type_id,
              status,
              is_deleted
            )
            VALUES (?, ?, ?, 'ACTIVE', 0)
            `,
            [tenantId, assetId, taxTypeId],
            (err) => {
              if (err) reject(err);
              else resolve();
            },
          );
        }),
    ),
  );
};

// =====================================
// SAVE PARAMETER VALUES
// =====================================

const createAssetParameterValues = (assetId, parameterValues, tenantId) => {
  const records = Object.entries(parameterValues || {});

  return Promise.all(
    records.map(
      ([parameterId, parameterValue]) =>
        new Promise((resolve, reject) => {
          db.run(
            `
            INSERT INTO asset_parameter_values
            (
              tenant_id,
              citizen_asset_id,
              parameter_id,
              parameter_value,
              is_deleted
            )
            VALUES (?, ?, ?, ?, 0)
            `,
            [tenantId, assetId, parameterId, parameterValue],
            (err) => {
              if (err) reject(err);
              else resolve();
            },
          );
        }),
    ),
  );
};

// =====================================
// GET ASSET TAXES
// =====================================

const getAssetTaxes = (assetId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        tt.*
      FROM asset_tax_mapping atm

      INNER JOIN tax_types tt
      ON tt.id = atm.tax_type_id

      WHERE atm.citizen_asset_id = ?
      AND atm.is_deleted = 0
      `,
      [assetId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
};

// =====================================
// GET PARAMETER VALUES
// =====================================

const getAssetParameterValues = (assetId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        apv.*,
        p.parameter_name

      FROM asset_parameter_values apv

      INNER JOIN parameters p
      ON p.id = apv.parameter_id

      WHERE apv.citizen_asset_id = ?
      AND apv.is_deleted = 0
      `,
      [assetId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
};

// =====================================
// UPDATE ASSET
// =====================================

const updateAsset = (assetId, payload) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE citizen_assets
      SET
        citizen_id = ?,
        asset_name = ?,
        asset_type = ?,
        asset_address = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        payload.citizen_id,
        payload.asset_name,
        payload.asset_type,
        payload.asset_address,
        assetId,
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
};

// =====================================
// DELETE ASSET
// =====================================

const deleteAsset = (assetId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE citizen_assets
      SET is_deleted = 1
      WHERE id = ?
      `,
      [assetId],
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
};

const getAssetTypes = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        id,
        asset_type_code,
        asset_type_name
      FROM asset_types
      WHERE tenant_id = ?
      AND is_deleted = 0
      ORDER BY asset_type_name
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
  getAssets,
  getAssetById,
  createAsset,
  createAssetTaxMappings,
  createAssetParameterValues,
  getAssetTaxes,
  getAssetParameterValues,
  updateAsset,
  deleteAsset,
  getAssetTypes,
};
