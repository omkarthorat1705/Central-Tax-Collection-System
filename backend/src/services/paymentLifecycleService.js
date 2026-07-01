const db = require("../config/db");

const calculateAssessmentOutstanding = (assessmentId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        total_amount
      FROM tax_assessments
      WHERE id = ?
      `,
      [assessmentId],
      (err, assessment) => {
        if (err) {
          reject(err);
          return;
        }

        db.get(
          `
          SELECT

            IFNULL(
              SUM(payment_amount),
              0
            ) AS total_paid

          FROM tax_payments

          WHERE assessment_id = ?
          `,
          [assessmentId],
          (err2, payments) => {
            if (err2) {
              reject(err2);
              return;
            }

            const totalAmount = Number(assessment?.total_amount || 0);

            const totalPaid = Number(payments?.total_paid || 0);

            const pendingAmount = totalAmount - totalPaid;

            resolve({
              total_amount: totalAmount,
              paid_amount: totalPaid,
              pending_amount: pendingAmount,
            });
          },
        );
      },
    );
  });
};

module.exports = {
  calculateAssessmentOutstanding,
};
