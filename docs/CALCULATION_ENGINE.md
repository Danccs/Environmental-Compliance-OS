# Environmental Compliance OS — Calculation & Lineage Engine

## 1. Principio Determinístico de Cálculo
Todo cálculo en la plataforma se rige por:
$$\text{Emisión (kgCO}_2\text{e)} = \text{Dato de Actividad} \times \text{Factor de Emisión Versionado} \times \text{Factor de Conversión de Unidad}$$

Para emisiones directas desagregadas:
$$\text{Emisión Total CO}_2\text{e} = \sum \left( Q \times EF_{\text{CO}_2} + Q \times EF_{\text{CH}_4} \times \text{GWP}_{\text{CH}_4} + Q \times EF_{\text{N}_2\text{O}} \times \text{GWP}_{\text{N}_2\text{O}} \right)$$

## 2. Inmutabilidad y Versionamiento de Factores
- Un factor de emisión posee identificador único, código de agencia emisora (ej: `CL-HUELLACHILE-2026-DIESEL`), versión (`v1.4`), rango de vigencia (`2026-01-01` a `2026-12-31`), y versión de GWP (`AR5` o `AR6`).
- **Bloqueo de Inventario**: Al cerrar un inventario corporativo, los factores y fórmulas se congelan mediante un *Snapshot Hash*. Cualquier cambio posterior en la base de factores no altera inventarios históricos cerrados.

## 3. Cadena de Linaje de Datos (Data Lineage)
Cada resultado `Calculation` expone una traza de auditoría navegable:
- **Nivel 1 — Métrica Agregada**: Inventario Corporativo / PCF / Declaración REP.
- **Nivel 2 — Categoría / Fuente**: Alcance 1 / Combustión Móvil / Diésel Flota.
- **Nivel 3 — Registro de Actividad (`ActivityData`)**: 35.420 Litros Diésel cargados en Planta Quilicura durante Julio 2026.
- **Nivel 4 — Lote de Ingesta (`ImportBatch`)**: Archivo `Cargas_Combustible_Copec_2026-07.xlsx` procesado el 02/08/2026 a las 09:14 por `juan.perez@empresa.cl`.
- **Nivel 5 — Evidencia Primaria (`Evidence`)**: Factura Electrónica N° 481921 emitida por Copec S.A. con hash SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

## 4. Jerarquía de Calidad de Datos (Data Quality Scoring)
- **Nivel 1 (Puntaje 95-100)**: Medición directa continua o dato primario de proveedor verificado por tercero.
- **Nivel 2 (Puntaje 80-94)**: Dato de actividad física con factor oficial específico de país (ej. HuellaChile).
- **Nivel 3 (Puntaje 60-79)**: Dato de actividad física con factor proxy internacional (ej. DEFRA / IPCC).
- **Nivel 4 (Puntaje 20-59)**: Estimación monetaria (*Spend-based*) mediante matrices insumo-producto EEIO.
