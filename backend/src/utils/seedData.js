const db = require("../config/db");
const bcrypt = require("bcryptjs");

const ensureSeedData = async () => {
  const tenantId = 1;

  await new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        full_name TEXT,
        email TEXT,
        password_hash TEXT,
        role TEXT,
        username TEXT,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      )
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  const tenant = await new Promise((resolve, reject) => {
    db.get("SELECT id FROM tenants WHERE id = ?", [tenantId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  if (!tenant) {
    await new Promise((resolve, reject) => {
      db.run("INSERT INTO tenants (id, tenant_code, tenant_name, tenant_type) VALUES (?, ?, ?, ?)", [1, "CTCS", "Central Tax Collection", "MUNICIPAL"], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  const existingAdminUser = await new Promise((resolve, reject) => {
    db.get("SELECT id FROM users WHERE username = ? AND tenant_id = ?", ["admin", tenantId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  if (!existingAdminUser) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await new Promise((resolve, reject) => {
      db.run("INSERT INTO users (tenant_id, full_name, email, password_hash, role, username, status, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [tenantId, "System Administrator", "admin@example.com", passwordHash, "ADMIN", "admin", "ACTIVE", 0], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  const existingTax = await new Promise((resolve, reject) => {
    db.get("SELECT id FROM tax_types WHERE tenant_id = ? AND is_deleted = 0 LIMIT 1", [tenantId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  if (!existingTax) {
    await new Promise((resolve, reject) => {
      db.run("INSERT INTO tax_types (tenant_id, tax_code, tax_name, description, created_by, is_active, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?)", [tenantId, "PROP", "Property Tax", "Municipal property tax", 1, 1, 0], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  const existingAssetType = await new Promise((resolve, reject) => {
    db.get("SELECT id FROM asset_types WHERE tenant_id = ? AND is_deleted = 0 LIMIT 1", [tenantId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  if (!existingAssetType) {
    await new Promise((resolve, reject) => {
      db.run("INSERT INTO asset_types (tenant_id, asset_type_code, asset_type_name, description, is_deleted) VALUES (?, ?, ?, ?, ?)", [tenantId, "RES", "Residential", "Residential property", 0], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  const existingParameter = await new Promise((resolve, reject) => {
    db.get("SELECT id FROM parameters WHERE tenant_id = ? AND is_deleted = 0 LIMIT 1", [tenantId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  if (!existingParameter) {
    const taxType = await new Promise((resolve, reject) => {
      db.get("SELECT id FROM tax_types WHERE tenant_id = ? AND is_deleted = 0 LIMIT 1", [tenantId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (taxType) {
      await new Promise((resolve, reject) => {
        db.run("INSERT INTO parameters (tenant_id, tax_type_id, parameter_code, parameter_name, parameter_type, ui_component, validation_rules, possible_values, is_required, display_order, created_by, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [tenantId, taxType.id, "AREA", "Built-up Area", "number", "TEXTFIELD", null, null, 1, 1, 1, 0], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }

  const existingCitizen = await new Promise((resolve, reject) => {
    db.get("SELECT id FROM citizens WHERE tenant_id = ? AND is_deleted = 0 LIMIT 1", [tenantId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  if (!existingCitizen) {
    const citizenCode = "CTCS-CIT-000001";
    const passwordHash = await bcrypt.hash(citizenCode, 10);

    const citizenId = await new Promise((resolve, reject) => {
      db.run("INSERT INTO citizens (tenant_id, citizen_code, full_name, mobile_number, email, address, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?)", [tenantId, citizenCode, "Demo Citizen", "9999999999", "citizen@example.com", "Demo Address", 0], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });

    await new Promise((resolve, reject) => {
      db.run("INSERT INTO citizen_portal_credentials (citizen_id, password_hash, is_password_changed) VALUES (?, ?, ?)", [citizenId, passwordHash, 0], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  const existingAsset = await new Promise((resolve, reject) => {
    db.get("SELECT id FROM citizen_assets WHERE tenant_id = ? AND is_deleted = 0 LIMIT 1", [tenantId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  if (!existingAsset) {
    const assetType = await new Promise((resolve, reject) => {
      db.get("SELECT id FROM asset_types WHERE tenant_id = ? AND is_deleted = 0 LIMIT 1", [tenantId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const citizen = await new Promise((resolve, reject) => {
      db.get("SELECT id FROM citizens WHERE tenant_id = ? AND is_deleted = 0 LIMIT 1", [tenantId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const taxType = await new Promise((resolve, reject) => {
      db.get("SELECT id FROM tax_types WHERE tenant_id = ? AND is_deleted = 0 LIMIT 1", [tenantId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (citizen && taxType) {
      const assetId = await new Promise((resolve, reject) => {
        db.run("INSERT INTO citizen_assets (tenant_id, citizen_id, asset_code, asset_type, asset_name, asset_address, status, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [tenantId, citizen.id, "ASSET-001", assetType ? "Residential" : "RESIDENTIAL", "Demo Residential Property", "123 Demo Street", "ACTIVE", 0], function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });

      await new Promise((resolve, reject) => {
        db.run("INSERT INTO asset_tax_mapping (tenant_id, citizen_asset_id, tax_type_id, status, is_deleted) VALUES (?, ?, ?, ?, ?)", [tenantId, assetId, taxType.id, "ACTIVE", 0], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const existingAssessment = await new Promise((resolve, reject) => {
        db.get("SELECT id FROM tax_assessments WHERE tenant_id = ? AND asset_id = ? LIMIT 1", [tenantId, assetId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!existingAssessment) {
        await new Promise((resolve, reject) => {
          db.run("INSERT INTO tax_assessments (tenant_id, citizen_id, asset_id, tax_type_id, financial_year, assessment_number, assessment_date, calculated_amount, arrears_amount, penalty_amount, total_amount, generated_by, assessment_status, outstanding_amount, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [tenantId, citizen.id, assetId, taxType.id, "2026-2027", "ASM-001", new Date().toISOString(), 1200, 0, 0, 1200, 1, "GENERATED", 1200, 0], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }
  }
};

module.exports = {
  ensureSeedData,
};
