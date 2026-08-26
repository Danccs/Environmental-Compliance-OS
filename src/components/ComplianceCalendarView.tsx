import React, { useState } from 'react';
import { 
  CalendarCheck, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Building2, 
  ShieldCheck, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  ComplianceObligation, 
  EnvironmentalIssue, 
  InventorySnapshot,
  Organization 
} from '../types';

interface ComplianceCalendarViewProps {
  obligations: ComplianceObligation[];
  issues: EnvironmentalIssue[];
  snapshots: InventorySnapshot[];
  organization: Organization;
  onAddIssue: (issue: Partial<EnvironmentalIssue>) => void;
  onUpdateIssueStatus: (id: string, status: any) => void;
  onCreateSnapshot: (year: number, approvedBy: string, role: string) => void;
}

export const ComplianceCalendarView: React.FC<ComplianceCalendarViewProps> = ({
  obligations,
  issues,
  snapshots,
  organization,
  onAddIssue,
  onUpdateIssueStatus,
  onCreateSnapshot
}) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'issues' | 'snapshots'>('calendar');
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);

  // New Issue Form
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    severity: 'Medio' as const,
    category: 'Calidad de Datos' as const,
    assignedTo: 'Ignacio Valenzuela Silva',
    dueDate: '2026-08-30'
  });

  // New Snapshot Form
  const [snapForm, setSnapForm] = useState({
    year: 2026,
    approvedBy: 'Ignacio Valenzuela Silva',
    approvalRole: 'Director de Sostenibilidad'
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Calendario & Cumplimiento Normativo</h2>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              RETC &middot; SMA &middot; MMA &middot; Ley REP
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Cronograma de vencimientos legales, seguimiento de no conformidades y congelamiento de inventarios inmutables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'calendar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Calendario Regulatorio
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'issues' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Gestor de Issues
            </button>
            <button
              onClick={() => setActiveTab('snapshots')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'snapshots' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Snapshots Inmutables
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: REGULATORY CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {obligations.map(obl => (
              <div 
                key={obl.id}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {obl.authority}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1.5">{obl.title}</h4>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      obl.status === 'Cumplido'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                        : obl.status === 'En Proceso'
                        ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                        : 'bg-slate-100 text-slate-600 border-slate-200/60'
                    }`}>
                      {obl.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{obl.description}</p>
                  <p className="text-[11px] text-slate-400 font-mono">Base Legal: {obl.legalBase}</p>
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Plazo: <strong className="text-slate-800">{obl.dueDate}</strong>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Resp: {obl.assignedRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ISSUES & AUDIT FINDINGS */}
      {activeTab === 'issues' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Gestor de Issues & Observaciones de Calidad</h3>
              <p className="text-xs text-slate-500 mt-0.5">Hallazgos que deben subsanarse previo al cierre de inventario y auditoría externa</p>
            </div>

            <button
              onClick={() => setShowNewIssueModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Nuevo Issue
            </button>
          </div>

          <div className="space-y-3">
            {issues.map(iss => (
              <div 
                key={iss.id} 
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      iss.severity === 'Crítico'
                        ? 'bg-rose-50 text-rose-700 border-rose-200/60'
                        : iss.severity === 'Alto'
                        ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                        : 'bg-blue-50 text-blue-700 border-blue-200/60'
                    }`}>
                      {iss.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{iss.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({iss.category})</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{iss.description}</p>
                  <p className="text-[11px] text-slate-400">
                    Asignado a: <strong className="text-slate-700">{iss.assignedTo}</strong> &middot; Vence: <strong className="text-slate-700">{iss.dueDate}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={iss.status}
                    onChange={(e) => onUpdateIssueStatus(iss.id, e.target.value)}
                    className="text-xs py-1.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Abierto">Abierto</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Resuelto">Resuelto</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: IMMUTABLE SNAPSHOTS */}
      {activeTab === 'snapshots' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-emerald-950">Congelamiento & Snapshot Inmutable del Inventario</h3>
              </div>
              <p className="text-xs text-emerald-800 max-w-2xl leading-relaxed">
                Al cerrar un año contable ambiental, se genera una firma criptográfica única que bloquea cualquier modificación posterior a los datos de actividad, garantizando reproducibilidad absoluta ante verificadores.
              </p>
            </div>

            <button
              onClick={() => setShowSnapshotModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors shrink-0"
            >
              <Lock className="w-4 h-4" />
              Emitir Nuevo Snapshot
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Historial de Snapshots Aprobados</h4>
            
            {snapshots.map(snap => (
              <div key={snap.id} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-slate-900">Inventario Anual {snap.year}</span>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {snap.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Emitido: {new Date(snap.snapshotDate).toLocaleDateString('es-CL')}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Emisiones Totales:</span>
                    <strong className="text-slate-900 font-mono text-xs">{snap.totalEmissionsTons} tCO₂e</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Alcance 1:</span>
                    <strong className="text-orange-700 font-mono text-xs">{snap.scope1Tons} tCO₂e</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Alcance 2 (SEN):</span>
                    <strong className="text-blue-700 font-mono text-xs">{snap.scope2LocationTons} tCO₂e</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Alcance 3:</span>
                    <strong className="text-purple-700 font-mono text-xs">{snap.scope3Tons} tCO₂e</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[10px] space-y-1 font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Firma Criptográfica SHA-256:</span>
                    <span className="text-emerald-400 font-bold">Aprobado por {snap.approvedBy} ({snap.approvalRole})</span>
                  </div>
                  <p className="text-emerald-300 truncate">{snap.dataIntegrityHash}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Issue Modal */}
      {showNewIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Registrar Issue o No Conformidad Ambiental</h3>
              <button onClick={() => setShowNewIssueModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título del Issue</label>
                <input
                  type="text"
                  placeholder="ej. Factura Diésel Quilicura sin desglose de litros"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Descripción y Acción Requerida</label>
                <textarea
                  rows={3}
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Severidad</label>
                  <select
                    value={newIssue.severity}
                    onChange={(e: any) => setNewIssue({ ...newIssue, severity: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bajo">Bajo</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                    <option value="Crítico">Crítico</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={newIssue.category}
                    onChange={(e: any) => setNewIssue({ ...newIssue, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Calidad de Datos">Calidad de Datos</option>
                    <option value="Evidencia Faltante">Evidencia Faltante</option>
                    <option value="Cumplimiento Legal">Cumplimiento Legal</option>
                    <option value="Factor Desactualizado">Factor Desactualizado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowNewIssueModal(false)}
                className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onAddIssue(newIssue);
                  setShowNewIssueModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
              >
                Crear Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snapshot Modal */}
      {showSnapshotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                Aprobar y Congelar Snapshot Anual
              </h3>
              <button onClick={() => setShowSnapshotModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Año Contable a Congelar</label>
                <input
                  type="number"
                  value={snapForm.year}
                  onChange={(e) => setSnapForm({ ...snapForm, year: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre del Aprobador / Firma</label>
                <input
                  type="text"
                  value={snapForm.approvedBy}
                  onChange={(e) => setSnapForm({ ...snapForm, approvedBy: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cargo / Rol en la Organización</label>
                <input
                  type="text"
                  value={snapForm.approvalRole}
                  onChange={(e) => setSnapForm({ ...snapForm, approvalRole: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowSnapshotModal(false)}
                className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onCreateSnapshot(snapForm.year, snapForm.approvedBy, snapForm.approvalRole);
                  setShowSnapshotModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
              >
                Firmar y Bloquear Inventario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
