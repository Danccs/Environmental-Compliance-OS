import React, { useState } from 'react';
import { 
  Recycle, 
  Package, 
  FileSpreadsheet, 
  Download, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  AlertCircle, 
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { 
  PackagingBOMItem, 
  RepMarketIntroduction, 
  RepWasteRecoveryRecord,
  Organization 
} from '../types';

interface RepComplianceViewProps {
  organization: Organization;
  packagingBOM: PackagingBOMItem[];
  introductions: RepMarketIntroduction[];
  recoveries: RepWasteRecoveryRecord[];
  onAddPackagingBOMItem: (item: Partial<PackagingBOMItem>) => void;
  onAddMarketIntro: (intro: Partial<RepMarketIntroduction>) => void;
}

export const RepComplianceView: React.FC<RepComplianceViewProps> = ({
  organization,
  packagingBOM,
  introductions,
  recoveries,
  onAddPackagingBOMItem,
  onAddMarketIntro
}) => {
  const [activeTab, setActiveTab] = useState<'bom' | 'declarations' | 'recovery' | 'sisrep'>('bom');
  const [showAddBOMModal, setShowAddBOMModal] = useState(false);
  const [newBOMItem, setNewBOMItem] = useState({
    productSku: 'SKU-BIOFRESH-500ML',
    productName: 'Bebida Isotónica BioFresh Citrus 500ml',
    componentName: '',
    tier: 'Envase Primario' as const,
    priorityProduct: 'Envases y Embalajes' as const,
    subcategory: 'Domiciliario' as const,
    materialType: 'Plásticos PET' as const,
    weightGrams: 10,
    recycledContentPct: 0,
    isHazardous: false,
    isRecyclable: true,
    emissionFactorPerKg: 2.351
  });

  const totalIntroducedKg = introductions.reduce((s, i) => s + i.totalWeightDeclaredKg, 0);
  const totalRecoveredKg = recoveries.reduce((s, r) => s + r.recoveredKg, 0);

  // Group BOM by SKU
  const totalSkuWeight = packagingBOM.reduce((s, b) => s + b.weightGrams, 0);

  // Generate SISREP CSV Dataset String
  const generateSisrepCSV = () => {
    const headers = 'RUT_EMPRESA,ANO_DECLARACION,MES,CODIGO_SKU,NOMBRE_PRODUCTO,CATEGORIA_REP,SUBCATEGORIA,TIPO_MATERIAL,PESO_UNITARIO_G,UNIDADES_COMERCIALIZADAS,PESO_TOTAL_KG,PCT_RECICLADO\n';
    const rows = introductions.flatMap(intro => 
      intro.breakdownByMaterial.map(mat => 
        `"${organization.taxId}",${intro.periodYear},${intro.periodMonth},"${intro.productSku}","${intro.productName}","Envases y Embalajes","${mat.subcategory}","${mat.material}","${(mat.totalKg / intro.unitsSold * 1000).toFixed(2)}",${intro.unitsSold},${mat.totalKg.toFixed(2)},${((mat.recycledKg / mat.totalKg) * 100).toFixed(1)}`
      )
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SISREP_Declaracion_REP_2026_${organization.taxId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ley REP & Economía Circular</h2>
            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
              Ley N° 20.920 &middot; DS 12/2020 MMA
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gestión de Productos Prioritarios, Packaging BOM, declaraciones mensuales y exportador SISREP-ready para Ventanilla Única RETC.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bom')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bom' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Packaging BOM
          </button>
          <button
            onClick={() => setActiveTab('declarations')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'declarations' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Introducción Mercado
          </button>
          <button
            onClick={() => setActiveTab('recovery')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'recovery' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Valorización
          </button>
          <button
            onClick={() => setActiveTab('sisrep')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sisrep' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Exportador SISREP
          </button>
        </div>
      </div>

      {/* Top REP KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Envases Puestos en Mercado</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-3xl font-bold text-slate-900 mt-2">
              {(totalIntroducedKg / 1000).toFixed(2)} <span className="text-base font-normal text-slate-500">t netas</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">Consolidado 2026 derivado de ventas ERP</p>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Residuos Valorizados</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Recycle className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-3xl font-bold text-emerald-600 mt-2">
              {(totalRecoveredKg / 1000).toFixed(2)} <span className="text-base font-normal text-slate-500">t certificadas</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">Acreditadas mediante GRANSIC ReSimple</p>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sistema de Gestión (GRANSIC)</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-slate-900 mt-2">GRANSIC ReSimple</h4>
          </div>
          <p className="text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">Folio: REP-CL-2024-8819</p>
        </div>
      </div>

      {/* TAB 1: PACKAGING BOM */}
      {activeTab === 'bom' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">Environmental Product Packaging BOM</h3>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full">
                  Reutilización Cruzada (REP + PCF)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                SKU: <strong className="text-slate-800 font-mono">SKU-BIOFRESH-500ML</strong> &middot; Bebida Isotónica BioFresh Citrus 500ml &middot; Peso Total Envase: <strong>{totalSkuWeight.toFixed(1)}g</strong>
              </p>
            </div>

            <button
              onClick={() => setShowAddBOMModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar Componente
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Jerarquía</th>
                  <th className="px-5 py-3.5">Componente</th>
                  <th className="px-5 py-3.5">Subcategoría Ley REP</th>
                  <th className="px-5 py-3.5">Material</th>
                  <th className="px-5 py-3.5 text-right">Peso Unitario</th>
                  <th className="px-5 py-3.5 text-right">% Reciclado</th>
                  <th className="px-5 py-3.5">Factor CO₂e</th>
                  <th className="px-5 py-3.5 text-center">Reciclabilidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packagingBOM.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                        {item.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {item.componentName}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        item.subcategory === 'Domiciliario' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/60' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                      }`}>
                        {item.subcategory}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {item.materialType}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
                      {item.weightGrams} g
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-emerald-600 font-bold">
                      {item.recycledContentPct}%
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-500">
                      {item.emissionFactorPerKg} kgCO₂e/kg
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        100% Reciclable
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MARKET INTRODUCTIONS */}
      {activeTab === 'declarations' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Libro Mensual de Introducción al Mercado (Ventas ERP)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kilogramos brutos y netos puestos en el territorio nacional</p>
          </div>

          <div className="space-y-4">
            {introductions.map((intro) => (
              <div key={intro.id} className="p-5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Periodo {intro.periodMonth}/{intro.periodYear}</span>
                    <span className="text-xs text-slate-500 font-mono">({intro.unitsSold.toLocaleString('es-CL')} unidades)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-200">
                      Total: {intro.totalWeightDeclaredKg.toLocaleString('es-CL')} kg
                    </span>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {intro.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {intro.breakdownByMaterial.map((m, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-100 text-xs flex justify-between items-center shadow-2xs">
                      <div>
                        <p className="font-bold text-slate-800">{m.material}</p>
                        <p className="text-[10px] text-slate-400">{m.subcategory}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-slate-900">{m.totalKg.toLocaleString('es-CL')} kg</p>
                        {m.recycledKg > 0 && (
                          <p className="text-[10px] text-emerald-600 font-medium">({m.recycledKg.toLocaleString('es-CL')} kg rPET)</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RECOVERY & TRACEABILITY */}
      {activeTab === 'recovery' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Trazabilidad de Valorización & Certificados</h3>
            <p className="text-xs text-slate-500 mt-0.5">Acreditación documental con RUT de instalaciones receptoras autorizadas por SMA</p>
          </div>

          <div className="space-y-3">
            {recoveries.map(rec => (
              <div key={rec.id} className="p-5 bg-slate-50/60 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {rec.treatmentType}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900">{rec.materialType} ({rec.subcategory})</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Gestor: <strong>{rec.wasteManagerName}</strong> (RUT: {rec.wasteManagerTaxId})
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Certificado Folio: {rec.trackingCertificateNumber}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-emerald-600 font-mono">{rec.recoveredKg.toLocaleString('es-CL')} kg</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2.5 py-0.5 bg-blue-600 text-white rounded-full">
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SISREP-READY EXPORTER */}
      {activeTab === 'sisrep' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-blue-50/50 border border-blue-200/70 rounded-2xl p-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Exportador Oficial SISREP (Ventanilla Única RETC)</h3>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Genera la matriz normalizada compatible con las especificaciones del Sistema de Información Simplificado de la Ley REP (MMA) para carga masiva o declaración directa.
              </p>
            </div>

            <button
              onClick={generateSisrepCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              Descargar Dataset SISREP (.CSV)
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Previsualización de Estructura de Datos SISREP
            </h4>
            <div className="bg-slate-900 text-slate-200 p-5 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              <p className="text-emerald-400 font-bold"># Formato RETC - Ley 20.920 DS 12/2020 MMA</p>
              <p className="text-slate-400">RUT_EMPRESA,ANO,MES,CODIGO_SKU,CATEGORIA,SUBCATEGORIA,MATERIAL,PESO_TOTAL_KG,PCT_RECICLADO</p>
              <p className="text-white">"{organization.taxId}",2026,7,"SKU-BIOFRESH-500ML","Envases","Domiciliario","Plásticos PET",27500.00,25.0</p>
              <p className="text-white">"{organization.taxId}",2026,7,"SKU-BIOFRESH-500ML","Envases","Domiciliario","Plásticos PP",2750.00,0.0</p>
              <p className="text-white">"{organization.taxId}",2026,7,"SKU-BIOFRESH-500ML","Envases","No Domiciliario","Papel y Cartón",23125.00,65.0</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add BOM Item */}
      {showAddBOMModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Agregar Componente a Packaging BOM</h3>
              <button onClick={() => setShowAddBOMModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre Componente</label>
                <input
                  type="text"
                  placeholder="ej. Tapa SportCap 28mm"
                  value={newBOMItem.componentName}
                  onChange={(e) => setNewBOMItem({ ...newBOMItem, componentName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jerarquía</label>
                  <select
                    value={newBOMItem.tier}
                    onChange={(e: any) => setNewBOMItem({ ...newBOMItem, tier: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Envase Primario">Envase Primario</option>
                    <option value="Envase Secundario">Envase Secundario</option>
                    <option value="Envase Terciario">Envase Terciario</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subcategoría REP</label>
                  <select
                    value={newBOMItem.subcategory}
                    onChange={(e: any) => setNewBOMItem({ ...newBOMItem, subcategory: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Domiciliario">Domiciliario</option>
                    <option value="No Domiciliario">No Domiciliario</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Material</label>
                  <select
                    value={newBOMItem.materialType}
                    onChange={(e: any) => setNewBOMItem({ ...newBOMItem, materialType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Plásticos PET">Plásticos PET</option>
                    <option value="Plásticos PP">Plásticos PP</option>
                    <option value="Plásticos PEBD">Plásticos PEBD</option>
                    <option value="Papel y Cartón">Papel y Cartón</option>
                    <option value="Vidrio">Vidrio</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Peso Unitario (Gramos)</label>
                  <input
                    type="number"
                    value={newBOMItem.weightGrams}
                    onChange={(e) => setNewBOMItem({ ...newBOMItem, weightGrams: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddBOMModal(false)}
                className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onAddPackagingBOMItem(newBOMItem);
                  setShowAddBOMModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
              >
                Guardar Componente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
