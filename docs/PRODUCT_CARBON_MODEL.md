# Environmental Compliance OS — Product Carbon Footprint (PCF) Model

## 1. Standard Framework
- **Norma de Referencia**: NCh-ISO 14067:2019 (Gases de efecto invernadero — Huella de carbono de productos — Requisitos y directrices para cuantificación).
- **Relación con LCA**: Compatible con ISO 14040 e ISO 14044 (Análisis de Ciclo de Vida).
- **Distinción Crítica**: El modelo PCF responde a: *"¿Cuántas emisiones de GEI se asocian al ciclo de vida de una unidad funcional de este producto?"*, diferenciándose del inventario corporativo que mide el desempeño global de la entidad en un año calendario.

## 2. Definición del Sistema del Producto
- **Unidad Funcional (UF)**: Cuantificación del desempeño del sistema (ej: *1 botella de bebida isotónica de 500 ml consumida*, *1 tonelada métrica de sulfato de cobre entregada en puerto*).
- **Flujo de Referencia**: Cantidad de producto requerida para satisfacer la Unidad Funcional.
- **Límites del Sistema**:
  - *Cradle-to-Gate* (De la cuna a la puerta de fábrica): Materias primas + Transporte Upstream + Manufactura.
  - *Cradle-to-Grave* (De la cuna a la tumba): Incluye Distribución, Fase de Uso y Tratamiento de Fin de Vida.

## 3. Grafo de Procesos (Process Graph & Node Flow)
El producto se descompone en un grafo dirigido de nodos de proceso:
- **Inputs**: Materias primas (resina PET virgen, resina rPET reciclada, aditivos), Energía eléctrica (kWh), Combustibles de proceso (Gas Natural, Diésel), Agua industrial.
- **Outputs**: Producto semielaborado / terminado y Coproductos.
- **Scrap / Mermas**: Residuos de proceso reincorporados o descartados.

## 4. Reglas de Asignación y Contenido Reciclado
- **Jerarquía de Asignación**: Evitar asignación mediante subdivisión o expansión de límites > Asignación física (masa, volumen, contenido estequiométrico) > Asignación económica.
- **Contenido Reciclado (Cut-off Approach)**: La carga ambiental de la materia prima virgen se atribuye al primer ciclo; el material reciclado solo asume las cargas del proceso de recolección y reprocesamiento.
