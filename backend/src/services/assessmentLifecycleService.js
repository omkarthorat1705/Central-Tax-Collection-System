const db = require("../config/db");

const assessmentAuditRepository = require("../repositories/assessmentAuditRepository");

const markAssessmentOverdue = async () => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE tax_assessments

      SET assessment_status = 'OVERDUE'

      WHERE due_date < date('now')

      AND assessment_status IN ('GENERATED', 'PARTIAL')
      `,
      async function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      },
    );
  });
};

const freezeAssessment = async (assessmentId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT *
      FROM tax_assessments
      WHERE id = ?
      `,
      [assessmentId],
      async (err, assessment) => {
        if (err || !assessment) {
          reject("Assessment not found");
          return;
        }

        db.run(
          `
          UPDATE tax_assessments
          SET assessment_status = 'FROZEN'
          WHERE id = ?
          `,
          [assessmentId],
          async function (updateError) {
            if (updateError) {
              reject(updateError);
              return;
            }

            await assessmentAuditRepository.createAuditLog(
              assessmentId,
              "FREEZE",
              assessment.assessment_status,
              "FROZEN",
              "Assessment frozen",
            );

            resolve(true);
          },
        );
      },
    );
  });
};

module.exports = {
  markAssessmentOverdue,
  freezeAssessment,
};
