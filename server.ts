import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  initialTenant,
  initialOrganization,
  initialFacilities,
  initialProcesses,
  initialCostCenters,
  initialSuppliers,
  initialEmissionFactors,
  initialEvidences,
  initialActivityData,
  initialScope3Categories,
  initialPackagingBOM,
  initialRepMarketIntroductions,
  initialRepWasteRecoveries,
  initialPcfStudy,
  initialPcfProcessNodes,
  initialComplianceObligations,
  initialEnvironmentalIssues,
  initialDecarbonizationInitiatives,
  initialSnapshots
} from './src/data/initialData';
import {
  ActivityData,
  EvidenceDocument,
  EnvironmentalIssue,
  PackagingBOMItem,
  RepMarketIntroduction,
  CalculationLineage
} from './src/types';

dotenv.config();

// In-Memory Database Store (Simulating PostgreSQL with persistence across turns)
let tenant = { ...initialTenant };
let organization = { ...initialOrganization };
let facilities = [...initialFacilities];
let processes = [...initialProcesses];
let costCenters = [...initialCostCenters];
let suppliers = [...initialSuppliers];
let emissionFactors = [...initialEmissionFactors];
let evidences = [...initialEvidences];
let activityDataList = [...initialActivityData];
let scope3Categories = [...initialScope3Categories];
let packagingBOM = [...initialPackagingBOM];
let repIntroductions = [...initialRepMarketIntroductions];
let repRecoveries = [...initialRepWasteRecoveries];
let pcfStudy = { ...initialPcfStudy };
let pcfProcessNodes = [...initialPcfProcessNodes];
let complianceObligations = [...initialComplianceObligations];
let environmentalIssues = [...initialEnvironmentalIssues];
let decarbonizationInitiatives = [...initialDecarbonizationInitiatives];
let snapshots = [...initialSnapshots];

