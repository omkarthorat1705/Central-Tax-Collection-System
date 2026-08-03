const db = require("../config/db");

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
  SELECT atm.*
  FROM asset_tax_mapping atm
  WHERE atm.citizen_asset_id = ?
    AND IFNULL(atm.is_deleted,0)=0
  `,
          [asset.id],

          (err, taxes) => {
            if (err) {
              return reject(err.message);
            }

            if (!taxes.length) {
              return reject("No taxes mapped to asset");
            }

            let completed = 0;
            const generatedAssessments = [];

            taxes.forEach((tax) => {
              processTaxAssessment(
                asset,
                tax,
                financial_year,
                () => {
                  generatedAssessments.push(arguments[0]);

                  completed++;

                  if (completed === taxes.length) {
                    resolve({
                      success: true,
                      asset_id,
                      financial_year,
                      assessments: generatedAssessments,
                      assessment_number,
                      assessment_id: this.lastID,
                    });
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
    apv.parameter_value,
    p.parameter_code,
    p.parameter_type,
    p.ui_component
FROM asset_parameter_values apv
INNER JOIN parameters p
        ON p.id = apv.parameter_id
WHERE apv.citizen_asset_id = ?
  AND IFNULL(apv.is_deleted,0)=0
  AND IFNULL(p.is_deleted,0)=0
ORDER BY p.display_order;
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
  FROM rules
  WHERE tax_type_id = ?
    AND tenant_id = ?
    AND is_active = 1
    AND is_deleted = 0
  ORDER BY priority ASC
  LIMIT 1
  `,
        [tax.tax_type_id, asset.tenant_id],

        (err, rule) => {
          if (err) {
            return reject(err.message);
          }

          if (!rule) {
            return createAssessment(
              asset,
              tax,
              financial_year,
              0,
              0,
              0,
              callback,
              reject,
            );
          }

          // =====================================
          // CALCULATE TAX
          // =====================================

          let calculatedAmount;

          try {
            calculatedAmount = calculateTax(parameterMap, rule);
          } catch (err) {
            return reject(err.message);
          }

          // =====================================
          // GET PREVIOUS DUES
          // =====================================

          db.get(
            `
            SELECT
IFNULL(
SUM(
CASE
WHEN assessment_status!='PAID'
THEN total_amount
ELSE 0
END
),
0
) AS pending_amount
FROM tax_assessments
WHERE asset_id=?
AND tenant_id=?
            `,
            [asset.id, asset.tenant_id],

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
  const area = parseFloat(parameterMap.AREA);

  if (Number.isNaN(area)) {
    throw new Error("AREA parameter missing for assessment");
  }

  const rate = parseFloat(rule.calculation_value || 0);

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
      asset.tenant_id,
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

      callback({
        assessment_number: assessmentNumber,
        asset_id: asset.id,
        tax_type_id: tax.tax_type_id,
        total_amount: totalAmount,
      });
    },
  );
};

module.exports = {
  generateAssessment,
};
