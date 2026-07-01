const db = require("../config/db");

// =====================================
// GET TENANT
// =====================================

const getTenantById = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT *
      FROM tenants
      WHERE id = ?
      `,
      [tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
};

// =====================================
// GET CITIZEN COUNT
// =====================================

const getCitizenCount = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT COUNT(*) AS total
      FROM citizens
      WHERE tenant_id = ?
      `,
      [tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row.total || 0);
      },
    );
  });
};

// =====================================
// CREATE CITIZEN
// =====================================

const createCitizen = (payload) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
INSERT INTO citizens (


    tenant_id,
    citizen_code,

    full_name,
    mobile_number,
    alternate_mobile,
    email,

    aadhaar_number,
    pan_number,

    gender,
    date_of_birth,
    occupation,

    citizen_type,
    verification_status,

    citizen_status,
    status_reason,

    portal_enabled,

    communication_sms,
    communication_email,
    communication_whatsapp,
    communication_post,

    address,
    address_line_1,
    address_line_2,
    locality,
    landmark,

    ward_number,
    zone_name,

    city,
    state,
    pincode,

    emergency_contact_name,
    emergency_contact_mobile,

    is_deleted

  )

  VALUES (
    ?,?,?,?,?,?,
    ?,?,
    ?,?,?,
    ?,?,
    ?,?,
    ?,
    ?,?,?,?,
    ?,?,?,?,?,
    ?,?,
    ?,?,?,
    ?,?,
    ?
  )
  `,
      [
        payload.tenant_id,
        payload.citizen_code,

        payload.full_name,
        payload.mobile_number,
        payload.alternate_mobile,
        payload.email,

        payload.aadhaar_number,
        payload.pan_number,

        payload.gender,
        payload.date_of_birth,
        payload.occupation,

        payload.citizen_type,
        payload.verification_status,

        payload.citizen_status,
        payload.status_reason,

        payload.portal_enabled,

        payload.communication_sms,
        payload.communication_email,
        payload.communication_whatsapp,
        payload.communication_post,

        payload.address,
        payload.address_line_1,
        payload.address_line_2,
        payload.locality,
        payload.landmark,

        payload.ward_number,
        payload.zone_name,

        payload.city,
        payload.state,
        payload.pincode,

        payload.emergency_contact_name,
        payload.emergency_contact_mobile,

        payload.is_deleted,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

// =====================================
// GET CITIZENS
// =====================================

const getCitizens = (tenantId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM citizens
      WHERE tenant_id = ?
      AND is_deleted = 0
      ORDER BY id DESC
      `,
      [tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
};

const getCitizenById = (id, tenantId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT *
        FROM citizens
        WHERE id = ?
        AND tenant_id = ?
        `,
      [id, tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
};

const updateCitizen = (id, payload, tenantId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE citizens
      SET
        full_name=?,
        mobile_number=?,
        alternate_mobile=?,
        email=?,

        aadhaar_number=?,
        pan_number=?,

        gender=?,
        date_of_birth=?,
        occupation=?,

        address_line_1=?,
        address_line_2=?,
        locality=?,
        landmark=?,

        ward_number=?,
        zone_name=?,

        city=?,
        state=?,
        pincode=?,

        communication_sms=?,
        communication_email=?,
        communication_whatsapp=?,
        communication_post=?,

        emergency_contact_name=?,
        emergency_contact_mobile=?,

        updated_at=CURRENT_TIMESTAMP

      WHERE id=?
      AND tenant_id=?
      `,
      [
        payload.full_name,
        payload.mobile_number,
        payload.alternate_mobile,
        payload.email,

        payload.aadhaar_number,
        payload.pan_number,

        payload.gender,
        payload.date_of_birth,
        payload.occupation,

        payload.address_line_1,
        payload.address_line_2,
        payload.locality,
        payload.landmark,

        payload.ward_number,
        payload.zone_name,

        payload.city,
        payload.state,
        payload.pincode,

        payload.communication_sms,
        payload.communication_email,
        payload.communication_whatsapp,
        payload.communication_post,

        payload.emergency_contact_name,
        payload.emergency_contact_mobile,

        id,
        tenantId,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            updated: true,
          });
        }
      },
    );
  });
};

const updateCitizenStatus = (id, status, tenantId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE citizens
        SET citizen_status=?,
        updated_at=CURRENT_TIMESTAMP
        WHERE id=?
        AND tenant_id=?
        `,
      [status, id, tenantId],
      function (err) {
        if (err) reject(err);
        else
          resolve({
            updated: true,
          });
      },
    );
  });
};

module.exports = {
  getTenantById,
  getCitizenCount,
  createCitizen,
  getCitizens,
  getCitizenById,
  updateCitizen,
  updateCitizenStatus,
};
