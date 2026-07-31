const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/responseHandler");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/auth");

const citizenLogin = asyncHandler(async (req, res) => {
  const { tenantCode, citizenCode, password } = req.body;

  if (!tenantCode || !citizenCode || !password) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  const citizen = await new Promise((resolve, reject) => {
    db.get(
      `SELECT c.*, t.tenant_code, t.tenant_name
       FROM citizens c
       LEFT JOIN tenants t ON t.id = c.tenant_id
       WHERE c.citizen_code = ? AND t.tenant_code = ? AND c.is_deleted = 0`,
      [citizenCode, tenantCode],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });

  if (!citizen) {
    return res.status(401).json({ success: false, error: "Invalid citizen credentials" });
  }

  const storedPassword = citizen.portal_password_hash || "";
  const passwordMatch = storedPassword ? await bcrypt.compare(password, storedPassword) : false;

  if (!passwordMatch) {
    return res.status(401).json({ success: false, error: "Invalid citizen credentials" });
  }

  const token = jwt.sign(
    {
      citizen_id: citizen.id,
      tenant_id: citizen.tenant_id,
      citizen_code: citizen.citizen_code,
      userType: "citizen",
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  return successResponse(res, {
    token,
    citizen: {
      id: citizen.id,
      citizen_code: citizen.citizen_code,
      full_name: citizen.full_name,
      tenant_code: citizen.tenant_code,
      tenant_name: citizen.tenant_name,
    },
  });
});

const getCitizenPortalSummary = asyncHandler(async (req, res) => {
  const citizenId = req.citizen.citizen_id;
  const tenantId = req.citizen.tenant_id;

  const assessments = await new Promise((resolve, reject) => {
    db.all(
      `SELECT ta.id, ta.assessment_number, ta.financial_year, ta.total_amount, ta.assessment_status, ta.assessment_date,
              tt.tax_name
       FROM tax_assessments ta
       LEFT JOIN tax_types tt ON tt.id = ta.tax_type_id AND tt.tenant_id = ta.tenant_id
       WHERE ta.citizen_id = ? AND ta.tenant_id = ? AND ta.is_deleted = 0
       ORDER BY ta.created_at DESC`,
      [citizenId, tenantId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      },
    );
  });

  const payments = await new Promise((resolve, reject) => {
    db.all(
      `SELECT tp.id, tp.payment_number, tp.payment_amount, tp.payment_mode, tp.created_at, tp.assessment_id
       FROM tax_payments tp
       WHERE tp.tenant_id = ? AND tp.created_by = ?`,
      [tenantId, citizenId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      },
    );
  });

  return successResponse(res, {
    assessments,
    payments,
  });
});

module.exports = {
  citizenLogin,
  getCitizenPortalSummary,
};
