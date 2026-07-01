const db = require("../config/database");

// =========================================
// GENERATE ASSESSMENT
// =========================================

const generateAssessment = async (asset_id, financial_year) => {
  return new Promise((resolve, reject) => {
    // =====================================
    // GET ASSET
    // =====================================

    db.get(
      `
      SELECT *
      FROM citizen_assets
      WHERE id = ?
      `,
      [asset_id],

      (err, asset) => {
        if (err || !asset) {
          return reject("Asset not found");
        }

        // =====================================
        // GET ASSET TAXES
        // =====================================

        db.all(
          `
          SELECT *
          FROM asset_tax_mapping
          WHERE asset_id = ?
          AND is_deleted = 0
          `,
          [asset_id],

          (err, taxes) => {
            if (err) {
              return reject(err.message);
            }

            if (!taxes.length) {
              return reject("No taxes mapped to asset");
            }

            let completed = 0;

            taxes.forEach((tax) => {
              processTaxAssessment(
                asset,
                tax,
                financial_year,
                () => {
                  completed++;

                  if (completed === taxes.length) {
                    resolve(true);
                  }
                },
                reject,
              );
            });
          },
        );
      },
    );
  });
};

// =========================================
// PROCESS SINGLE TAX
// =========================================

const processTaxAssessment = (asset, tax, financial_year, callback, reject) => {
  // =====================================
  // GET PARAMETER VALUES
  // =====================================

  db.all(
    `
    SELECT

      apv.*,
      p.parameter_code

    FROM asset_parameter_values apv

    LEFT JOIN parameters p
    ON apv.parameter_id = p.id

    WHERE apv.asset_id = ?
    `,
    [asset.id],

    (err, parameterValues) => {
      if (err) {
        return reject(err.message);
      }

      // =====================================
      // BUILD PARAMETER MAP
      // =====================================

      const parameterMap = {};

      parameterValues.forEach((item) => {
        parameterMap[item.parameter_code] = item.parameter_value;
      });

      // =====================================
      // GET RULE
      // =====================================

      db.get(
        `
        SELECT *
        FROM tax_rules
        WHERE tax_type_id = ?
        ORDER BY priority ASC
        `,
        [tax.tax_type_id],

        (err, rule) => {
          if (err || !rule) {
            return reject("Tax rule not found");
          }

          // =====================================
          // CALCULATE TAX
          // =====================================

          const calculatedAmount = calculateTax(parameterMap, rule);

          // =====================================
          // GET PREVIOUS DUES
          // =====================================

          db.get(
            `
            SELECT

              IFNULL(
                SUM(
                  total_amount
                ),
                0
              ) AS pending_amount

            FROM tax_assessments

            WHERE asset_id = ?
            `,
            [asset.id],

            (err, dues) => {
              if (err) {
                return reject(err.message);
              }

              const arrearsAmount = Number(dues?.pending_amount || 0);

              const totalAmount = calculatedAmount + arrearsAmount;

              // =====================================
              // CREATE ASSESSMENT
              // =====================================

              createAssessment(
                asset,
                tax,
                financial_year,
                calculatedAmount,
                arrearsAmount,
                totalAmount,
                callback,
                reject,
              );
            },
          );
        },
      );
    },
  );
};

// =========================================
// TAX CALCULATION
// =========================================

const calculateTax = (parameterMap, rule) => {
  const area = Number(parameterMap["AREA"] || 0);

  const rate = Number(rule.calculation_value || 0);

  return area * rate;
};

// =========================================
// CREATE ASSESSMENT
// =========================================

const createAssessment = (
  asset,
  tax,
  financial_year,
  calculatedAmount,
  arrearsAmount,
  totalAmount,
  callback,
  reject,
) => {
  const assessmentNumber = "ASM-" + Date.now();

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
      assessment_status,
      generated_by

    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      1,
      asset.citizen_id,
      asset.id,
      tax.tax_type_id,
      financial_year,
      assessmentNumber,
      new Date().toISOString(),
      calculatedAmount,
      arrearsAmount,
      totalAmount,
      "PENDING",
      1,
    ],

    function (err) {
      if (err) {
        return reject(err.message);
      }

      console.log("Assessment Generated:", assessmentNumber);

      callback();
    },
  );
};

module.exports = {
  generateAssessment,
};
