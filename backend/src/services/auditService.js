const db = require("../config/db");

const createAuditLog = async ({
    tenant_id = 1,
    action,
    table_name,
    record_id,
    module_name = null,
    old_values = null,
    new_values = null,
    created_by = 1,
}) => {
    return new Promise((resolve, reject) => {
        db.run(
            `
            INSERT INTO audit_logs
            (
                tenant_id,
                action,
                table_name,
                record_id,
                module_name,
                old_values,
                new_values,
                created_by
            )
            VALUES (?,?,?,?,?,?,?,?)
            `,
            [
                tenant_id,
                action,
                table_name,
                record_id,
                module_name,
                old_values ? JSON.stringify(old_values) : null,
                new_values ? JSON.stringify(new_values) : null,
                created_by,
            ],
            function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            }
        );
    });
};

module.exports = {
    createAuditLog,
};

