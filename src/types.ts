/**
 * Environmental Compliance OS — Core Type Definitions
 * Unified Environmental Data Model for Chile & LatAm
 */

export type ScopeType = 'Scope 1' | 'Scope 2' | 'Scope 3';

export type Scope1Category = 
  | 'Combustión Estacionaria' 
  | 'Combustión Móvil' 
  | 'Emisiones de Proceso' 
  | 'Emisiones Fugitivas';

export type Scope2Approach = 'Location-Based' | 'Market-Based';

export type Scope3CategoryNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export interface Scope3CategoryInfo {
  number: Scope3CategoryNumber;
  code: string;
  name: string;
  nameEn: string;
  isMaterial: boolean;
  materialityReason?: string;
  emissionsTons: number;
}

export type RepPriorityProduct = 
  | 'Envases y Embalajes' 
  | 'Neumáticos' 
  | 'Baterías' 
  | 'Pilas' 
  | 'Aceites Lubricantes' 
  | 'Aparatos Eléctricos y Electrónicos';

export type RepSubcategory = 
  | 'Domiciliario' 
  | 'No Domiciliario' 
  | 'Categoría A' 
  | 'Categoría B';

export type RepMaterialType = 
  | 'Plásticos PET' 
  | 'Plásticos PEAD' 
  | 'Plásticos PEBD' 
  | 'Plásticos PP' 
  | 'Plásticos PS' 
  | 'Plásticos Otros' 
  | 'Papel y Cartón' 
  | 'Metal Aluminio' 
  | 'Metal Hojalata' 
  | 'Cartón para Líquidos (Tetra)' 
  | 'Vidrio';

export interface Tenant {
  id: string;
  name: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  status: 'Active' | 'Suspended';
  createdAt: string;
}

export interface Organization {
  id: string;
  tenantId: string;
  taxId: string; // RUT chileno (ej: 76.842.190-3)
  legalName: string;
  tradeName: string;
  economicActivity: string;
  consolidationApproach: 'OperationalControl' | 'FinancialControl' | 'EquityShare';
  baseYear: number;
  contactEmail: string;
  representativeName: string;
}

export interface Facility {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  retcCode: string; // Código Ventanilla Única RETC
  facilityType: 'Planta Industrial' | 'Centro de Distribución' | 'Oficina Central' | 'Sucursal Operativa';
  address: string;
  commune: string;
  region: string;
  latitude: number;
  longitude: number;
  managerName: string;
}

export interface ProcessUnit {
  id: string;
  facilityId: string;
  name: string;
  code: string;
  category: 'Manufactura' | 'Logística' | 'Servicios Auxiliares' | 'Administración';
}

export interface CostCenter {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  responsible: string;
}

export interface Supplier {
  id: string;
  organizationId: string;
  taxId: string; // RUT
  name: string;
  category: 'Combustibles' | 'Energía Eléctrica' | 'Materias Primas' | 'Transporte y Fletes' | 'Residuos y Valorización' | 'Servicios';
  criticalityLevel: 'Alta' | 'Media' | 'Baja';
  hasSpecificFactor: boolean;
  specificFactorCo2e?: number;
  contactEmail: string;
  complianceStatus: 'Validado' | 'Pendiente Información' | 'Sin Información';
}

export interface EmissionFactor {
  id: string;
  code: string;
  name: string;
  sourceAgency: 'HuellaChile MMA' | 'IPCC AR5' | 'IPCC AR6' | 'DEFRA UK' | 'Coordinador Eléctrico Nacional' | 'Ecoinvent Proxy' | 'Específico de Proveedor';
  country: string;
  activityCategory: 'Combustibles Fósiles' | 'Red Eléctrica Nacional (SEN)' | 'Transporte Terrestre/Aéreo' | 'Materiales y Embalajes' | 'Residuos y Efluentes' | 'Gases Refrigerantes';
  inputUnit: string;
  outputUnit: 'kgCO2e' | 'tCO2e';
  co2eFactor: number; // Por unidad de entrada
  co2Factor?: number;
  ch4Factor?: number;
  n2oFactor?: number;
  gwpVersion: 'AR5' | 'AR6';
  validFrom: string;
  validTo?: string;
  version: string;
  uncertaintyPct: number;
  isOfficial: boolean;
  sourceUrl?: string;
  methodologyNotes: string;
}

