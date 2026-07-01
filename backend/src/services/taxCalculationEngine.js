const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");

/**
 * ===========================================
 * DYNAMIC TAX CALCULATION ENGINE
 * ===========================================
 */

const calculateCitizenTax = (citizenTaxRecordId) => {
  return new Promise((resolve, reject) => {
    /**
     * =====================================
     * STEP 1:
     * FETCH CITIZEN RECORD VALUES
     * =====================================
     */

    db.all(
      `
        SELECT

          crv.parameter_value,

          p.parameter_name,

          p.parameter_code

        FROM citizen_record_values crv

        LEFT JOIN parameters p
        ON crv.parameter_id = p.id

        WHERE crv.citizen_tax_record_id = ?
        `,

      [citizenTaxRecordId],

      (err, valuesRows) => {
        if (err) {
          return reject(err);
        }

        /**
         * =====================================
         * CONVERT VALUES INTO OBJECT
         * =====================================
         */

        const runtimeValues = {};

        valuesRows.forEach((item) => {
          runtimeValues[item.parameter_name] = item.parameter_value;
        });

        /**
         * =====================================
         * STEP 2:
         * FETCH TAX RECORD
         * =====================================
         */

        db.get(
          `
            SELECT *
            FROM citizen_tax_records
            WHERE id = ?
            `,

          [citizenTaxRecordId],

          (err, taxRecord) => {
            if (err) {
              return reject(err);
            }

            /**
             * =================================
             * STEP 3:
             * FETCH ACTIVE RULES
             * =================================
             */

            db.all(
              `
                SELECT *
                FROM rules
                WHERE tax_type_id = ?
                AND is_active = 1
                ORDER BY priority ASC
                `,

              [taxRecord.tax_type_id],

              (err, rulesRows) => {
                if (err) {
                  return reject(err);
                }

                /**
                 * =============================
                 * STEP 4:
                 * MATCH RULES
                 * =============================
                 */

                const matchedRules = [];

                const processRule = (index) => {
                  if (index >= rulesRows.length) {
                    return finalizeCalculation(matchedRules);
                  }

                  const currentRule = rulesRows[index];

                  db.all(
                    `
                        SELECT

                          rc.*,

                          p.parameter_name

                        FROM rule_conditions rc

                        LEFT JOIN parameters p
                        ON rc.parameter_id = p.id

                        WHERE rc.rule_id = ?
                        ORDER BY rc.condition_order ASC
                        `,

                    [currentRule.id],

                    (err, conditionRows) => {
                      if (err) {
                        return reject(err);
                      }

                      let isMatched = true;

                      for (const condition of conditionRows) {
                        const actualValue =
                          runtimeValues[condition.parameter_name];

                        const expectedValue = condition.comparison_value;

                        if (String(actualValue) !== String(expectedValue)) {
                          isMatched = false;

                          break;
                        }
                      }

                      if (isMatched) {
                        matchedRules.push(currentRule);
                      }

                      processRule(index + 1);
                    },
                  );
                };

                /**
                 * =============================
                 * FINAL CALCULATION
                 * =============================
                 */

                const finalizeCalculation = (matchedRules) => {
                  if (matchedRules.length === 0) {
                    return resolve({
                      success: false,

                      message: "No matching rules found",

                      calculatedTax: 0,
                    });
                  }

                  /**
                   * TAKE HIGHEST PRIORITY RULE
                   */

                  const selectedRule = matchedRules[0];

                  /**
                   * EXAMPLE:
                   * RATE * AREA
                   */

                  let formula = selectedRule.formula_expression;

                  /**
                   * REPLACE RATE
                   */

                  formula = formula.replaceAll(
                    "RATE",
                    selectedRule.output_value,
                  );

                  /**
                   * REPLACE AREA
                   */

                  Object.keys(runtimeValues).forEach((key) => {
                    formula = formula.replaceAll(
                      key.toUpperCase(),
                      runtimeValues[key],
                    );
                  });

                  /**
                   * SAFE EVALUATION
                   */

                  let calculatedTax = 0;

                  try {
                    calculatedTax = eval(formula);
                  } catch (e) {
                    return reject(e);
                  }

                  resolve({
                    success: true,

                    matchedRule: selectedRule.rule_name,

                    formula,

                    calculatedTax,
                  });
                };

                processRule(0);
              },
            );
          },
        );
      },
    );
  });
};

module.exports = {
  calculateCitizenTax,
};
