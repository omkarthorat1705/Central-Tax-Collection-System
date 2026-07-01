const db = require("../config/db");

const { calculateAssessmentOutstanding } = require("../lifecycle/paymentLifecycle");

const { calculatePenalty } = require("./penaltyEngine");

const { createAuditLog } = require("../services/auditService");

const generateArrears = async () => {
  try {
    console.log("Running arrears engine...");

    db.all(
      `
      SELECT *
      FROM tax_assessments
      WHERE assessment_status != 'PAID'
      `,
      [],
      async (err, assessments) => {
        if (err) {
          console.log(err);
          return;
        }

        for (const assessment of assessments) {
          try {
            const outstanding = await calculateAssessmentOutstanding(
              assessment.id,
            );

            const pendingAmount = Number(outstanding.pending_amount || 0);

            if (pendingAmount <= 0) {
              continue;
            }

            const penaltyAmount = await calculatePenalty(pendingAmount);

            const finalArrears = pendingAmount + penaltyAmount;

            db.run(
              `
              UPDATE tax_assessments

              SET

                arrears_amount = ?,

                penalty_amount = ?,

                assessment_status = ?

              WHERE id = ?
              `,
              [finalArrears, penaltyAmount, "ARREARS", assessment.id],
            );

            await createAuditLog(
              "ARREARS",

              "ASSESSMENT",

              assessment.id,

              "ARREARS_GENERATED",

              {
                pending_amount: pendingAmount,

                penalty_amount: penaltyAmount,

                final_arrears: finalArrears,
              },
            );

            console.log(`Assessment ${assessment.id} moved to arrears`);
          } catch (innerError) {
            console.log(innerError);
          }
        }
      },
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateArrears,
};
