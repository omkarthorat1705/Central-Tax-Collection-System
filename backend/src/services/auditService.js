const db = require("../config/db");

const createAuditLog = (
  moduleName,
  entityType,
  entityId,
  actionType,
  actionDetails,
  performedBy = 1,
) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO audit_logs (

        tenant_id,

        module_name,

        entity_type,

        entity_id,

        action_type,

        action_details,

        performed_by

      )

      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        1,

        moduleName,

        entityType,

        entityId,

        actionType,

        JSON.stringify(actionDetails),

        performedBy,
      ],
      function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.lastID);
      },
    );
  });
};

module.exports = {
  createAuditLog,
};
