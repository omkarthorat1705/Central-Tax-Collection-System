const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// ======================================
// GET TAX TYPES
// ======================================

const getTaxTypes = asyncHandler(async (req, res) => {
  const query = `
    SELECT
      id,
      tax_code,
      tax_name,
      description,
      is_active,
      created_at
    FROM tax_types
    WHERE is_deleted = 0
    ORDER BY id ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);

      return errorResponse(res, "Failed to fetch tax types");
    }

    const {
      successResponse,
      errorResponse,
    } = require("../utils/responseHandler");
    return successResponse(res, rows);
  });
});

// ======================================
// ADD TAX TYPE
// ======================================

const addTaxType = asyncHandler(async (req, res) => {
  const { tax_code, tax_name, description } = req.body;

  if (!tax_name) {
    return errorResponse(res, "Tax Name is required");
  }

  const query = `
    INSERT INTO tax_types (
      tenant_id,
      tax_code,
      tax_name,
      description,
      created_by
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [1, tax_code || null, tax_name, description || null, 1],

    function (err) {
      if (err) {
        console.error(err);

        return errorResponse(res, "Failed to add tax type");
      }

      return successResponse(res, {
        message: "Tax Type Added Successfully",
        id: this.lastID,
      });
    },
  );
});

// ======================================
// DELETE TAX TYPE
// ======================================

const deleteTaxType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE tax_types
    SET is_deleted = 1
    WHERE id = ?
  `;

  db.run(
    query,
    [id],

    function (err) {
      if (err) {
        console.error(err);

        return errorResponse(res, "Failed to delete tax type");
      }

      return successResponse(res, {
        message: "Tax Type Deleted",
      });
    },
  );
});

module.exports = {
  getTaxTypes,
  addTaxType,
  deleteTaxType,
};
