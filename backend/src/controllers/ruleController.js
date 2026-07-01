const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const { successResponse, errorResponse } = require("../utils/responseHandler");

//
// ======================================
// GET RULES
// ======================================
//

const getRules = asyncHandler(async (req, res) => {
  const { taxTypeId } = req.params;

  let query = `
    SELECT
      id,
      tax_type_id,
      rule_code,
      rule_name,
      formula_expression,
      priority,
      is_active,
      created_at
    FROM rules
    WHERE is_deleted = 0
  `;

  const params = [];

  // Optional tax type filter
  if (taxTypeId) {
    query += ` AND tax_type_id = ?`;
    params.push(taxTypeId);
  }

  query += `
    ORDER BY priority ASC,
             id ASC
  `;

  db.all(query, params, (err, rows) => {
    if (err) {
      console.log(err);

      return errorResponse(res, err.message, 500);
    }

    return successResponse(res, rows, "Rules fetched successfully");
  });
});

//
// ======================================
// ADD RULE
// ======================================
//

const addRule = asyncHandler(async (req, res) => {
  const {
    tax_type_id,
    rule_code,
    rule_name,
    formula_expression,
    priority,
    conditions,
  } = req.body;

  if (!tax_type_id) {
    return errorResponse(res, "Tax Type is required", 400);
  }

  if (!rule_name) {
    return errorResponse(res, "Rule Name is required", 400);
  }

  const ruleQuery = `
    INSERT INTO rules (

      tenant_id,
      tax_type_id,
      rule_code,
      rule_name,
      formula_expression,
      priority,
      created_by

    )

    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    ruleQuery,
    [
      1,
      tax_type_id,
      rule_code || null,
      rule_name,
      formula_expression || null,
      priority || 1,
      1,
    ],
    function (err) {
      if (err) {
        console.log(err);

        return errorResponse(res, err.message, 500);
      }

      const ruleId = this.lastID;

      //
      // NO CONDITIONS
      //

      if (!conditions || conditions.length === 0) {
        return successResponse(
          res,
          {
            id: ruleId,
          },
          "Rule added successfully",
        );
      }

      //
      // INSERT CONDITIONS
      //

      const conditionQuery = `
        INSERT INTO rule_conditions (

          tenant_id,
          rule_id,
          parameter_id,
          operator,
          comparison_value,
          condition_order

        )

        VALUES (?, ?, ?, ?, ?, ?)
      `;

      let completed = 0;

      conditions.forEach((condition, index) => {
        db.run(
          conditionQuery,
          [
            1,
            ruleId,
            condition.parameter_id,
            condition.operator,
            condition.comparison_value,
            index + 1,
          ],
          (conditionErr) => {
            if (conditionErr) {
              console.log(conditionErr);

              return errorResponse(res, conditionErr.message, 500);
            }

            completed++;

            if (completed === conditions.length) {
              return successResponse(
                res,
                {
                  id: ruleId,
                },
                "Rule added successfully",
              );
            }
          },
        );
      });
    },
  );
});

//
// ======================================
// DELETE RULE
// ======================================
//

const deleteRule = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE rules
    SET is_deleted = 1
    WHERE id = ?
  `;

  db.run(query, [id], (err) => {
    if (err) {
      console.log(err);

      return errorResponse(res, err.message, 500);
    }

    return successResponse(res, null, "Rule deleted successfully");
  });
});

module.exports = {
  getRules,
  addRule,
  deleteRule,
};
