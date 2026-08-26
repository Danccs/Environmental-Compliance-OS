# Environmental Compliance OS — Product Specification

## 1. Executive Summary
**Environmental Compliance OS** es una plataforma SaaS B2B empresarial ("Environmental System of Record") diseñada para organizaciones que operan en Chile y Latinoamérica. Integra en un núcleo común:
1. **Cumplimiento de Ley REP (Ley N° 20.920)** y preparación de declaraciones SISREP / RETC.
2. **Contabilidad Corporativa de Gases de Efecto Invernadero (GEI)** bajo GHG Protocol y NCh-ISO 14064-1 (Alcances 1, 2 y 3 con las 15 categorías).
3. **Huella de Carbono de Producto (PCF)** bajo NCh-ISO 14067 y análisis de ciclo de vida (LCA).
4. **Bóveda de Evidencias y Linaje de Datos** con trazabilidad matemática y documental estricta (*Explainable Environmental Data*).
5. **Copiloto Ambiental IA** para clasificación automática de compras, detección de anomalías y preparación para auditorías.

---

## 2. Core Value Proposition
- **One Data Source — Multiple Environmental Uses**: Un mismo registro de factura de combustible o BOM de embalaje alimenta simultáneamente el inventario Scope 1/3, la declaración REP y el estudio de ciclo de vida del producto.
- **Explainability & Lineage First**: Ningún número es una caja negra. Cada tonelada de CO₂e y cada kilogramo REP cuenta con su cadena de factor, versión, fórmula, evidencia y lote de origen.
- **Audit-Ready & Assurance**: Generación en 1-click del Environmental Audit Package para verificadores independientes (ISO 14064-3) y fiscalizadores (SMA / MMA).

---

## 3. Key Functional Modules

### M1. Core Organizacional & Master Data
- Jerarquía multi-nivel: Holding / Tenant → Organización (RUT) → Unidad de Negocio → Instalación / Planta → Centro de Costos → Proceso → Actividad.
- Catálogos maestros: Proveedores, Productos/SKU, Materiales, Vehículos/Flota, Fuentes de Emisión, Tipos de Residuo, Factores de Emisión.

### M2. Motor de Datos de Actividad & Bóveda de Evidencias
- Ingesta multi-origen (ERP, Facturación, Tarjetas de Combustible Copec/Shell, Medidores IoT, SCADA, Excel/CSV).
- Área de staging: Raw → Staging → Validated → Normalized Activity Data.
- Bóveda de evidencias con hash criptográfico SHA-256, metadatos y retención inmutable.
- Score de Calidad de Datos (Tier 1 Medición primaria, Tier 2 Proveedor específico, Tier 3 Factor promedio, Tier 4 Basado en gasto / Spend-based).

### M3. Motor de Factores de Emisión & Cálculo GEI
- Repositorio versionado de factores oficiales: HuellaChile (MMA), IPCC AR5/AR6, DEFRA, EPA, Ecoinvent proxy, y factores específicos de proveedor.
- Versionamiento temporal y bloqueo de factores para inventarios cerrados.
- Soporte estricto de Potencial de Calentamiento Global (GWP AR5 vs AR6).

### M4. Contabilidad de Carbono Corporativo (GHG Corporate Inventory)
- Alcance 1: Combustión estacionaria, móvil, emisiones de proceso y fugitivas de refrigerantes.
- Alcance 2: Electricidad y energía térmica (enfoques Location-based y Market-based con trazabilidad de I-RECs).
- Alcance 3: 15 Categorías GHG Protocol completas, matriz de materialidad y cálculo híbrido (físico + spend-based).
- KPIs de intensidad, año base, metas de descarbonización y curva de abatimiento marginal (MACC).

### M5. Cumplimiento Ley REP (Ley N° 20.920)
- Productos Prioritarios: Envases y Embalajes (Domiciliarios y No Domiciliarios: Papel/Cartón, Plásticos PET/PP/PE, Vidrio, Metal, Cartón para Líquidos), Neumáticos, Baterías, Aceites Lubricantes, Aparatos Eléctricos y Electrónicos.
- Packaging BOM (Lista de materiales de envases por SKU).
- Registro de introducción al mercado y trazabilidad de gestión de residuos con Gestores Autorizados y Sistemas de Gestión (GRANSIC / GIROS / RECHILE).
- Exportador SISREP-ready (Datasets normalizados para Ventanilla Única RETC / SISREP).

### M6. Huella de Carbono de Producto (PCF - ISO 14067)
- Definición de Unidad Funcional, flujo de referencia y límites del sistema (Cradle-to-Gate, Cradle-to-Grave).
- Visualizador de Proceso en Grafo de Nodos (Inputs, Outputs, Scrap, Emisiones).
- Asignación de cargas ambientales (física, masa, económica).
- Análisis de Puntos Críticos (Hotspots) y Simulador de Ecodiseño (EcoDesign) en tiempo real.

### M7. Gestión de Cumplimiento, Riesgos y Auditoría
- Calendario regulatorio ambiental chileno (Plazos RETC, Declaración Jurada Anual REP, HuellaChile).
- Gestión de No Conformidades / Issues ambientales.
- Flujo de aprobación y congelamiento de inventarios (*Snapshots* inmutables).
- Espacio de trabajo para Verificador Externo.

### M8. Copiloto Ambiental IA
- Asistente inteligente basado en Gemini API (Server-side) para análisis exploratorio, explicabilidad y detección de anomalías.
