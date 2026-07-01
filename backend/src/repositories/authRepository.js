const db = require("../config/db");

const getUserForLogin = (authorityCode, username) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        u.*,
        t.tenant_name,
        t.tenant_code
      FROM users u
      INNER JOIN tenants t
      ON t.id = u.tenant_id
      WHERE
      u.username = ?
      AND t.tenant_code = ?
      AND u.is_deleted = 0
      AND u.status = 'ACTIVE'
      `,
      [username, authorityCode],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
};

module.exports = {
  getUserForLogin,
};
