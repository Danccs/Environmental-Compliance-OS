# 🌿 Environmental & REP Compliance OS

[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.1-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js & Express](https://img.shields.io/badge/Backend-Express%20%2B%20Node.js-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini API](https://img.shields.io/badge/AI%20Copilot-Gemini%20Flash-8E75B2.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Normativa](https://img.shields.io/badge/Normativa-Ley%2020.920%20%7C%20ISO%2014064--1%2F3-008000.svg)]()
[![Auditoría SMA](https://img.shields.io/badge/Fiscalizaci%C3%B3n-SMA%20R.E.%202084%2F2023-blue.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Modular%20Full--Stack-orange.svg)]()

**Environmental & REP Compliance OS** es una plataforma tecnológica empresarial de **contabilidad de carbono corporativo, trazabilidad inmutable de huella de producto (LCA), balance de masa y gestión integral de cumplimiento normativo** diseñada para organizaciones reguladas bajo la **Ley N° 20.920 (Ley REP)** de la República de Chile, las normas internacionales **ISO 14064-1/3**, **ISO 14067** y los estándares del **GHG Protocol**.

La plataforma centraliza la ingesta de datos de actividad desde sistemas ERP (SAP, Softland, Defontana, CSV/Excel), medidores IoT y facturas fiscales, calcula de manera determinística las emisiones de Alcance 1, 2 y 3 con factores oficiales versionados (HuellaChile, SEN, Ecoinvent), administra el balance de masa de envases y embalajes (Packaging BOM), custodia digitalmente medios de prueba mediante sellado criptográfico **SHA-256** y habilita un espacio de trabajo listo para auditorías externas independientes (SGS, Bureau Veritas, AENOR) y fiscalización de la **Superintendencia del Medio Ambiente (SMA)**.

---

## 🏛️ Marco Normativo & Estándares Regulatorios

La plataforma implementa modelos de cálculo, formatos de reporte y protocolos de custodia alineados estrictamente con el marco legal e internacional vigente:

| Norma / Estándar | Ámbito de Aplicación | Implementación en la Plataforma |
| :--- | :--- | :--- |
| **Ley N° 20.920 (Ley REP)** | Marco para la Gestión de Residuos, Responsabilidad Extendida del Productor y Fomento al Reciclaje. | Identificación de productos prioritarios, balance de masa introducido al mercado nacional y trazabilidad de gestores autorizados. |
| **D.S. 12/2020 MMA** | Metas de recolección y valorización de Envases y Embalajes (EyE). | Fórmulas de balance por material (Plásticos, Cartón, Vidrio, Metal, Tetra Pak), desagregación domiciliario/no domiciliario y cálculo de ecomodulación tarifaria. |
| **D.S. 8/2019 MMA** | Metas de recolección y valorización de Neumáticos Fuera de Uso (NFU). | Clasificación por categorías A (Aro < 57") y B (Aro ≥ 57") y seguimiento de valorización energética/material. |
| **R.E. 2084/2023 SMA** | Instrucción general sobre medios de prueba para fiscalización de metas REP. | Custodia digital inmutable de guías de despacho, certificados de pesaje, resoluciones sanitarias (RCA) y sellado SHA-256. |
| **NCh-ISO 14064-1:2019** | Cuantificación e informe de emisiones y remociones de Gases de Efecto Invernadero (GEI) a nivel organizacional. | Inventario corporativo Alcances 1, 2 (Location & Market-Based) y 3 (Cadena de Valor) con factores de emisión versionados. |
| **NCh-ISO 14064-3:2019** | Validación y verificación de declaraciones de GEI por terceras partes. | Espacio dedicado de auditoría, trazabilidad causal (*Data Lineage*), muestreo y exportación de paquetes de aseguramiento razonable/limitado. |
| **ISO 14067:2018** | Huella de carbono de productos (CFP) - Requisitos y directrices para cuantificación. | Huella por unidad funcional (Cradle-to-Gate), desglose por etapas del ciclo de vida y asignación de materias primas. |
| **D.S. 1/2013 MMA** | Registro de Emisiones y Transferencias de Contaminantes (RETC). | Conciliación y generación de balance de masa y emisiones para declaración en Ventanilla Única. |

---

## 🎨 Sistema de Diseño: "Sleek Industrial & High-Density UI"

La interfaz de usuario ha sido concebida bajo principios de **alta densidad de información corporativa y diseño limpio contemporáneo**:

* **Lienzo Neutro y Contraste Óptico:**
  * Fondo general en tono slate ultra-claro (`#F8FAFC`) con contenedores y tarjetas en blanco puro (`#FFFFFF`), bordes sutiles de alta fidelidad (`border-slate-100` / `border-slate-200`) y sombras suaves (`shadow-sm` / `shadow-2xs`).
  * Acentos funcionales normativos: **Azul Institucional** (`#2563eb` / `#1d4ed8`) para navegación y comandos primarios, **Verde Esmeralda** (`#059669` / `#10b981`) para estados conformes y verificados, **Ámbar** (`#d97706`) para advertencias de cuadratura o pendientes, y **Púrpura** (`#7c3aed`) para emisiones Scope 3 y factores internacionales.
* **Jerarquía Tipográfica Refinada:**
  * Tipografía display y cuerpo en **Plus Jakarta Sans** para máxima legibilidad ejecutiva.
  * Tipografía técnica en **JetBrains Mono** para RUTs, identificadores de registros, unidades de medida, factores de emisión y firmas criptográficas SHA-256.
* **Componentes de Auditoría & Trazabilidad:**
  * Tablas operativas de alta densidad con filtros multicriterio, modales de linaje matemático interactivo y drawer lateral para el Copiloto IA.

---

## 🚀 Módulos Funcionales Clave

```
Environmental & REP Compliance OS
 ├── 1. Centro de Control Ejecutivo (Executive Dashboard & KPIs)
 ├── 2. Huella de Carbono Corporativa (ISO 14064-1: Scopes 1, 2 Location/Market & 3)
 ├── 3. Huella de Carbono de Producto & ACV (ISO 14067 Cradle-to-Gate)
 ├── 4. Cumplimiento Ley REP & Balance de Masa (D.S. 12/2020 & D.S. 8/2019)
 ├── 5. Datos de Actividad & Staging de Ingesta (ERP SAP / Softland / CSV)
 ├── 6. Bóveda de Evidencias Digitales & WORM SHA-256 (Evidence Vault)
 ├── 7. Calendario Regulatorio, Gestor de Issues & Snapshots Inmutables
 ├── 8. Espacio de Verificación & Auditoría Externa (ISO 14064-3 / SMA Package)
 ├── 9. Motor de Explicabilidad Matemática (Lineage & Formula Breakdown)
 └── 10. Copiloto Ambiental IA (Gemini 2.5/3.7 Flash Asesor Normativo)
```

### 1. Centro de Control Ejecutivo
* Visión consolidada de emisiones totales (`tCO₂e`), intensidad de carbono (`kgCO₂e / unidad producida`) y toneladas introducidas al mercado bajo la Ley REP.
* Tasa de respaldo documental y porcentaje de conformidad normativa global.
* Desglose por alcance, instalaciones operacionales y evolución de metas regulatorias.

### 2. Huella de Carbono Corporativa (ISO 14064-1 & GHG Protocol)
* **Alcance 1 (Emisiones Directas):** Combustión estacionaria (calderas, hornos), combustión móvil (flotas operativas) y emisiones fugitivas de refrigerantes.
* **Alcance 2 (Emisiones Indirectas por Electricidad):** Doble reporte metodológico **Location-Based** (Factor oficial SEN Chile: `0.2854 kgCO₂e/kWh`) y **Market-Based** (Certificados de Energía Renovable I-REC con factor `0.0000 kgCO₂e/kWh`).
* **Alcance 3 (Cadena de Valor):** Transporte aguas arriba/aguas abajo, insumos productivos (harinas, aceites, envases) y disposición de residuos.

### 3. Huella de Carbono de Producto (ISO 14067)
* Modelación de huella por unidad de producto terminado (*Cradle-to-Gate*).
* Desglose multicapa: Materias primas agrícolas, manufactura y procesos térmicos, envases y transporte logístico.
* Comparación de intensidad de carbono y potencial de eco-diseño.

### 4. Cumplimiento Ley REP & Balance de Masa (D.S. 12/2020)
* Catálogo de fichas técnicas (*Packaging BOM*) con pesos por componente (Primario, Secundario, Terciario).
* Fórmulas oficiales de introducción al mercado conforme al Art. 14 del D.S. 12/2020:
  $$\text{Masa Total (t)} = \sum \left( \frac{\text{Unidades Despachadas} \times \text{Gramos BOM}}{1.000.000} \right)$$
* Seguimiento de metas de recolección y valorización por subcategoría (Domiciliario / No Domiciliario) y material (PET, PEAD, Cartón, Aluminio, Hojalata, Vidrio).
* Cálculo de tarifas de ecomodulación según porcentaje de material reciclado post-consumo (% PCR) y mono-materialidad.

### 5. Datos de Actividad & Staging de Ingesta
* Ingesta masiva desde archivos CSV, planillas Excel o interfaces ERP.
* Clasificación de calidad del dato en 4 Tiers conforme al GHG Protocol:
  * **Tier 1 (Medición Primaria):** Telemetría, medidores calibrados, facturas fiscales directas (Score 95–100).
  * **Tier 2 (Proveedor Específico):** Declaraciones de proveedores y EPDs verificadas (Score 85–94).
  * **Tier 3 (Factor Nacional):** Factores oficiales HuellaChile y Coordinador Eléctrico Nacional (Score 70–84).
  * **Tier 4 (Factor Internacional):** Factores secundarios Ecoinvent v3.10 / DEFRA (Score 50–69).

### 6. Bóveda de Evidencias Digitales & Sellado SHA-256
* Almacenamiento seguro de facturas de combustible, cuentas eléctricas con número de medidor, guías de despacho, certificados I-REC y manifiestos de gestores autorizados.
* Sellado criptográfico inmutable **SHA-256** por documento con política de retención legal (WORM - *Write Once, Read Many*) conforme a la R.E. 2084/2023 de la SMA.

### 7. Calendario Regulatorio, Gestor de Issues & Snapshots Inmutables
* Cronograma con hitos y plazos fatales: Ventanilla Única RETC, Declaración SISREP MMA, Impuesto Verde a Fuentes Fijas (Art. 8 Ley 20.780) y Reporte de Sostenibilidad CMF NCG 461.
* Gestor de hallazgos y no conformidades previas a la auditoría externa.
* Función de **Snapshot Anual Inmutable**: congelamiento y firma digital del inventario aprobado por la Gerencia de Operaciones/Sustentabilidad.

### 8. Espacio de Verificación & Auditoría Externa (ISO 14064-3 Ready)
* Vista especializada para auditores de casas certificadoras (SGS, Bureau Veritas, AENOR, EY, PwC).
* Matriz de muestreo probabilístico con acceso directo al linaje matemático y documentos de soporte.
* Generador de **Paquete de Auditoría Oficial (.JSON)** descargable con metadatos completos, factores, hashes y registros.

### 9. Motor de Explicabilidad Matemática (Data Lineage)
* Modal interactivo que desglosa paso a paso la cadena causal de cada cálculo:
  $$\text{Dato Primario (Cantidad/Unidad)} \times \text{Factor de Emisión (Versión/Fuente)} = \text{Emisión (kgCO₂e / tCO₂e)}$$
* Eliminación absoluta de efectos "caja negra", garantizando reproducibilidad matemática total.

### 10. Copiloto Ambiental IA (Google Gemini)
* Asistente conversacional especializado en normativa ambiental chilena (Ley 20.920, D.S. 12/2020, D.S. 1/2013, NCh-ISO 14064).
* Respuestas fundamentadas para resolver dudas sobre interpretación de decretos, categorización de envases y recomendaciones técnicas para auditorías.

---

## 🏛️ Arquitectura del Software

```
├── server.ts                       # Backend Express: Servidor API, Proxy Seguro Gemini AI & Middleware Vite
├── src/
│   ├── components/
│   │   ├── AICopilotDrawer.tsx      # Drawer lateral con Copiloto IA (Gemini Flash)
│   │   ├── ActivityDataView.tsx     # Staging de datos de actividad, ingesta CSV y clasificación por Tiers
│   │   ├── AuditWorkspaceView.tsx   # Portal de auditoría externa ISO 14064-3 y paquete descargable
│   │   ├── ComplianceCalendarView.tsx# Calendario regulatorio, gestor de issues y snapshots inmutables
│   │   ├── ControlCenterView.tsx    # Centro de control ejecutivo, KPIs y estado global
│   │   ├── CorporateCarbonView.tsx  # Huella corporativa ISO 14064-1 (Scopes 1, 2 Location/Market, 3)
│   │   ├── EvidenceVaultView.tsx    # Bóveda de documentos con firmas criptográficas SHA-256
│   │   ├── ExplainCalculationModal.tsx# Desglose matemático determinístico y linaje de datos
│   │   ├── Navbar.tsx               # Barra superior con selector de entidad, estado y accesos rápidos
│   │   ├── ProductCarbonView.tsx    # Huella de producto ISO 14067 y análisis de ciclo de vida
│   │   ├── RepComplianceView.tsx    # Balance de masa Ley REP D.S. 12/2020, Packaging BOM y ecomodulación
│   │   └── Sidebar.tsx              # Navegación lateral estructurada por áreas funcionales
│   ├── data/
│   │   └── mockData.ts              # Dataset representativo empresarial (Alimentos & Bebidas Chile)
│   ├── types.ts                     # Definiciones exhaustivas TypeScript del modelo normativo y contable
│   ├── App.tsx                      # Orquestador principal de estado, cálculo determinístico y vistas
│   ├── index.css                    # Configuración de estilos globales con Tailwind CSS v4
│   └── main.tsx                     # Punto de entrada de la aplicación React 19
├── index.html                       # HTML base con fuentes Plus Jakarta Sans & JetBrains Mono
├── metadata.json                    # Metadatos del applet y configuración de capacidades
├── package.json                     # Manifiesto de dependencias, scripts de dev y producción
├── tsconfig.json                    # Configuración estricta del compilador TypeScript
└── vite.config.ts                   # Configuración del empaquetador Vite
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Arquitectura reactiva basada en componentes funcionales y hooks. |
| **Lenguaje** | **TypeScript 5.8** | Tipado estricto para modelos de datos de actividad, factores, evidencias y cálculos. |
| **Estilos & UI** | **Tailwind CSS v4** | Motor de estilos de alta velocidad con clases de diseño de alta densidad. |
| **Animaciones** | **Motion (`motion/react`)** | Transiciones suaves de interfaces, modales y drawers. |
| **Visualización de Datos**| **Recharts 3.10** | Gráficos de barras por alcance, series temporales de emisiones y curvas de cumplimiento REP. |
| **Backend & Servidor** | **Express 4.21 + Node.js** | Servidor API full-stack, proxy seguro para IA y despacho de estáticos en producción. |
| **Inteligencia Artificial**| **@google/genai (Gemini Flash)** | Motor conversacional y de razonamiento normativo integrado del lado del servidor. |
| **Iconografía** | **Lucide React** | Iconografía técnica para flujos de auditoría, trazabilidad y estados normativos. |
| **Bundler & Build Tool** | **Vite 6 + esbuild** | Compilación ultrarrápida del cliente SPA y bundle CommonJS (`dist/server.cjs`) para el backend. |

---

## ⚙️ Instalación y Configuración Local

### Requisitos Previos
* **Node.js** v18.0.0 o superior
* **npm** v9.0.0 o superior

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-organizacion/environmental-compliance-os.git
cd environmental-compliance-os
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Cree un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`:

```env
# Google Gemini API Key (Requerida para el Copiloto IA Asesor Normativo)
GEMINI_API_KEY=tu_api_key_aqui
```

### 4. Iniciar en Modo Desarrollo
```bash
npm run dev
```
La aplicación se inicializará en `http://localhost:3000`.

### 5. Compilación para Producción
```bash
# Compila el frontend estático a dist/ y el backend a dist/server.cjs
npm run build

# Inicia el servidor optimizado en producción
npm start
```

---

## 🔒 Seguridad, Integridad y Auditoría de Datos

1. **Protección de Secretos en Backend:** La clave de API de Gemini (`process.env.GEMINI_API_KEY`) reside estrictamente en el entorno del servidor (`server.ts`) a través de un endpoint `/api/gemini/chat`, sin exponer credenciales en el cliente web.
2. **Inmutabilidad Criptográfica (SHA-256):** Toda evidencia cargada en la boveda calcula y registra una firma criptográfica única. Si un archivo o dato es modificado posteriormente, la discrepancia es detectada en los paquetes de auditoría.
3. **Reproducibilidad Matemática Determinística:** Todos los cálculos de emisiones (`tCO₂e`) y balances de masa (`toneladas de envases`) se basan en fórmulas algebraicas transparentes vinculadas a factores de emisión con fecha, fuente institucional y versión identificada.
4. **Política de Respaldo WORM:** Compatible con los requerimientos de medios de prueba exigidos por la SMA en la Resolución Exenta N° 2084/2023.

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia **MIT**. Consulte el archivo `LICENSE` para más detalles.

---

<div align="center">
  <sub>Desarrollado para la gestión ambiental de excelencia, auditorías ISO 14064 y el cumplimiento riguroso de la <strong>Ley N° 20.920</strong> en la República de Chile.</sub>
</div>
