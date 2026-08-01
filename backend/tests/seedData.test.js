const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

test('ensureSeedData creates starter records for a fresh database', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ctcs-seed-'));
  const tempDbPath = path.join(tempDir, 'database.db');
  process.env.DB_PATH = tempDbPath;

  delete require.cache[require.resolve('../src/config/db')];
  delete require.cache[require.resolve('../src/utils/seedData')];

  const db = require('../src/config/db');
  const { ensureSeedData } = require('../src/utils/seedData');

  await new Promise((resolve, reject) => {
    db.exec(`
      CREATE TABLE tenants (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_code TEXT, tenant_name TEXT, tenant_type TEXT, is_deleted INTEGER DEFAULT 0);
      CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id INTEGER, full_name TEXT, email TEXT, password_hash TEXT, role TEXT, username TEXT, status TEXT, is_deleted INTEGER DEFAULT 0);
      CREATE TABLE tax_types (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id INTEGER, tax_code TEXT, tax_name TEXT, description TEXT, is_active INTEGER DEFAULT 1, created_by INTEGER, is_deleted INTEGER DEFAULT 0);
      CREATE TABLE parameters (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id INTEGER, tax_type_id INTEGER, parameter_code TEXT, parameter_name TEXT, parameter_type TEXT, ui_component TEXT, validation_rules TEXT, possible_values TEXT, is_required INTEGER DEFAULT 0, display_order INTEGER, created_by INTEGER, is_deleted INTEGER DEFAULT 0);
      CREATE TABLE citizens (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id INTEGER, citizen_code TEXT, full_name TEXT, mobile_number TEXT, email TEXT, address TEXT, citizen_status TEXT, citizen_type TEXT, verification_status TEXT, portal_enabled INTEGER DEFAULT 0, is_deleted INTEGER DEFAULT 0);
      CREATE TABLE citizen_portal_credentials (id INTEGER PRIMARY KEY AUTOINCREMENT, citizen_id INTEGER UNIQUE, password_hash TEXT, is_password_changed INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE asset_types (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id INTEGER, asset_type_code TEXT, asset_type_name TEXT, description TEXT, is_deleted INTEGER DEFAULT 0);
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  await ensureSeedData();

  const tenant = await new Promise((resolve, reject) => {
    db.get('SELECT id FROM tenants WHERE tenant_code = ?', ['CTCS'], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  assert.ok(tenant, 'tenant should be created');

  const taxType = await new Promise((resolve, reject) => {
    db.get('SELECT id FROM tax_types WHERE tax_code = ?', ['PROP'], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  const citizen = await new Promise((resolve, reject) => {
    db.get('SELECT id FROM citizens WHERE citizen_code = ?', ['CTCS-CIT-000001'], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  assert.ok(taxType, 'tax type should be created');
  assert.ok(citizen, 'citizen should be created');

  db.close();
});
