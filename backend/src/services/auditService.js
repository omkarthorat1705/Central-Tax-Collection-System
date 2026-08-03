const db = require("../config/db");

const createAuditLog = ({
  tenant_id = 1,
  entity_name,
  entity_id,
  action_type,
  old_value = null,
  new_value = null,
  action_by = 1,
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
            INSERT INTO audit_logs
            (
                tenant_id,
                entity_name,
                entity_id,
                action_type,
                old_value,
                new_value,
                action_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
      [
        tenant_id,
        entity_name,
        entity_id,
        action_type,
        typeof old_value === "string"
          ? old_value
          : old_value
            ? JSON.stringify(old_value)
            : null,
        typeof new_value === "string"
          ? new_value
          : new_value
            ? JSON.stringify(new_value)
            : null,
        action_by,
      ],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      },
    );
  });
};

module.exports = {
  createAuditLog,
};
