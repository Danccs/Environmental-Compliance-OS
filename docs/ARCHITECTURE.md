# Environmental Compliance OS — System Architecture

## 1. Architectural Philosophy
Environmental Compliance OS está construido bajo el patrón de **Modular Monolith** de alta cohesión y bajo acoplamiento, optimizado para seguridad multi-inquilino (*Multi-Tenant Isolation*), trazabilidad inmutable y alto rendimiento en procesamiento analítico.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT TIER (React 19 SPA)                        │
│   Tailwind CSS (Light Theme) │ TanStack Tables │ Recharts │ Motion Animations │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST / JSON
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    API GATEWAY & APPLICATION BACKEND                        │
│                    (Express / Node.js + TypeScript)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ MULTI-TENANT ISOLATION MIDDLEWARE & RBAC (TenantContext & Role Validation)  │
├───────────────────────────────────┬─────────────────────────────────────────┤
│ CORE APPLICATION MODULES          │ CROSS-CUTTING ENGINES                   │
│ ├─ Organizations & Master Data    │ ├─ Calculation Engine (Fórmulas GEI/REP)│
│ ├─ Activity Data & Staging Ingest │ ├─ Data Lineage Engine                  │
│ ├─ Emission Factor Registry       │ ├─ Evidence Vault (SHA-256 Hashing)     │
│ ├─ Corporate Carbon (Scopes 1/2/3)│ ├─ Unit Conversion & Precision Decimals │
│ ├─ Ley REP & Packaging BOM        │ ├─ Audit Trail Engine                   │
│ ├─ Product Carbon Footprint (PCF) │ ├─ Regulatory & Compliance Calendar     │
│ └─ AI Environmental Copilot       │ └─ SISREP / Audit Export Adapters       │
├───────────────────────────────────┴─────────────────────────────────────────┤
│ PERSISTENCE & DATA STORAGE LAYER                                            │
│ PostgreSQL Relational Models + In-Memory / Hybrid Engine for High-Speed Ops │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Multi-Tenancy Strategy
- Cada entidad transaccional y maestra incluye obligatoriamente `tenantId` y `organizationId`.
- El aislamiento de datos se valida a nivel de middleware en el API backend y a nivel de capas de consulta.
- Soporte para estructuras de consultoría: un usuario consultor puede pertenecer a un Tenant Consultor y acceder en modo delegado a múltiples organizaciones clientes con permisos segregados.

## 3. Data Processing Pipeline (Staging Area Pattern)
Para garantizar integridad sin corromper inventarios cerrados:
1. **Raw Stage**: Ingesta bruta del archivo o payload API con payload íntegro.
2. **Staging & Validation**: Mapeo de columnas, validación de tipos, detección de duplicados (mediante hash de registro fuente `SourceSystem` + `SourceRecordId`).
3. **Normalization & Quality Scoring**: Normalización de unidades a SI (`kg`, `kWh`, `L`, `t.km`) y asignación de Data Quality Score (0-100).
4. **ActivityData Consolidation**: Vinculación con Centro de Costos, Instalación, Proveedor y Evidencia.
5. **Calculation & Lineage Registration**: Ejecución del motor determinístico con captura inmutable de factor versión, fórmula y timestamp.

## 4. Integration Adapters
- `IRegulatoryExporter`: Interfaz para exportadores de compliance (SISREP, RETC, HuellaChile).
- `IDataConnector`: Interfaz modular para conectores ERP (SAP, Softland, Defontana, Oracle) y archivos planos.
- `IAICopilotService`: Interfaz de servicios de IA generativa y análisis contextual con Google Gemini API.
