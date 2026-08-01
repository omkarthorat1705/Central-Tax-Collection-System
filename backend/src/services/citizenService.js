const bcrypt = require("bcryptjs");
const db = require("../config/db");
const citizenRepository = require("../repositories/citizenRepository");

const { encryptValue, decryptValue } = require("../utils/encryptionUtil");

const addCitizen = async (payload) => {
  const tenant = await citizenRepository.getTenantById(payload.tenant_id);

  const count = await citizenRepository.getCitizenCount(payload.tenant_id);

  const nextNumber = String(count + 1).padStart(6, "0");

  payload.citizen_code = `${tenant.tenant_code}-CIT-${nextNumber}`;

  if (payload.aadhaar_number) {
    payload.aadhaar_number = encryptValue(payload.aadhaar_number);
  }

  if (payload.pan_number) {
    payload.pan_number = encryptValue(payload.pan_number);
  }

  payload.citizen_status = payload.citizen_status || "ACTIVE";

  payload.citizen_type = payload.citizen_type || "INDIVIDUAL";

  payload.verification_status = payload.verification_status || "PENDING";

  payload.portal_enabled = payload.portal_enabled || 0;

  payload.communication_sms = payload.communication_sms ?? 1;

  payload.communication_email = payload.communication_email ?? 1;

  payload.communication_whatsapp = payload.communication_whatsapp ?? 0;

  payload.communication_post = payload.communication_post ?? 0;

  payload.is_deleted = 0;

  const id = await citizenRepository.createCitizen(payload);

  const temporaryPassword = `${payload.citizen_code}`;
  const passwordHash = await bcrypt.hash(temporaryPassword, 10);

  await new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO citizen_portal_credentials (citizen_id, password_hash, is_password_changed) VALUES (?, ?, ?)",
      [id, passwordHash, 0],
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });

  return {
    id,
    citizen_code: payload.citizen_code,
    temporary_password: temporaryPassword,
  };
};

const getCitizens = async (tenantId) => {
  return await citizenRepository.getCitizens(tenantId);
};

const getCitizenById = async (id, tenantId) => {
  const citizen = await citizenRepository.getCitizenById(id, tenantId);

  if (!citizen) {
    return null;
  }

  if (citizen.aadhaar_number) {
    citizen.aadhaar_number = decryptValue(citizen.aadhaar_number);
  }

  if (citizen.pan_number) {
    citizen.pan_number = decryptValue(citizen.pan_number);
  }

  return citizen;
};

const updateCitizen = async (id, payload, tenantId) => {
  if (payload.aadhaar_number && !String(payload.aadhaar_number).includes(":")) {
    payload.aadhaar_number = encryptValue(payload.aadhaar_number);
  }

  if (payload.pan_number && !String(payload.pan_number).includes(":")) {
    payload.pan_number = encryptValue(payload.pan_number);
  }

  return await citizenRepository.updateCitizen(id, payload, tenantId);
};

const updateCitizenStatus = async (id, status, tenantId) => {
  return await citizenRepository.updateCitizenStatus(id, status, tenantId);
};

module.exports = {
  addCitizen,
  getCitizens,
  getCitizenById,
  updateCitizen,
  updateCitizenStatus,
};
