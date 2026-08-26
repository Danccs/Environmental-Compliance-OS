import React, { useState } from 'react';
import { 
  Database, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Filter, 
  Search, 
  Plus, 
  ShieldCheck,
  Building2,
  FileCheck
} from 'lucide-react';
import { ActivityData, Facility, EmissionFactor } from '../types';

interface ActivityDataViewProps {
  activityData: ActivityData[];
  facilities: Facility[];
  emissionFactors: EmissionFactor[];
  onExplainCalculation: (actId: string) => void;
  onImportBatch: (records: any[]) => void;
  onAddSingleRecord: (record: any) => void;
}

export const ActivityDataView: React.FC<ActivityDataViewProps> = ({
  activityData,
  facilities,
  emissionFactors,
  onExplainCalculation,
  onImportBatch,
  onAddSingleRecord
}) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [scopeFilter, setScopeFilter] = useState('all');

  // New Record Form State
  const [newRec, setNewRec] = useState({
    facilityId: facilities[0]?.id || 'fac-001',
    scope: 'Scope 1' as const,
    scopeCategory: 'Combustión Estacionaria (Calderas)',
    activityType: 'Consumo Gas Natural Caldera Vapor',
    periodDate: '2026-07-01',
    quantity: 1000,
    unit: 'm³',
    sourceSystem: 'ERP SAP',
    sourceRecordId: 'DOC-SAP-2026-99',
    emissionFactorId: emissionFactors[0]?.id || 'ef-gas-natural-estacionario',
    dataQualityScore: 92,
    dataQualityTier: 'Tier 1: Medición Primaria' as const
  });

  const filtered = activityData.filter(a => {
    if (scopeFilter !== 'all' && a.scope !== scopeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.activityType.toLowerCase().includes(q) || a.sourceRecordId.toLowerCase().includes(q) || a.sourceSystem.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSimulatedCSVUpload = () => {
    // Generate simulated batch records for import
    const batch = [
      { activityType: 'Factura Mensual Gas Natural Metrogas Lote 1', quantity: 24250, periodDate: '2026-07-15' },
      { activityType: 'Guía Despacho Diésel Flota Reparto San Bernardo', quantity: 18200, periodDate: '2026-07-20' },
      { activityType: 'Consumo Eléctrico Enel Distribución Planta Quilicura', quantity: 198000, periodDate: '2026-07-31' },
      { activityType: 'Recepción Materia Prima Resina rPET 100%', quantity: 15400, periodDate: '2026-07-28' }
    ];
    onImportBatch(batch);
    setShowImportModal(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Datos de Actividad & Staging</h2>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              Sistema de Registro Inmutable
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Normalización de entradas desde ERP SAP / Softland, facturación de combustibles, medidores IoT y guías de despacho.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <UploadCloud className="w-4 h-4 text-slate-500" />
            Importación Masiva (CSV)
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ingresar Registro
          </button>
        </div>
      </div>

      {/* Data Quality Tier Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tier 1: Primario</span>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200/60">95-100</span>
          </div>
          <p className="text-xs text-slate-500">Medidores calibrados, telemetría y facturas fiscales directas.</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Tier 2: Proveedor</span>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200/60">85-94</span>
          </div>
          <p className="text-xs text-slate-500">Declaraciones y EPDs certificadas por proveedores de insumos.</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Tier 3: Nacional</span>
            <span className="text-[10px] font-mono bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200/60">70-84</span>
          </div>
          <p className="text-xs text-slate-500">Factores oficiales de HuellaChile / Coordinador Eléctrico Nacional.</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Tier 4: Global</span>
            <span className="text-[10px] font-mono bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full border border-purple-200/60">50-69</span>
          </div>
          <p className="text-xs text-slate-500">Bases de datos secundarias (Ecoinvent / DEFRA) para Scope 3.</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por actividad o ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="py-2 px-3.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los Alcances</option>
              <option value="Scope 1">Alcance 1</option>
              <option value="Scope 2">Alcance 2</option>
              <option value="Scope 3">Alcance 3</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Total Registros: <strong className="text-slate-800">{filtered.length}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Fecha</th>
                <th className="px-5 py-3.5">Instalación</th>
                <th className="px-5 py-3.5">Alcance</th>
                <th className="px-5 py-3.5">Actividad / Glosa ERP</th>
                <th className="px-5 py-3.5 text-right">Cantidad Registrada</th>
                <th className="px-5 py-3.5 text-right">Emisión Calculada</th>
                <th className="px-5 py-3.5">Calidad & Tier</th>
                <th className="px-5 py-3.5 text-center">Explicabilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(act => {
                const fac = facilities.find(f => f.id === act.facilityId);
                return (
                  <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-mono text-slate-600">{act.periodDate}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{fac?.name || 'Planta'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        act.scope === 'Scope 1' ? 'bg-orange-50 text-orange-700 border border-orange-200/60' :
                        act.scope === 'Scope 2' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                      }`}>
                        {act.scope}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{act.activityType}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {act.sourceRecordId}</p>
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
                      {act.quantity.toLocaleString('es-CL')} {act.unit}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="font-bold text-slate-900 font-mono">{act.calculatedCo2eTons.toFixed(3)} tCO₂e</p>
                      <p className="text-[10px] text-slate-400">({act.calculatedCo2eKg.toLocaleString('es-CL', { maximumFractionDigits: 1 })} kg)</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Score: {act.dataQualityScore}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1">{act.dataQualityTier.split(':')[0]}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => onExplainCalculation(act.id)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200/60 transition-colors inline-flex items-center gap-1.5 text-[11px]"
                      >
                        <Cpu className="w-3 h-3" />
                        Linaje
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Batch Ingestion Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                Ingesta Masiva de Datos de Actividad
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center space-y-2">
              <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Arrastra tu archivo CSV / Excel aquí o haz clic para examinar</p>
              <p className="text-[11px] text-slate-400">Mapeo automático de columnas: Fecha, Instalación, Consumo, Unidad, ID_Factura</p>
            </div>

            <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-3.5 text-xs text-blue-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Pipeline de Validación Automática
              </p>
              <p className="text-[11px] text-blue-700">
                1. Detección duplicados &middot; 2. Enlace Factor Oficial &middot; 3. Hash criptográfico linaje &middot; 4. Asignación Score Calidad.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleSimulatedCSVUpload}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
              >
                Ejecutar Ingesta (4 Registros)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Single Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Ingreso Manual de Registro de Actividad</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instalación / Planta</label>
                <select
                  value={newRec.facilityId}
                  onChange={(e) => setNewRec({ ...newRec, facilityId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {facilities.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.commune})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Descripción de la Actividad / Glosa</label>
                <input
                  type="text"
                  value={newRec.activityType}
                  onChange={(e) => setNewRec({ ...newRec, activityType: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cantidad</label>
                  <input
                    type="number"
                    value={newRec.quantity}
                    onChange={(e) => setNewRec({ ...newRec, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unidad</label>
                  <input
                    type="text"
                    value={newRec.unit}
                    onChange={(e) => setNewRec({ ...newRec, unit: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Factor de Emisión Oficial</label>
                <select
                  value={newRec.emissionFactorId}
                  onChange={(e) => setNewRec({ ...newRec, emissionFactorId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {emissionFactors.map(ef => (
                    <option key={ef.id} value={ef.id}>{ef.name} ({ef.co2eFactor} {ef.outputUnit}/{ef.inputUnit})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onAddSingleRecord(newRec);
                  setShowAddModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
              >
                Guardar y Calcular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
