const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const db = require("./src/config/db");

const initializeDatabase = async () => {
  const runSql = (sql) =>
    new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

  const tableInfo = (tableName) =>
    new Promise((resolve, reject) => {
      db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

  const ensureColumn = async (tableName, columnName, columnDefinition) => {
    const columns = await tableInfo(tableName);
    if (columns.some((column) => column.name === columnName)) {
      return;
    }

    await runSql(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
  };

  const schemaSql = [
    fs.readFileSync(path.join(__dirname, "enterprise_schema.sql"), "utf8"),
    `
      CREATE TABLE IF NOT EXISTS citizen_portal_credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        citizen_id INTEGER UNIQUE,
        password_hash TEXT,
        is_password_changed INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS asset_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        asset_type_code TEXT,
        asset_type_name TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS citizen_assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        citizen_id INTEGER,
        asset_code TEXT,
        asset_type TEXT,
        asset_name TEXT,
        asset_address TEXT,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS asset_tax_mapping (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        citizen_asset_id INTEGER,
        tax_type_id INTEGER,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS asset_parameter_values (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        citizen_asset_id INTEGER,
        parameter_id INTEGER,
        parameter_value TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tax_assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        citizen_id INTEGER,
        asset_id INTEGER,
        tax_type_id INTEGER,
        financial_year TEXT,
        assessment_number TEXT,
        assessment_date TEXT,
        calculated_amount REAL DEFAULT 0,
        arrears_amount REAL DEFAULT 0,
        penalty_amount REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        generated_by INTEGER,
        assessment_status TEXT,
        outstanding_amount REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tax_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        assessment_id INTEGER,
        payment_number TEXT,
        payment_date TEXT,
        payment_amount REAL DEFAULT 0,
        payment_mode TEXT,
        collected_by INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS financial_years (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        financial_year TEXT,
        start_date TEXT,
        end_date TEXT,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tax_demands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        assessment_id INTEGER,
        demand_number TEXT,
        demand_amount REAL DEFAULT 0,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS assessment_audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        assessment_id INTEGER,
        action_type TEXT,
        action_details TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      );
    `,
  ].join("\n");

  await runSql(schemaSql);

  await ensureColumn("asset_types", "description", "TEXT");
  await ensureColumn("users", "username", "TEXT");
  await ensureColumn("users", "status", "TEXT");
  await ensureColumn("tax_types", "description", "TEXT");
  await ensureColumn("tax_types", "created_by", "INTEGER");
  await ensureColumn("tax_types", "is_active", "INTEGER DEFAULT 1");
  await ensureColumn("parameters", "validation_rules", "TEXT");
  await ensureColumn("parameters", "possible_values", "TEXT");
  await ensureColumn("parameters", "parameter_type", "TEXT");
  await ensureColumn("parameters", "ui_component", "TEXT");
  await ensureColumn("parameters", "required_flag", "INTEGER DEFAULT 0");
  await ensureColumn("parameters", "is_required", "INTEGER DEFAULT 0");
  await ensureColumn("parameters", "display_order", "INTEGER");
  await ensureColumn("parameters", "asset_type", "TEXT");
  await ensureColumn("parameters", "status", "TEXT DEFAULT 'ACTIVE'");
  await ensureColumn("parameters", "created_by", "INTEGER");
  await ensureColumn("rules", "output_value", "TEXT");
  await ensureColumn("citizens", "portal_enabled", "INTEGER DEFAULT 0");
  await ensureColumn("citizens", "citizen_status", "TEXT");
  await ensureColumn("citizens", "citizen_type", "TEXT");
  await ensureColumn("citizens", "verification_status", "TEXT");
  await ensureColumn("citizens", "address", "TEXT");
  await ensureColumn("citizens", "mobile_number", "TEXT");
};

app.use(cors());
app.use(express.json());
const authMiddleware = require("./src/middleware/authMiddleware");
const tenantMiddleware = require("./src/middleware/tenantMiddleware");
// =====================================
// ROUTES
// =====================================
const authRoutes = require("./src/routes/authRoutes");
const tenantRoutes = require("./src/routes/tenantRoutes");
const citizenRoutes = require("./src/routes/citizenRoutes");
const assetRoutes = require("./src/routes/assetRoutes");
const assessmentRoutes = require("./src/routes/assessmentRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const taxTypeRoutes = require("./src/routes/taxTypeRoutes");
const parameterRoutes = require("./src/routes/parameterRoutes");
const ruleRoutes = require("./src/routes/ruleRoutes");
const financialYearRoutes = require("./src/routes/financialYearRoutes");
const assessmentLifecycleRoutes = require("./src/routes/assessmentLifecycleRoutes");
// const lifecycleRoutes = require("./src/routes/lifecycleRoutes");
const { applyPenalties } = require("./src/engines/penaltyEngine");
const lifecycleService = require("./src/services/assessmentLifecycleService");

const demandRoutes = require("./src/routes/demandRoutes");
const citizenPortalRoutes = require("./src/routes/citizenPortalRoutes");
const { ensureSeedData } = require("./src/utils/seedData");

// =====================================
// ROUTE REGISTRATION
// =====================================

app.use("/", authRoutes);
app.use("/", tenantRoutes);

/*
 * Public Citizen Portal routes.
 * Login is public.
 * Other citizen APIs are protected by citizenAuthMiddleware
 * inside citizenPortalRoutes.js itself.
 */
app.use("/", citizenPortalRoutes);

/*
 * Admin APIs
 */
app.use(authMiddleware);
app.use(tenantMiddleware);

app.use("/", citizenRoutes);
app.use("/assets", assetRoutes);
app.use("/", assessmentRoutes);
app.use("/", paymentRoutes);
app.use("/", dashboardRoutes);
app.use("/", taxTypeRoutes);
app.use("/", parameterRoutes);
app.use("/", ruleRoutes);
app.use("/", financialYearRoutes);
app.use("/", assessmentLifecycleRoutes);
app.use("/", demandRoutes);
// app.use("/", lifecycleRoutes);

// cron.schedule("0 0 * * *", async () => {
//   console.log("Running overdue lifecycle engine...");

//   await lifecycleService.markAssessmentOverdue();
// });

// =====================================
// ROOT
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Enterprise Revenue Platform Running",
  });
});

// =====================================
// SCHEDULER
// =====================================

require("./src/scheduler/yearlyScheduler");

// =====================================
// MIDDLEWARE
// =====================================

const errorMiddleware = require("./src/middleware/errorMiddleware");

app.use(errorMiddleware);

// =====================================
// SERVER
// =====================================

const PORT = 5000;

(async () => {
  try {
    await initializeDatabase();
    await ensureSeedData();
    console.log("Seed data initialized");
  } catch (error) {
    console.log("Database initialization failed", error);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
