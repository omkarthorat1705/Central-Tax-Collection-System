const db = require("../config/db");

// =========================================
// APPLY PENALTIES
// =========================================

const applyPenalties = async () => {
  console.log("Running penalty engine...");

  db.all(
    `
    SELECT *

    FROM tax_assessments

    WHERE assessment_status != 'PAID'
    `,
    [],

    (err, assessments) => {
      if (err) {
        console.log(err);
        return;
      }

      assessments.forEach((assessment) => {
        processAssessmentPenalty(assessment);
      });
    },
  );
};

// =========================================
// PROCESS ASSESSMENT
// =========================================

const processAssessmentPenalty = (assessment) => {
  db.get(
    `
    SELECT *
    FROM penalty_configurations
    WHERE is_active = 1
    LIMIT 1
    `,
    [],

    (err, config) => {
      if (err || !config) {
        return;
      }

      calculatePenalty(assessment, config);
    },
  );
};

// =========================================
// CALCULATE PENALTY
// =========================================

const calculatePenalty = (assessment, config) => {
  const assessmentDate = new Date(assessment.assessment_date);

  const today = new Date();

  const diffDays = Math.floor((today - assessmentDate) / (1000 * 60 * 60 * 24));

  // =====================================
  // GRACE CHECK
  // =====================================

  if (diffDays <= config.grace_days) {
    return;
  }

  // =====================================
  // CHECK EXISTING PENALTY
  // =====================================

  db.get(
    `
    SELECT COUNT(*) AS total

    FROM assessment_penalties

    WHERE assessment_id = ?
    `,
    [assessment.id],

    (err, row) => {
      if (row.total > 0) {
        return;
      }

      generatePenalty(assessment, config);
    },
  );
};

// =========================================
// GENERATE PENALTY
// =========================================

const generatePenalty = (assessment, config) => {
  let penaltyAmount = 0;

  if (config.penalty_type === "PERCENTAGE") {
    penaltyAmount =
      (Number(assessment.total_amount) * Number(config.penalty_value)) / 100;
  } else {
    penaltyAmount = Number(config.penalty_value);
  }

  // =====================================
  // MAX LIMIT
  // =====================================

  if (penaltyAmount > Number(config.max_penalty_amount)) {
    penaltyAmount = Number(config.max_penalty_amount);
  }

  db.run(
    `
    INSERT INTO assessment_penalties (

      tenant_id,
      assessment_id,
      penalty_configuration_id,
      penalty_amount,
      applied_date,
      remarks

    )

    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      1,
      assessment.id,
      config.id,
      penaltyAmount,
      new Date().toISOString(),
      "Auto penalty generated",
    ],

    (err) => {
      if (err) {
        console.log(err);
        return;
      }

      // =====================================
      // UPDATE ASSESSMENT TOTAL
      // =====================================

      db.run(
        `
        UPDATE tax_assessments

        SET
          total_amount =
            total_amount + ?

        WHERE id = ?
        `,
        [penaltyAmount, assessment.id],
      );

      console.log(`Penalty applied on assessment ${assessment.id}`);
    },
  );
};

module.exports = {
  applyPenalties,
};
