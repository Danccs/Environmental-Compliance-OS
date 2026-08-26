# Environmental Compliance OS — Database Schema

```sql
-- TABLAS PRINCIPALES (POSTGRESQL DIALECT)

CREATE TABLE tenants (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(64) NOT NULL DEFAULT 'Enterprise',
    status VARCHAR(32) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE organizations (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id),
    tax_id VARCHAR(32) NOT NULL, -- RUT chileno (ej: 76.842.190-3)
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    economic_activity VARCHAR(255),
    consolidation_approach VARCHAR(64) DEFAULT 'OperationalControl', -- Control Operacional, Financiero, etc.
    base_year INT DEFAULT 2024,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE facilities (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id),
    organization_id VARCHAR(64) REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64),
    retc_code VARCHAR(64), -- Código de establecimiento en Ventanilla Única RETC
    facility_type VARCHAR(64), -- Planta Manufactura, CD, Sucursal, Mina
    address VARCHAR(255),
    commune VARCHAR(128),
    region VARCHAR(128),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emission_factors (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    source_agency VARCHAR(128) NOT NULL, -- HuellaChile MMA, IPCC, DEFRA, Ecoinvent, Proveedor
    country VARCHAR(64) DEFAULT 'CL',
    activity_category VARCHAR(128) NOT NULL, -- Combustión, Electricidad, Transporte, Residuos, Materiales
    input_unit VARCHAR(32) NOT NULL, -- L, m3, kWh, kg, t.km, CLP
    output_unit VARCHAR(32) NOT NULL DEFAULT 'kgCO2e',
    co2e_factor NUMERIC(14, 6) NOT NULL,
    co2_factor NUMERIC(14, 6),
    ch4_factor NUMERIC(14, 6),
    n2o_factor NUMERIC(14, 6),
    gwp_version VARCHAR(32) DEFAULT 'AR5', -- AR5, AR6
    valid_from DATE NOT NULL,
    valid_to DATE,
    version VARCHAR(32) NOT NULL,
    uncertainty_pct NUMERIC(5, 2) DEFAULT 5.00,
    is_official BOOLEAN DEFAULT TRUE,
    source_document_url TEXT
);

CREATE TABLE activity_data (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id),
    organization_id VARCHAR(64) REFERENCES organizations(id),
    facility_id VARCHAR(64) REFERENCES facilities(id),
    scope VARCHAR(16) NOT NULL, -- Scope 1, Scope 2, Scope 3
    scope_category VARCHAR(128) NOT NULL, -- ej: Cat 1: Purchased Goods, Combustión Móvil, etc.
    activity_type VARCHAR(128) NOT NULL,
    period_date DATE NOT NULL,
    quantity NUMERIC(16, 4) NOT NULL,
    unit VARCHAR(32) NOT NULL,
    source_system VARCHAR(64) NOT NULL, -- ERP SAP, Softland, Factura Copec, Medidor IoT
    source_record_id VARCHAR(128),
    supplier_id VARCHAR(64),
    data_quality_score INT DEFAULT 85,
    emission_factor_id VARCHAR(64) REFERENCES emission_factors(id),
    status VARCHAR(32) DEFAULT 'Validated',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calculations (
    id VARCHAR(64) PRIMARY KEY,
    activity_data_id VARCHAR(64) REFERENCES activity_data(id),
    emission_factor_id VARCHAR(64) REFERENCES emission_factors(id),
    quantity NUMERIC(16, 4) NOT NULL,
    unit VARCHAR(32) NOT NULL,
    factor_applied NUMERIC(14, 6) NOT NULL,
    formula_used VARCHAR(255) NOT NULL,
    result_co2e_kg NUMERIC(16, 4) NOT NULL,
    result_co2e_ton NUMERIC(16, 6) NOT NULL,
    gwp_standard VARCHAR(32) NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evidences (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id),
    organization_id VARCHAR(64) REFERENCES organizations(id),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(64) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    document_category VARCHAR(128) NOT NULL, -- Factura, Guía Despacho, Certificado Valorización REP, etc.
    document_date DATE NOT NULL,
    issuer_name VARCHAR(255),
    storage_url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE packaging_boms (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id),
    organization_id VARCHAR(64) REFERENCES organizations(id),
    product_sku VARCHAR(64) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    component_name VARCHAR(128) NOT NULL, -- Botella, Tapa, Etiqueta, Caja Embalaje
    priority_category VARCHAR(128) NOT NULL, -- Envases y Embalajes Ley REP
    subcategory VARCHAR(128) NOT NULL, -- Domiciliario / No Domiciliario
    material_type VARCHAR(128) NOT NULL, -- Plásticos PET, Polipropileno PP, Papel/Cartón, Vidrio
    weight_grams NUMERIC(10, 4) NOT NULL,
    recycled_content_pct NUMERIC(5, 2) DEFAULT 0.00,
    is_hazardous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
