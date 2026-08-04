const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/responseHandler");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/auth");

const citizenLogin = asyncHandler(async (req, res) => {
  const { tenantCode, citizenCode, password } = req.body;

  if (!tenantCode || !citizenCode || !password) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
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
    return res
      .status(401)
      .json({ success: false, error: "Invalid citizen credentials" });
  }

  const portalCredential = await new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM citizen_portal_credentials WHERE citizen_id = ?",
      [citizen.id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });

  const storedPassword = portalCredential?.password_hash || "";
  const passwordMatch = storedPassword
    ? await bcrypt.compare(password, storedPassword)
    : false;

  if (!passwordMatch) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid citizen credentials" });
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

const changeCitizenPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const citizenId = req.citizen.citizen_id;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Both current and new password are required",
      });
  }

  const citizen = await new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM citizens WHERE id = ? AND is_deleted = 0",
      [citizenId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });

  const portalCredential = await new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM citizen_portal_credentials WHERE citizen_id = ?",
      [citizenId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });

  if (!citizen || !portalCredential?.password_hash) {
    return res
      .status(400)
      .json({ success: false, error: "Portal password is not configured" });
  }

  const passwordMatch = await bcrypt.compare(
    currentPassword,
    portalCredential.password_hash,
  );
  if (!passwordMatch) {
    return res
      .status(401)
      .json({ success: false, error: "Current password is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await new Promise((resolve, reject) => {
    db.run(
      "UPDATE citizen_portal_credentials SET password_hash = ?, is_password_changed = 1, updated_at = CURRENT_TIMESTAMP WHERE citizen_id = ?",
      [hashedPassword, citizenId],
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });

  return successResponse(
    res,
    { changed: true },
    "Password updated successfully",
  );
});

const makeCitizenPayment = asyncHandler(async (req, res) => {
  const { assessment_id, payment_amount, payment_mode } = req.body;
  const tenantId = req.citizen.tenant_id;

  const assessment = await new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM tax_assessments WHERE id = ? AND tenant_id = ? AND is_deleted = 0",
      [assessment_id, tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });

  if (!assessment || assessment.citizen_id !== req.citizen.citizen_id) {
    return res
      .status(404)
      .json({ success: false, error: "Assessment not found" });
  }

  const totalPaid = await new Promise((resolve, reject) => {
    db.get(
      "SELECT IFNULL(SUM(payment_amount), 0) AS total_paid FROM tax_payments WHERE assessment_id = ? AND tenant_id = ?",
      [assessment_id, tenantId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row?.total_paid || 0);
      },
    );
  });

  const remaining = Number(assessment.total_amount) - Number(totalPaid);
  if (Number(payment_amount) > remaining) {
    return res
      .status(400)
      .json({ success: false, error: "Payment exceeds remaining balance" });
  }

  const paymentNumber = `CIT-` + Date.now();
  const paymentId = await new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO tax_payments (tenant_id, assessment_id, payment_number, payment_date, payment_amount, payment_mode, collected_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        tenantId,
        assessment_id,
        paymentNumber,
        new Date().toISOString(),
        payment_amount,
        payment_mode,
        req.citizen.citizen_id,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });

  const updatedPaid = Number(totalPaid) + Number(payment_amount);
  const newStatus =
    updatedPaid >= Number(assessment.total_amount) ? "PAID" : "PARTIAL";

  await new Promise((resolve, reject) => {
    db.run(
      "UPDATE tax_assessments SET assessment_status = ? WHERE id = ? AND tenant_id = ?",
      [newStatus, assessment_id, tenantId],
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });

  return successResponse(
    res,
    {
      payment_id: paymentId,
      payment_number: paymentNumber,
      assessment_status: newStatus,
    },
    "Payment recorded successfully",
  );
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
      `
    SELECT
      tp.id,
      tp.payment_number,
      tp.payment_amount,
      tp.payment_mode,
      tp.payment_date,
      tp.assessment_id
    FROM tax_payments tp
    WHERE tp.tenant_id = ?
      AND tp.collected_by = ?
    ORDER BY tp.payment_date DESC
    `,
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
  changeCitizenPassword,
  makeCitizenPayment,
  getCitizenPortalSummary,
};
