const db = require("../config/db");

const createAuditLog = (
  assessmentId,
  actionType,
  oldStatus,
  newStatus,
  remarks,
) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO assessment_audit_logs (

        tenant_id,

        assessment_id,

        action_type,

        old_status,

        new_status,

        remarks,

        action_by

      )

      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [1, assessmentId, actionType, oldStatus, newStatus, remarks, 1],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

module.exports = {
  createAuditLog,
};
