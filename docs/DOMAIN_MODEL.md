# Environmental Compliance OS — Domain Model

## 1. Core Unified Entity Relationship Model
El modelo de dominio unifica los requisitos de reporte corporativo, cumplimiento legal REP y cálculo de producto en un único grafo relacional:

```text
Tenant (1) ── (N) Organization (1) ── (N) Facility (1) ── (N) Process / CostCenter
                           │
                           ├── (N) Supplier ── (N) ActivityData (1) ── (1) Calculation
                           │                               │                 │
                           ├── (N) Product (SKU)           └── (N) Evidence  └── (1) LineageRecord
                           │        │
                           │        ├── (N) PackagingBOMItem (Ley REP & Scope 3 Cat 1)
                           │        └── (1) ProductCarbonStudy (ISO 14067 PCF)
                           │
                           ├── (N) GHGInventory (Año / Alcances 1, 2, 3)
                           └── (N) ComplianceObligation (RETC / SISREP / HuellaChile)
```

## 2. Shared Master Entities
- **Tenant**: Entorno aislado (ej. "Holding Industrial Andino").
- **Organization**: Razón social con RUT (ej. "Demo Manufacturing Chile SpA", RUT 76.842.190-3).
- **Facility**: Instalación o sitio físico con coordenadas y código RETC (ej. "Planta Quilicura", "CD San Bernardo", "Planta Antofagasta").
- **Process / CostCenter**: Unidad operativa generadora de datos de actividad (ej. "Línea de Envasado", "Flota Logística", "Caldera Principal").
- **Supplier**: Proveedor comercial con RUT, clasificación de criticidad y estado de factor específico.
- **Product (SKU)**: Bien o servicio producido o comercializado.
- **Material**: Catálogo de insumos con densidad, composición química, reciclabilidad y factores asociados.
- **EmissionSource**: Clasificación de fuente (Combustión Móvil Diésel, Red Eléctrica SEN, Fuga Refrigerante R-410A, Transporte Fletes).
- **EmissionFactor**: Registro inmutable de factor con origen oficial (HuellaChile, DEFRA, IPCC), vigencia temporal, fórmula, incertidumbre y versión GWP.
- **Evidence**: Documento de respaldo con hash SHA-256 inmutable, metadatos, tamaño y vínculo relacional.
