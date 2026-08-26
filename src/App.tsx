import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavViewId } from './components/Sidebar';
import { ControlCenterView } from './components/ControlCenterView';
import { CorporateCarbonView } from './components/CorporateCarbonView';
import { RepComplianceView } from './components/RepComplianceView';
import { ProductCarbonView } from './components/ProductCarbonView';
import { ActivityDataView } from './components/ActivityDataView';
import { EvidenceVaultView } from './components/EvidenceVaultView';
import { ComplianceCalendarView } from './components/ComplianceCalendarView';
import { AuditWorkspaceView } from './components/AuditWorkspaceView';
import { ExplainCalculationModal } from './components/ExplainCalculationModal';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import {
  initialTenant,
  initialOrganization,
  initialFacilities,
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
} from './data/initialData';
import {
  Organization,
  Facility,
  EmissionFactor,
  EvidenceDocument,
  ActivityData,
  Scope3CategoryInfo,
  PackagingBOMItem,
  RepMarketIntroduction,
  RepWasteRecoveryRecord,
  ProductCarbonStudy,
  PcfProcessNode,
  ComplianceObligation,
  EnvironmentalIssue,
  DecarbonizationInitiative,
  InventorySnapshot,
  CalculationLineage
} from './types';

export function App() {
  const [currentView, setCurrentView] = useState<NavViewId>('control-center');
  const [organization, setOrganization] = useState<Organization>(initialOrganization);
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>(initialEmissionFactors);
  const [evidences, setEvidences] = useState<EvidenceDocument[]>(initialEvidences);
  const [activityData, setActivityData] = useState<ActivityData[]>(initialActivityData);
  const [scope3Categories, setScope3Categories] = useState<Scope3CategoryInfo[]>(initialScope3Categories);
  const [packagingBOM, setPackagingBOM] = useState<PackagingBOMItem[]>(initialPackagingBOM);
  const [repIntroductions, setRepIntroductions] = useState<RepMarketIntroduction[]>(initialRepMarketIntroductions);
  const [repRecoveries, setRepRecoveries] = useState<RepWasteRecoveryRecord[]>(initialRepWasteRecoveries);
  const [pcfStudy, setPcfStudy] = useState<ProductCarbonStudy>(initialPcfStudy);
  const [pcfProcessNodes, setPcfProcessNodes] = useState<PcfProcessNode[]>(initialPcfProcessNodes);
  const [obligations, setObligations] = useState<ComplianceObligation[]>(initialComplianceObligations);
  const [issues, setIssues] = useState<EnvironmentalIssue[]>(initialEnvironmentalIssues);
  const [initiatives, setInitiatives] = useState<DecarbonizationInitiative[]>(initialDecarbonizationInitiatives);
  const [snapshots, setSnapshots] = useState<InventorySnapshot[]>(initialSnapshots);

  // Modals & Drawers State
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [selectedLineage, setSelectedLineage] = useState<CalculationLineage | null>(null);

  // Fetch API summaries / Initial sync
  useEffect(() => {
    fetch('/api/corporate-carbon/summary')
      .then(res => res.json())
      .catch(() => {});
  }, []);

  // Handlers
  const handleExplainCalculation = async (actId: string) => {
    try {
      const res = await fetch(`/api/calculations/explain/${actId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedLineage(data);
        return;
      }
    } catch (e) {
      console.error('Error fetching calculation lineage:', e);
    }

    // Fallback lineage computation on client
    const act = activityData.find(a => a.id === actId) || activityData[0];
    const factor = emissionFactors.find(f => f.id === act.emissionFactorId) || emissionFactors[0];
    const evi = evidences.find(e => e.id === act.evidenceId);
    const fac = facilities.find(f => f.id === act.facilityId);

    setSelectedLineage({
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
      evidenceName: evi?.fileName,
      evidenceHash: evi?.sha256Hash,
      evidenceUrl: evi?.storageUrl,
      sourceSystem: act.sourceSystem,
      sourceRecordId: act.sourceRecordId,
      facilityName: fac?.name || 'Planta Quilicura',
      timestamp: act.createdAt
    });
  };

  const handleAddSingleActivityRecord = async (newRec: any) => {
    const factor = emissionFactors.find(f => f.id === newRec.emissionFactorId) || emissionFactors[0];
    const kg = Number(newRec.quantity) * factor.co2eFactor;
    const tons = kg / 1000;

    const created: ActivityData = {
      id: `act-${Date.now()}`,
      organizationId: organization.id,
      facilityId: newRec.facilityId,
      scope: factor.activityCategory.includes('Combustibles') ? 'Scope 1' : 'Scope 3',
      scopeCategory: factor.activityCategory,
      activityType: newRec.activityType,
      periodDate: newRec.periodDate,
      quantity: Number(newRec.quantity),
      unit: newRec.unit,
      sourceSystem: newRec.sourceSystem,
      sourceRecordId: newRec.sourceRecordId,
      emissionFactorId: factor.id,
      dataQualityScore: newRec.dataQualityScore,
      dataQualityTier: newRec.dataQualityTier,
      status: 'Validado',
      calculatedCo2eKg: kg,
      calculatedCo2eTons: tons,
      createdAt: new Date().toISOString(),
      createdBy: 'usuario.demo@demomfg.cl'
    };

    setActivityData(prev => [created, ...prev]);
  };

  const handleImportBatch = (batch: any[]) => {
    batch.forEach((r, idx) => {
      const factor = emissionFactors[idx % emissionFactors.length];
      const qty = Number(r.quantity) || 5000;
      const kg = qty * factor.co2eFactor;
      const newAct: ActivityData = {
        id: `act-imp-${Date.now()}-${idx}`,
        organizationId: organization.id,
        facilityId: facilities[0].id,
        scope: factor.activityCategory.includes('Combustibles') ? 'Scope 1' : 'Scope 3',
        scopeCategory: factor.activityCategory,
        activityType: r.activityType,
        periodDate: r.periodDate,
        quantity: qty,
        unit: factor.inputUnit,
        sourceSystem: 'ERP SAP',
        sourceRecordId: `SAP-IMP-${Date.now()}-${idx}`,
        emissionFactorId: factor.id,
        dataQualityScore: 95,
        dataQualityTier: 'Tier 1: Medición Primaria',
        status: 'Validado',
        calculatedCo2eKg: kg,
        calculatedCo2eTons: kg / 1000,
        createdAt: new Date().toISOString(),
        createdBy: 'import-pipeline'
      };
      setActivityData(prev => [newAct, ...prev]);
    });
  };

  const handleUploadEvidence = (doc: { fileName: string; category: any; issuerName: string; issuerTaxId: string }) => {
    const simulatedHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newEvidence: EvidenceDocument = {
      id: `evi-${Date.now()}`,
      organizationId: organization.id,
      fileName: doc.fileName,
      fileType: 'application/pdf',
      fileSizeBytes: 345200,
      sha256Hash: simulatedHash,
      category: doc.category,
      documentDate: new Date().toISOString().split('T')[0],
      issuerName: doc.issuerName,
      issuerTaxId: doc.issuerTaxId,
      isVerified: true,
      verifiedBy: 'maria.analista@demomfg.cl',
      verifiedAt: new Date().toISOString(),
      storageUrl: `/storage/evidences/${doc.fileName}`,
      retentionPolicy: 'Retención Tributaria y Ambiental 10 Años (Ley REP / SMA)'
    };
    setEvidences(prev => [newEvidence, ...prev]);
  };

  const handleAddBOMItem = (item: Partial<PackagingBOMItem>) => {
    const newItem: PackagingBOMItem = {
      id: `bom-${Date.now()}`,
      productSku: item.productSku || 'SKU-BIOFRESH-500ML',
      productName: item.productName || 'Bebida BioFresh 500ml',
      componentName: item.componentName || 'Componente',
      tier: item.tier || 'Envase Primario',
      priorityProduct: 'Envases y Embalajes',
      subcategory: item.subcategory || 'Domiciliario',
      materialType: item.materialType || 'Plásticos PET',
      weightGrams: item.weightGrams || 10,
      recycledContentPct: item.recycledContentPct || 0,
      isHazardous: false,
      isRecyclable: true,
      emissionFactorPerKg: item.emissionFactorPerKg || 2.351
    };
    setPackagingBOM(prev => [...prev, newItem]);
  };

  const handleAddIssue = (issue: Partial<EnvironmentalIssue>) => {
    const newIss: EnvironmentalIssue = {
      id: `iss-${Date.now()}`,
      organizationId: organization.id,
      title: issue.title || 'Issue Ambiental',
      description: issue.description || '',
      severity: issue.severity || 'Medio',
      status: 'Abierto',
      category: issue.category || 'Calidad de Datos',
      assignedTo: issue.assignedTo || 'Ignacio Valenzuela',
      dueDate: issue.dueDate || '2026-08-30',
      createdAt: new Date().toISOString()
    };
    setIssues(prev => [newIss, ...prev]);
  };

  const handleUpdateIssueStatus = (id: string, status: any) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const handleCreateSnapshot = (year: number, approvedBy: string, role: string) => {
    const snapHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newSnap: InventorySnapshot = {
      id: `snap-${year}-${Date.now()}`,
      organizationId: organization.id,
      year,
      snapshotDate: new Date().toISOString(),
      totalEmissionsTons: 1284.62,
      scope1Tons: 227.40,
      scope2LocationTons: 121.30,
      scope2MarketTons: 0.00,
      scope3Tons: 935.92,
      dataIntegrityHash: snapHash,
      approvedBy,
      approvalRole: role,
      status: 'Cerrado e Inmutable'
    };
    setSnapshots(prev => [newSnap, ...prev]);
  };

  const handleDownloadAuditPackage = () => {
    const auditPackage = {
      metadata: {
        packageId: `AUDIT-PKG-${organization.taxId}-${Date.now()}`,
        generationDate: new Date().toISOString(),
        standard: 'NCh-ISO 14064-1:2019 / NCh-ISO 14067:2018 / Ley 20.920 REP',
        organization: organization,
        facilities: facilities
      },
      inventorySummary: {
        reportingPeriod: 2026,
        scope1Tons: 227.40,
        scope2LocationTons: 121.30,
        scope2MarketTons: 0.00,
        scope3Tons: 935.92,
        totalTons: 1284.62
      },
      activityDataLedger: activityData,
      emissionFactorsVersioned: emissionFactors,
      evidencesManifest: evidences.map(e => ({
        fileName: e.fileName,
        category: e.category,
        sha256Hash: e.sha256Hash,
        verifiedAt: e.verifiedAt,
        issuerTaxId: e.issuerTaxId
      })),
      repDeclarations: repIntroductions,
      pcfStudy: pcfStudy
    };

    const blob = new Blob([JSON.stringify(auditPackage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Paquete_Auditoria_Oficial_${organization.legalName.replace(/\s+/g, '_')}_2026.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Carbon Aggregations
  const scope1Tons = activityData.filter(a => a.scope === 'Scope 1').reduce((s, a) => s + a.calculatedCo2eTons, 0);
  const scope2LocationTons = activityData.filter(a => a.scope === 'Scope 2' && a.emissionFactorId !== 'ef-electricidad-irec-market').reduce((s, a) => s + a.calculatedCo2eTons, 0);
  const scope2MarketTons = activityData.filter(a => a.scope === 'Scope 2' && a.emissionFactorId === 'ef-electricidad-irec-market').reduce((s, a) => s + a.calculatedCo2eTons, 0);
  const scope3Tons = activityData.filter(a => a.scope === 'Scope 3').reduce((s, a) => s + a.calculatedCo2eTons, 0);
  const totalLocationTons = scope1Tons + scope2LocationTons + scope3Tons;
  const totalMarketTons = scope1Tons + scope2MarketTons + scope3Tons;

  const byFacility = facilities.map(f => {
    const tons = activityData
      .filter(a => a.facilityId === f.id)
      .reduce((sum, a) => sum + a.calculatedCo2eTons, 0);
    return {
      id: f.id,
      name: f.name,
      commune: f.commune,
      tons: Number(tons.toFixed(2))
    };
  });

  const totalMarketDeclaredKg = repIntroductions.reduce((s, r) => s + r.totalWeightDeclaredKg, 0);
  const totalWasteRecoveredKg = repRecoveries.reduce((s, r) => s + r.recoveredKg, 0);
  const complianceRatePct = 94.2;

  const openIssuesCount = issues.filter(i => i.status !== 'Resuelto').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        organization={organization}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenAuditModal={() => setCurrentView('audit-workspace')}
        onOpenImportModal={() => setCurrentView('activity-data')}
        complianceScore={89}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          openIssuesCount={openIssuesCount}
        />

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {currentView === 'control-center' && (
            <ControlCenterView
              organization={organization}
              carbonSummary={{
                scope1Tons,
                scope2LocationTons,
                scope2MarketTons,
                scope3Tons,
                totalLocationTons,
                totalMarketTons,
                byFacility
              }}
              repSummary={{
                totalMarketDeclaredKg,
                totalWasteRecoveredKg,
                complianceRatePct
              }}
              pcfStudy={pcfStudy}
              obligations={obligations}
              issues={issues}
              onNavigate={setCurrentView}
              onExplainCalculation={handleExplainCalculation}
            />
          )}

          {currentView === 'corporate-carbon' && (
            <CorporateCarbonView
              activityData={activityData}
              scope3Categories={scope3Categories}
              initiatives={initiatives}
              facilities={facilities}
              emissionFactors={emissionFactors}
              onExplainCalculation={handleExplainCalculation}
              onNewActivityRecord={() => setCurrentView('activity-data')}
            />
          )}

          {currentView === 'rep-compliance' && (
            <RepComplianceView
              organization={organization}
              packagingBOM={packagingBOM}
              introductions={repIntroductions}
              recoveries={repRecoveries}
              onAddPackagingBOMItem={handleAddBOMItem}
              onAddMarketIntro={() => {}}
            />
          )}

          {currentView === 'product-carbon' && (
            <ProductCarbonView
              study={pcfStudy}
              nodes={pcfProcessNodes}
              onExplainCalculation={handleExplainCalculation}
            />
          )}

          {currentView === 'activity-data' && (
            <ActivityDataView
              activityData={activityData}
              facilities={facilities}
              emissionFactors={emissionFactors}
              onExplainCalculation={handleExplainCalculation}
              onImportBatch={handleImportBatch}
              onAddSingleRecord={handleAddSingleActivityRecord}
            />
          )}

          {currentView === 'evidence-vault' && (
            <EvidenceVaultView
              evidences={evidences}
              organization={organization}
              onUploadEvidence={handleUploadEvidence}
            />
          )}

          {currentView === 'compliance-calendar' && (
            <ComplianceCalendarView
              obligations={obligations}
              issues={issues}
              snapshots={snapshots}
              organization={organization}
              onAddIssue={handleAddIssue}
              onUpdateIssueStatus={handleUpdateIssueStatus}
              onCreateSnapshot={handleCreateSnapshot}
            />
          )}

          {currentView === 'audit-workspace' && (
            <AuditWorkspaceView
              organization={organization}
              activityData={activityData}
              evidences={evidences}
              emissionFactors={emissionFactors}
              packagingBOM={packagingBOM}
              snapshots={snapshots}
              onExplainCalculation={handleExplainCalculation}
              onDownloadAuditPackage={handleDownloadAuditPackage}
            />
          )}
        </main>
      </div>

      {/* Global Modals & AI Drawer */}
      <ExplainCalculationModal
        lineage={selectedLineage}
        onClose={() => setSelectedLineage(null)}
      />

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </div>
  );
}

export default App;
