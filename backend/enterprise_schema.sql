PRAGMA foreign_keys = ON;

-- =====================================================
-- TENANTS
-- =====================================================

CREATE TABLE IF NOT EXISTS tenants (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tenant_code TEXT UNIQUE,

    tenant_name TEXT NOT NULL,

    tenant_type TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    is_deleted INTEGER DEFAULT 0
);

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tenant_id INTEGER,

    full_name TEXT,

    email TEXT UNIQUE,

    password_hash TEXT,

    role TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    is_deleted INTEGER DEFAULT 0,

    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
);

-- =====================================================
-- TAX TYPES
-- =====================================================

CREATE TABLE IF NOT EXISTS tax_types (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tenant_id INTEGER,

    tax_code TEXT,

    tax_name TEXT,

    description TEXT,

    is_active INTEGER DEFAULT 1,

    created_by INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    is_deleted INTEGER DEFAULT 0,

    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id),

    FOREIGN KEY (created_by)
    REFERENCES users(id)
);

-- =====================================================
-- PARAMETERS
-- =====================================================

CREATE TABLE IF NOT EXISTS parameters (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tenant_id INTEGER,

    tax_type_id INTEGER,

    parameter_code TEXT,

    parameter_name TEXT,

    parameter_type TEXT,

    ui_component TEXT,

    validation_rules TEXT,

    possible_values TEXT,

    is_required INTEGER DEFAULT 0,

    display_order INTEGER,

    created_by INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    is_deleted INTEGER DEFAULT 0,

    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id),

    FOREIGN KEY (tax_type_id)
    REFERENCES tax_types(id),

    FOREIGN KEY (created_by)
    REFERENCES users(id)
);

-- =====================================================
-- RULES
-- =====================================================

CREATE TABLE IF NOT EXISTS rules (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tenant_id INTEGER,

    tax_type_id INTEGER,

    rule_code TEXT,

    rule_name TEXT,

    formula_expression TEXT,

    priority INTEGER DEFAULT 1,

    is_active INTEGER DEFAULT 1,

    created_by INTEGER,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    is_deleted INTEGER DEFAULT 0,

    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id),

    FOREIGN KEY (tax_type_id)
    REFERENCES tax_types(id),

    FOREIGN KEY (created_by)
    REFERENCES users(id)
);

-- =====================================================
-- RULE CONDITIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS rule_conditions (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tenant_id INTEGER,

    rule_id INTEGER,

    parameter_id INTEGER,

    operator TEXT,

    comparison_value TEXT,

    condition_order INTEGER DEFAULT 1,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    is_deleted INTEGER DEFAULT 0,

    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id),

    FOREIGN KEY (rule_id)
    REFERENCES rules(id),

    FOREIGN KEY (parameter_id)
    REFERENCES parameters(id)
);

-- =====================================================
-- CITIZENS
-- =====================================================

CREATE TABLE IF NOT EXISTS citizens (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tenant_id INTEGER,

    citizen_code TEXT,

    full_name TEXT,

    mobile_number TEXT,

    email TEXT,

    address TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    is_deleted INTEGER DEFAULT 0,

    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
);

-- =====================================================
-- CITIZEN TAX RECORDS
-- =====================================================

CREATE TABLE IF NOT EXISTS citizen_tax_records (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tenant_id INTEGER,

    citizen_id INTEGER,

    tax_type_id INTEGER,

    total_tax REAL DEFAULT 0,

    status TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    is_deleted INTEGER DEFAULT 0,

    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id),

    FOREIGN KEY (citizen_id)
    REFERENCES citizens(id),

    FOREIGN KEY (tax_type_id)
    REFERENCES tax_types(id)
);

-- =====================================================
-- DYNAMIC RECORD VALUES
-- =====================================================

CREATE TABLE IF NOT EXISTS citizen_record_values (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tenant_id INTEGER,

    citizen_tax_record_id INTEGER,

    parameter_id INTEGER,

    parameter_value TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    is_deleted INTEGER DEFAULT 0,

    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id),

    FOREIGN KEY (citizen_tax_record_id)
    REFERENCES citizen_tax_records(id),

    FOREIGN KEY (parameter_id)
    REFERENCES parameters(id)
);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    tenant_id INTEGER,

    entity_name TEXT,

    entity_id INTEGER,

    action_type TEXT,

    old_value TEXT,

    new_value TEXT,

    action_by INTEGER,

    action_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id),

    FOREIGN KEY (action_by)
    REFERENCES users(id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_tax_types_tenant
ON tax_types(tenant_id);

CREATE INDEX IF NOT EXISTS idx_parameters_tax_type
ON parameters(tax_type_id);

CREATE INDEX IF NOT EXISTS idx_rules_tax_type
ON rules(tax_type_id);

CREATE INDEX IF NOT EXISTS idx_rule_conditions_rule
ON rule_conditions(rule_id);

CREATE INDEX IF NOT EXISTS idx_citizen_tax_records_citizen
ON citizen_tax_records(citizen_id);

CREATE INDEX IF NOT EXISTS idx_record_values_record
ON citizen_record_values(citizen_tax_record_id);