export interface EvidenceDocument {
  id: string;
  organizationId: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  sha256Hash: string;
  category: 'Factura Combustible' | 'Cuenta Eléctrica' | 'Certificado I-REC' | 'Guía de Despacho' | 'Certificado de Valorización REP' | 'Ticket de Pesaje' | 'Declaración Aduanera' | 'Informe Auditoría';
  documentDate: string;
  issuerName: string;
  issuerTaxId: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  storageUrl: string;
  retentionPolicy: string;
}

export interface ActivityData {
  id: string;
  organizationId: string;
  facilityId: string;
  processId?: string;
  costCenterId?: string;
  scope: ScopeType;
  scopeCategory: string; // ej. "Combustión Móvil Diésel" o "Cat 1: Bienes y Servicios"
  activityType: string;
  periodDate: string; // YYYY-MM-DD o YYYY-MM
  quantity: number;
  unit: string;
  sourceSystem: 'ERP SAP' | 'Softland ERP' | 'Defontana' | 'Tarjeta Combustible Copec' | 'Telemetría Medidor IoT' | 'Planilla Excel' | 'Ingreso Manual';
  sourceRecordId: string;
  supplierId?: string;
  emissionFactorId: string;
  dataQualityScore: number; // 0 - 100
  dataQualityTier: 'Tier 1: Medición Primaria' | 'Tier 2: Proveedor Específico' | 'Tier 3: Factor Oficial Nacional' | 'Tier 4: Estimación / Spend-Based';
  evidenceId?: string;
  status: 'Borrador' | 'Validado' | 'Cerrado';
  calculatedCo2eKg: number;
  calculatedCo2eTons: number;
  createdAt: string;
  createdBy: string;
}

export interface CalculationLineage {
  calculationId: string;
  activityDataId: string;
  quantity: number;
  unit: string;
  factorName: string;
  factorCode: string;
  factorVersion: string;
  factorValue: number;
  factorUnit: string;
  factorSource: string;
  gwpStandard: string;
  formula: string;
  resultKg: number;
  resultTons: number;
  dataQualityScore: number;
  evidenceName?: string;
  evidenceHash?: string;
  evidenceUrl?: string;
  sourceSystem: string;
  sourceRecordId: string;
  facilityName: string;
  timestamp: string;
}

export interface PackagingBOMItem {
  id: string;
  productSku: string;
  productName: string;
  componentName: string; // Botella, Tapa, Etiqueta, Caja Master, Film Stretch
  tier: 'Envase Primario' | 'Envase Secundario' | 'Envase Terciario';
  priorityProduct: RepPriorityProduct;
  subcategory: RepSubcategory;
  materialType: RepMaterialType;
  weightGrams: number;
  recycledContentPct: number;
  isHazardous: boolean;
  isRecyclable: boolean;
  emissionFactorPerKg: number; // kgCO2e por kg de material
}

export interface RepMarketIntroduction {
  id: string;
  organizationId: string;
  periodYear: number;
  periodMonth: number;
  productSku: string;
  productName: string;
  unitsSold: number;
  totalWeightDeclaredKg: number;
  breakdownByMaterial: {
    material: RepMaterialType;
    subcategory: RepSubcategory;
    totalKg: number;
    recycledKg: number;
  }[];
  sourceInvoiceRef: string;
  evidenceId?: string;
  status: 'Conciliado ERP' | 'Pendiente Validación' | 'Declarado SISREP';
}

export interface RepWasteRecoveryRecord {
  id: string;
  organizationId: string;
  periodYear: number;
  periodMonth: number;
  priorityProduct: RepPriorityProduct;
  materialType: RepMaterialType;
  subcategory: RepSubcategory;
  collectedKg: number;
  recoveredKg: number;
  managementSystem: 'GRANSIC ReSimple' | 'GIROS Chile' | 'Sistema Individual' | 'Gestor Directo';
  wasteManagerTaxId: string;
  wasteManagerName: string;
  treatmentType: 'Reciclaje Mecánico' | 'Valorización Energética' | 'Reutilización' | 'Relleno Sanitario';
  trackingCertificateNumber: string;
  evidenceId: string;
  status: 'Certificado Válido' | 'En Verificación';
}

