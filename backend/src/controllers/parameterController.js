const db = require("../config/db");

const asyncHandler = require("../utils/asyncHandler");

const { successResponse, errorResponse } = require("../utils/responseHandler");

// ======================================
// GET PARAMETERS
// ======================================

const getParameters = asyncHandler(async (req, res) => {
  const { taxTypeId } = req.params;

  let query = `     SELECT
      id,
      tenant_id,
      tax_type_id,
      parameter_code,
      parameter_name,
      parameter_type,
      ui_component,
      validation_rules,
      possible_values,
      required_flag,
      display_order,
      asset_type,
      status
    FROM parameters
    WHERE is_deleted = 0
  `;

  const queryParams = [];

  // Optional filter
  if (taxTypeId) {
    query += `AND tax_type_id = ?`;
    queryParams.push(taxTypeId);
  }

  query += `     ORDER BY display_order ASC,
             id ASC
  `;

  db.all(query, queryParams, (err, rows) => {
    if (err) {
      console.error(err);
      return errorResponse(res, "Failed to fetch parameters");
    }

    return successResponse(res, rows);
  });
});

const getAssetParameters = asyncHandler(async (req, res) => {
  const { tax_type_ids } = req.body;

  if (!tax_type_ids || !tax_type_ids.length) {
    return successResponse(res, []);
  }

  const placeholders = tax_type_ids.map(() => "?").join(",");

  const query = `
    SELECT
      id,
      tax_type_id,
      parameter_code,
      parameter_name,
      parameter_type,
      ui_component,
      possible_values,
      required_flag,
      display_order
    FROM parameters
    WHERE is_deleted = 0
    AND status = 'ACTIVE'
    AND tax_type_id IN (${placeholders})
    ORDER BY display_order ASC
  `;

  db.all(query, tax_type_ids, (err, rows) => {
    if (err) {
      console.error(err);
      return errorResponse(res, "Failed to fetch parameters");
    }

    return successResponse(res, rows);
  });
});

// ======================================
// ADD PARAMETER
// ======================================

const addParameter = asyncHandler(async (req, res) => {
  const {
    tax_type_id,
    parameter_code,
    parameter_name,
    parameter_type,
    ui_component,
    validation_rules,
    possible_values,
    required_flag,
    display_order,
    asset_type,
  } = req.body;

  if (!tax_type_id) {
    return errorResponse(res, "Tax Type is required", 400);
  }

  if (!parameter_name) {
    return errorResponse(res, "Parameter Name is required", 400);
  }

  const query = `
INSERT INTO parameters (
  tenant_id,
  tax_type_id,
  parameter_code,
  parameter_name,
  parameter_type,
  ui_component,
  validation_rules,
  possible_values,
  required_flag,
  display_order,
  asset_type,
  status,
  created_by,
  is_deleted

)

VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

`;

  db.run(
    query,
    [
      req.tenant.tenant_id,
      tax_type_id,
      parameter_code || null,
      parameter_name,
      parameter_type || null,
      ui_component || null,
      validation_rules || null,
      possible_values || null,
      required_flag ? 1 : 0,
      display_order || 1,
      asset_type || null,
      "ACTIVE",
      1,
      0,
    ],

    function (err) {
      if (err) {
        console.error(err);

        return errorResponse(res, "Failed to add parameter");
      }

      return successResponse(res, {
        message: "Parameter Added Successfully",
        id: this.lastID,
      });
    },
  );
});

// ======================================
// DELETE PARAMETER
// ======================================

const deleteParameter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const query = `     UPDATE parameters
    SET is_deleted = 1
    WHERE id = ?
  `;

  db.run(query, [id], function (err) {
    if (err) {
      console.error(err);
      return errorResponse(res, "Failed to delete parameter");
    }

    return successResponse(res, {
      message: "Parameter Deleted",
    });
  });
});

module.exports = {
  getParameters,
  addParameter,
  deleteParameter,
  getAssetParameters,
};