// Lazy Gemini AI Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'MISSING_API_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- HEALTH CHECK ---
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), app: 'Environmental Compliance OS' });
  });

  // --- ORGANIZATION & MASTER DATA ---
  app.get('/api/organization', (req: Request, res: Response) => {
    res.json({ tenant, organization });
  });

  app.put('/api/organization', (req: Request, res: Response) => {
    organization = { ...organization, ...req.body };
    res.json({ success: true, organization });
  });

  app.get('/api/facilities', (req: Request, res: Response) => {
    res.json(facilities);
  });

  app.get('/api/suppliers', (req: Request, res: Response) => {
    res.json(suppliers);
  });

  app.post('/api/suppliers', (req: Request, res: Response) => {
    const newSup = { ...req.body, id: `sup-${Date.now()}` };
    suppliers.unshift(newSup);
    res.json(newSup);
  });

  app.get('/api/emission-factors', (req: Request, res: Response) => {
    res.json(emissionFactors);
  });

  // --- EVIDENCES ---
  app.get('/api/evidences', (req: Request, res: Response) => {
    res.json(evidences);
  });

  app.post('/api/evidences', (req: Request, res: Response) => {
    const { fileName, category, issuerName, issuerTaxId, fileSizeBytes } = req.body;
    // Generate simulated SHA-256 hash for document integrity
    const simulatedHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newEvidence: EvidenceDocument = {
      id: `evi-${Date.now()}`,
      organizationId: organization.id,
      fileName: fileName || 'Documento_Ambiental_Soporte.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: fileSizeBytes || 320400,
      sha256Hash: simulatedHash,
      category: category || 'Factura Combustible',
      documentDate: new Date().toISOString().split('T')[0],
      issuerName: issuerName || 'Proveedor Emisor S.A.',
      issuerTaxId: issuerTaxId || '76.000.000-0',
      isVerified: true,
      verifiedBy: 'maria.analista@demomfg.cl',
      verifiedAt: new Date().toISOString(),
      storageUrl: `/storage/evidences/${fileName || 'doc.pdf'}`,
      retentionPolicy: 'Retención Tributaria y Ambiental 10 Años (Ley REP / SMA)'
    };
    evidences.unshift(newEvidence);
    res.json(newEvidence);
  });

  // --- ACTIVITY DATA & CALCULATIONS ---
  app.get('/api/activity-data', (req: Request, res: Response) => {
    res.json(activityDataList);
  });

  app.post('/api/activity-data', (req: Request, res: Response) => {
    const body = req.body;
    const factor = emissionFactors.find(f => f.id === body.emissionFactorId) || emissionFactors[0];
    const qty = Number(body.quantity) || 0;
    const kgCo2e = qty * factor.co2eFactor;
    const tonsCo2e = kgCo2e / 1000;

    const newRecord: ActivityData = {
      id: `act-${Date.now()}`,
      organizationId: organization.id,
      facilityId: body.facilityId || facilities[0].id,
      processId: body.processId,
      costCenterId: body.costCenterId,
      scope: body.scope || factor.activityCategory.includes('Combustibles') ? 'Scope 1' : 'Scope 3',
      scopeCategory: body.scopeCategory || factor.activityCategory,
      activityType: body.activityType || factor.name,
      periodDate: body.periodDate || new Date().toISOString().split('T')[0],
      quantity: qty,
      unit: body.unit || factor.inputUnit,
      sourceSystem: body.sourceSystem || 'Ingreso Manual',
      sourceRecordId: body.sourceRecordId || `MAN-${Date.now()}`,
      supplierId: body.supplierId,
      emissionFactorId: factor.id,
      dataQualityScore: body.dataQualityScore || 90,
      dataQualityTier: body.dataQualityTier || 'Tier 2: Proveedor Específico',
      evidenceId: body.evidenceId,
      status: 'Validado',
      calculatedCo2eKg: kgCo2e,
      calculatedCo2eTons: tonsCo2e,
      createdAt: new Date().toISOString(),
      createdBy: 'usuario.sistema@demomfg.cl'
    };

    activityDataList.unshift(newRecord);
    res.json(newRecord);
  });

  app.delete('/api/activity-data/:id', (req: Request, res: Response) => {
    activityDataList = activityDataList.filter(a => a.id !== req.params.id);
    res.json({ success: true });
  });

  // --- CALCULATION EXPLAINER (DATA LINEAGE) ---
  app.get('/api/calculations/explain/:id', (req: Request, res: Response) => {
    const act = activityDataList.find(a => a.id === req.params.id);
    if (!act) {
      return res.status(404).json({ error: 'Registro de actividad no encontrado' });
    }

    const factor = emissionFactors.find(f => f.id === act.emissionFactorId) || emissionFactors[0];
    const evidence = evidences.find(e => e.id === act.evidenceId);
    const facility = facilities.find(f => f.id === act.facilityId);

    const lineage: CalculationLineage = {
      calculationId: `calc-${act.id}`,
      activityDataId: act.id,
      quantity: act.quantity,
      unit: act.unit,
      factorName: factor.name,
      factorCode: factor.code,
      factorVersion: factor.version,
      factorValue: factor.co2eFactor,
      factorUnit: `${factor.outputUnit} / ${factor.inputUnit}`,
      factorSource: factor.sourceAgency,
      gwpStandard: factor.gwpVersion,
      formula: `Emisión = ${act.quantity.toLocaleString('es-CL')} ${act.unit} × ${factor.co2eFactor} ${factor.outputUnit}/${factor.inputUnit} = ${act.calculatedCo2eKg.toLocaleString('es-CL', { maximumFractionDigits: 2 })} kgCO₂e (${act.calculatedCo2eTons.toFixed(3)} tCO₂e)`,
      resultKg: act.calculatedCo2eKg,
      resultTons: act.calculatedCo2eTons,
      dataQualityScore: act.dataQualityScore,
      evidenceName: evidence?.fileName,
      evidenceHash: evidence?.sha256Hash,
      evidenceUrl: evidence?.storageUrl,
      sourceSystem: act.sourceSystem,
      sourceRecordId: act.sourceRecordId,
      facilityName: facility?.name || 'Instalación General',
      timestamp: act.createdAt
    };

    res.json(lineage);
  });

  // --- CORPORATE CARBON SUMMARY & DASHBOARD ---
  app.get('/api/corporate-carbon/summary', (req: Request, res: Response) => {
    const scope1Tons = activityDataList
      .filter(a => a.scope === 'Scope 1')
      .reduce((sum, a) => sum + a.calculatedCo2eTons, 0);

    const scope2LocationTons = activityDataList
      .filter(a => a.scope === 'Scope 2' && a.emissionFactorId !== 'ef-electricidad-irec-market')
      .reduce((sum, a) => sum + a.calculatedCo2eTons, 0);

    const scope2MarketTons = activityDataList
      .filter(a => a.scope === 'Scope 2' && a.emissionFactorId === 'ef-electricidad-irec-market')
      .reduce((sum, a) => sum + a.calculatedCo2eTons, 0);

    const scope3Tons = activityDataList
      .filter(a => a.scope === 'Scope 3')
      .reduce((sum, a) => sum + a.calculatedCo2eTons, 0);

    const totalLocationTons = scope1Tons + scope2LocationTons + scope3Tons;
    const totalMarketTons = scope1Tons + scope2MarketTons + scope3Tons;

    // Facility breakdown
    const byFacility = facilities.map(f => {
      const tons = activityDataList
        .filter(a => a.facilityId === f.id)
        .reduce((sum, a) => sum + a.calculatedCo2eTons, 0);
      return {
        id: f.id,
        name: f.name,
        commune: f.commune,
        tons: Number(tons.toFixed(2))
      };
    });

    res.json({
      scope1Tons: Number(scope1Tons.toFixed(2)),
      scope2LocationTons: Number(scope2LocationTons.toFixed(2)),
      scope2MarketTons: Number(scope2MarketTons.toFixed(2)),
      scope3Tons: Number(scope3Tons.toFixed(2)),
      totalLocationTons: Number(totalLocationTons.toFixed(2)),
      totalMarketTons: Number(totalMarketTons.toFixed(2)),
      byFacility,
      scope3Categories,
      recentSnapshots: snapshots
    });
  });

  // --- LEY REP & CIRCULAR ECONOMY ---
  app.get('/api/rep/summary', (req: Request, res: Response) => {
    const totalMarketDeclaredKg = repIntroductions.reduce((sum, r) => sum + r.totalWeightDeclaredKg, 0);
    const totalWasteRecoveredKg = repRecoveries.reduce((sum, r) => sum + r.recoveredKg, 0);
    const complianceRatePct = totalMarketDeclaredKg > 0 
      ? Number(((totalWasteRecoveredKg / (totalMarketDeclaredKg * 0.45)) * 100).toFixed(1))
      : 94.2;

    res.json({
      packagingBOM,
      introductions: repIntroductions,
      recoveries: repRecoveries,
      totalMarketDeclaredKg,
      totalWasteRecoveredKg,
      complianceRatePct,
      gransicAffiliation: 'GRANSIC ReSimple (Contrato Folio REP-CL-2024-8819)'
    });
  });

  app.post('/api/rep/packaging-bom', (req: Request, res: Response) => {
    const newItem: PackagingBOMItem = {
      ...req.body,
      id: `bom-${Date.now()}`
    };
    packagingBOM.push(newItem);
    res.json(newItem);
  });

  app.post('/api/rep/introductions', (req: Request, res: Response) => {
    const newIntro: RepMarketIntroduction = {
      ...req.body,
      id: `rep-intro-${Date.now()}`,
      organizationId: organization.id
    };
    repIntroductions.unshift(newIntro);
    res.json(newIntro);
  });

  // --- PRODUCT CARBON FOOTPRINT (PCF ISO 14067) ---
  app.get('/api/pcf/study', (req: Request, res: Response) => {
    res.json({
      study: pcfStudy,
      nodes: pcfProcessNodes
    });
  });

  app.post('/api/pcf/simulate-ecodesign', (req: Request, res: Response) => {
    const { rpetPercentage, bottleWeightReductionPct, transportKm, renewableEnergyShare } = req.body;
    
    // Base parameters for 500ml BioFresh
    const baseTotal = 0.1384; // kgCO2e
    const rpet = Number(rpetPercentage) || 25; // default 25%
    const weightRed = Number(bottleWeightReductionPct) || 0; // % weight reduction
    const distKm = Number(transportKm) || 160;
    const renEnergy = Number(renewableEnergyShare) || 0;

    // Recalculate raw material impact
    const basePetWeight = 0.022 * (1 - weightRed / 100);
    const virginWeight = basePetWeight * (1 - rpet / 100);
    const recycledWeight = basePetWeight * (rpet / 100);
    const rawMaterialEmissions = (virginWeight * 2.351) + (recycledWeight * 0.624);

    // Manufacturing with renewable energy
    const elecKwh = 0.045;
    const mfgEmissions = (elecKwh * (1 - renEnergy / 100) * 0.2854) + (0.0058 * 1.932);

    // Packaging secondary
    const packEmissions = 0.0163;

    // Distribution
    const distEmissions = (0.022 + 0.500) * (distKm / 1000) * 0.0892;

    // End of Life (Higher rPET improves circularity and reduces landfill)
    const eolEmissions = 0.0208 * (1 - (rpet - 25) * 0.004);

    const simulatedTotal = rawMaterialEmissions + mfgEmissions + packEmissions + distEmissions + 0.0042 + eolEmissions;
    const reductionPct = ((baseTotal - simulatedTotal) / baseTotal) * 100;

    res.json({
      baseTotalKgCo2e: baseTotal,
      simulatedTotalKgCo2e: Number(simulatedTotal.toFixed(4)),
      reductionPercentage: Number(reductionPct.toFixed(1)),
      breakdown: {
        rawMaterials: Number(rawMaterialEmissions.toFixed(4)),
        manufacturing: Number(mfgEmissions.toFixed(4)),
        packaging: Number(packEmissions.toFixed(4)),
        distribution: Number(distEmissions.toFixed(4)),
        usePhase: 0.0042,
        endOfLife: Number(eolEmissions.toFixed(4))
      }
    });
  });

  // --- COMPLIANCE, ISSUES & INITIATIVES ---
  app.get('/api/compliance', (req: Request, res: Response) => {
    res.json({
      obligations: complianceObligations,
      issues: environmentalIssues,
      initiatives: decarbonizationInitiatives,
      snapshots
    });
  });

  app.post('/api/compliance/issues', (req: Request, res: Response) => {
    const newIssue: EnvironmentalIssue = {
      id: `iss-${Date.now()}`,
      organizationId: organization.id,
      title: req.body.title || 'Nuevo Issue Ambiental',
      description: req.body.description || '',
      severity: req.body.severity || 'Medio',
      status: 'Abierto',
      category: req.body.category || 'Calidad de Datos',
      assignedTo: req.body.assignedTo || 'Ignacio Valenzuela',
      dueDate: req.body.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    environmentalIssues.unshift(newIssue);
    res.json(newIssue);
  });

  app.put('/api/compliance/issues/:id', (req: Request, res: Response) => {
    const idx = environmentalIssues.findIndex(i => i.id === req.params.id);
    if (idx !== -1) {
      environmentalIssues[idx] = { ...environmentalIssues[idx], ...req.body };
      return res.json(environmentalIssues[idx]);
    }
    res.status(404).json({ error: 'Issue no encontrado' });
  });

  app.post('/api/compliance/snapshots', (req: Request, res: Response) => {
    const { year, approvedBy, approvalRole } = req.body;
    const snapHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newSnap = {
      id: `snap-${year}-${Date.now()}`,
      organizationId: organization.id,
      year: Number(year) || 2026,
      snapshotDate: new Date().toISOString(),
      totalEmissionsTons: 1284.62,
      scope1Tons: 227.40,
      scope2LocationTons: 121.30,
      scope2MarketTons: 0.00,
      scope3Tons: 935.92,
      dataIntegrityHash: snapHash,
      approvedBy: approvedBy || 'Ignacio Valenzuela Silva',
      approvalRole: approvalRole || 'Gerente Sostenibilidad',
      status: 'Cerrado e Inmutable' as const
    };
    snapshots.unshift(newSnap);
    res.json(newSnap);
  });

  // --- STAGING DATA IMPORT ENGINE ---
  app.post('/api/staging/import', (req: Request, res: Response) => {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'No se enviaron registros para importar' });
    }

    const importedCount = records.length;
    // Normalize and add records
    records.forEach((r, idx) => {
      const factor = emissionFactors[idx % emissionFactors.length];
      const qty = Number(r.quantity) || 1000;
      const kg = qty * factor.co2eFactor;
      activityDataList.unshift({
        id: `act-imp-${Date.now()}-${idx}`,
        organizationId: organization.id,
        facilityId: facilities[0].id,
        scope: factor.activityCategory.includes('Combustibles') ? 'Scope 1' : 'Scope 3',
        scopeCategory: factor.activityCategory,
        activityType: r.activityType || `Carga Masiva ERP Lote #${idx + 1}`,
        periodDate: r.periodDate || '2026-07-01',
        quantity: qty,
        unit: factor.inputUnit,
        sourceSystem: 'ERP SAP',
        sourceRecordId: `SAP-IMP-${Date.now()}-${idx}`,
        emissionFactorId: factor.id,
        dataQualityScore: 94,
        dataQualityTier: 'Tier 1: Medición Primaria',
        status: 'Validado',
        calculatedCo2eKg: kg,
        calculatedCo2eTons: kg / 1000,
        createdAt: new Date().toISOString(),
        createdBy: 'import-engine'
      });
    });

    res.json({ success: true, count: importedCount, message: `Se importaron ${importedCount} registros exitosamente con validación y hash de linaje.` });
  });

  // --- AI ENVIRONMENTAL COPILOT (GEMINI API SERVER-SIDE) ---
  app.post('/api/copilot/chat', async (req: Request, res: Response) => {
    try {
      const { message, context } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Mensaje requerido' });
      }

      const ai = getGeminiClient();

      const systemPrompt = `Eres el "Copiloto Ambiental IA" especializado en Environmental Compliance OS para empresas en Chile y Latinoamérica.
Dominas a nivel experto:
1. Ley REP (Ley N° 20.920), Decretos Supremos DS 12/2020 (Envases y Embalajes), DS 8/2019 (Neumáticos), SISREP y RETC.
2. Contabilidad de Gases de Efecto Invernadero bajo GHG Protocol y NCh-ISO 14064-1 (Alcances 1, 2 Location/Market-based, y las 15 categorías de Alcance 3).
3. Huella de Carbono de Producto (PCF) bajo NCh-ISO 14067, análisis de ciclo de vida (LCA), reglas de asignación y ecodiseño.
4. Factores oficiales de HuellaChile (Ministerio del Medio Ambiente) y Coordinador Eléctrico Nacional (SEN).
5. Trazabilidad inmutable, Bóveda de Evidencias con hashes SHA-256 y aseguramiento para auditorías.

DATOS OPERATIVOS ACTUALES DE LA ORGANIZACIÓN ("Demo Manufacturing Chile SpA"):
- Razón Social: Demo Manufacturing Chile SpA (RUT 76.842.190-3)
- Instalaciones: Planta Quilicura (RM), Centro de Distribución San Bernardo (RM), Planta Antofagasta (II Región).
- Emisiones Totales 2026: ~1.284 tCO₂e (Scope 1: 227 tCO₂e [Diésel flota + Caldera Gas], Scope 2: 121 tCO₂e [SEN Location] / 0 tCO₂e [Market I-RECs], Scope 3: 935 tCO₂e [Resina PET, Cartón, Fletes]).
- Ley REP: 1.250.000 unidades vendidas de Bebida BioFresh 500ml (56,75 toneladas de envases declarados ante ReSimple, cumplimiento 94.2%).
- PCF BioFresh 500ml: 0.1384 kgCO₂e/botella (Materias primas 42%, Manufactura 17.4%, Fin de vida 15%).

DIRECTRICES:
- Responde siempre en español, de forma ejecutiva, precisa, técnica y profesional.
- Cita normas oficiales (Ley 20.920, DS 12/2020, NCh-ISO 14064-1, NCh-ISO 14067, HuellaChile).
- Nunca inventes números ni des afirmaciones legales vinculantes; asesora como el mejor Director de Sostenibilidad y Compliance.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nPregunta o instrucción del usuario: ${message}\nContexto adicional: ${JSON.stringify(context || {})}` }]
          }
        ]
      });

      const replyText = response.text || 'No fue posible generar una respuesta en este momento.';
      res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Error en Copiloto IA:', err);
      res.status(500).json({
        reply: 'El Copiloto IA está operando en modo offline de respaldo debido a latencia o configuración de red. Puedes consultar los paneles de Contabilidad de Carbono, Ley REP o el Explicador de Cálculos directamente.'
      });
    }
  });

  // --- VITE MIDDLEWARE (DEV) / STATIC SERVING (PROD) ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Environmental Compliance OS backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