export interface ProductCarbonStudy {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  studyTitle: string;
  functionalUnit: string; // ej: "1 botella de 500 ml consumida"
  referenceFlowQuantity: number;
  referenceFlowUnit: string;
  systemBoundary: 'Cradle-to-Gate' | 'Cradle-to-Grave';
  standard: 'NCh-ISO 14067:2019' | 'GHG Protocol Product Standard';
  geographicScope: 'Chile Nacional' | 'Cono Sur';
  timeScopeYear: number;
  totalPcfKgCo2e: number; // kgCO2e por unidad funcional
  breakdown: {
    rawMaterials: number; // Materias Primas Upstream
    manufacturing: number; // Manufactura Core
    packaging: number; // Envasado y Embalaje
    distribution: number; // Transporte y Distribución
    usePhase: number; // Fase de Uso / Refrigeración
    endOfLife: number; // Fin de Vida / Disposición
  };
  allocationMethod: 'Asignación Física (Masa)' | 'Asignación Económica' | 'Sin Asignación (Subdivisión)';
  status: 'En Borrador' | 'Calculado' | 'Verificado por Tercero';
  verifierName?: string;
  verificationDate?: string;
}

export interface PcfProcessNode {
  id: string;
  studyId: string;
  stage: 'Upstream (Materias Primas)' | 'Core (Manufactura y Envasado)' | 'Downstream (Distribución y Fin de Vida)';
  name: string;
  description: string;
  inputs: {
    name: string;
    quantity: number;
    unit: string;
    factorCo2e: number;
    subtotalCo2eKg: number;
  }[];
  outputs: {
    name: string;
    quantity: number;
    unit: string;
    isMainProduct: boolean;
  }[];
  scrapPct: number;
  totalNodeCo2eKg: number;
}

export interface ComplianceObligation {
  id: string;
  organizationId: string;
  authority: 'Ministerio del Medio Ambiente (MMA)' | 'Superintendencia del Medio Ambiente (SMA)' | 'Ventanilla Única RETC' | 'Programa HuellaChile';
  code: string;
  title: string;
  legalBase: string; // ej. "Ley 20.920 / DS 12/2020 MMA"
  dueDate: string;
  frequency: 'Mensual' | 'Anual' | 'Semestral' | 'Eventual';
  status: 'Cumplido' | 'En Proceso' | 'Pendiente' | 'Vencido';
  responsiblePerson: string;
  evidenceId?: string;
  requiresReview: boolean;
}

export interface EnvironmentalIssue {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  severity: 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
  status: 'Abierto' | 'En Progreso' | 'En Revisión' | 'Resuelto' | 'Riesgo Aceptado';
  category: 'Calidad de Datos' | 'Factor Desactualizado' | 'Brecha de Evidencia' | 'Meta REP' | 'Desviación GEI';
  assignedTo: string;
  dueDate: string;
  createdAt: string;
}

export interface DecarbonizationInitiative {
  id: string;
  organizationId: string;
  name: string;
  category: 'Eficiencia Energética' | 'Autogeneración Solar' | 'Electrificación Flota' | 'Ecodiseño Embalaje' | 'Suministro Renovable (PPA)';
  targetScope: ScopeType;
  investmentClp: number;
  expectedAnnualReductionTons: number;
  marginalAbatementCostUsdPerTon: number; // Costo Marginal de Abatimiento ($/tCO2e)
  startDate: string;
  status: 'Propuesta' | 'Aprobada' | 'En Implementación' | 'Operativa';
  owner: string;
}

export interface InventorySnapshot {
  id: string;
  organizationId: string;
  year: number;
  snapshotDate: string;
  totalEmissionsTons: number;
  scope1Tons: number;
  scope2LocationTons: number;
  scope2MarketTons: number;
  scope3Tons: number;
  dataIntegrityHash: string;
  approvedBy: string;
  approvalRole: string;
  status: 'Cerrado e Inmutable';
}
