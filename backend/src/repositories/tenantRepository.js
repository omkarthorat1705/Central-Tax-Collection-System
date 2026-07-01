const db = require("../config/db");

const getAuthorities = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        id,
        tenant_code,
        tenant_name
      FROM tenants
      WHERE is_deleted = 0
      ORDER BY tenant_name
      `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

module.exports = {
  getAuthorities,
};