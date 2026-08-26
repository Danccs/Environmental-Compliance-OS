import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  FileSpreadsheet, 
  FileText, 
  Hash, 
  ExternalLink, 
  Lock, 
  Building2, 
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  Organization, 
  ActivityData, 
  EvidenceDocument, 
  EmissionFactor,
  PackagingBOMItem,
  InventorySnapshot
} from '../types';

interface AuditWorkspaceViewProps {
  organization: Organization;
  activityData: ActivityData[];
  evidences: EvidenceDocument[];
  emissionFactors: EmissionFactor[];
  packagingBOM: PackagingBOMItem[];
  snapshots: InventorySnapshot[];
  onExplainCalculation: (actId: string) => void;
  onDownloadAuditPackage: () => void;
}

export const AuditWorkspaceView: React.FC<AuditWorkspaceViewProps> = ({
  organization,
  activityData,
  evidences,
  emissionFactors,
  packagingBOM,
  snapshots,
  onExplainCalculation,
  onDownloadAuditPackage
}) => {
  const verifiedEvidencesCount = evidences.filter(e => e.isVerified).length;
  const verifiedPct = Math.round((verifiedEvidencesCount / evidences.length) * 100);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Espacio de Verificación & Auditoría</h2>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              ISO 14064-3 / ISO 14067 Ready
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Portal exclusivo para auditores independientes, casas certificadoras (SGS, Bureau Veritas, AENOR) y fiscalizadores SMA.
          </p>
        </div>

        <button
          onClick={onDownloadAuditPackage}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          Descargar Paquete de Auditoría (.JSON)
        </button>
      </div>

      {/* Assurance Level Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Nivel de Aseguramiento Objetivo: Limitado / Razonable
            </span>
            <span className="text-xs text-slate-400">Norma NCh-ISO 14064-3:2019</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{organization.legalName}</h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            El sistema mantiene una cadena inquebrantable de custodia digital: cada kilogramo de emisión reportado está vinculado a un factor con versión oficial y respaldado por un documento con hash SHA-256 verificado.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 shrink-0">
          <div className="text-right">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tasa de Respaldo</p>
            <p className="text-3xl font-black text-emerald-400">{verifiedPct}%</p>
            <p className="text-[10px] text-slate-400">{verifiedEvidencesCount} de {evidences.length} evidencias firmadas</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Audit Readiness Checklist */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Lista de Control de Preparación para Auditoría (Readiness Checklist)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded-xl flex items-start gap-3.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs text-emerald-950">Límites Organizacionales & Operacionales Definidos</p>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Enfoque de Control Operacional sobre 3 instalaciones con códigos RETC vigentes.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded-xl flex items-start gap-3.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs text-emerald-950">Factores de Emisión Oficiales Versionados</p>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Factores HuellaChile 2026, SEN 2026 (0.2854 kg/kWh) y Ecoinvent v3.10 con GWP IPCC AR5.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded-xl flex items-start gap-3.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs text-emerald-950">Bóveda de Evidencias Digitales con Hashes SHA-256</p>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Facturas fiscales electrónicas, certificaciones I-REC y manifiestos de gestores REP inmutables.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded-xl flex items-start gap-3.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs text-emerald-950">Linaje Matemático Reproducible a Nivel de Registro</p>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Cada indicador se descompone en su fórmula determinística sin cajas negras.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auditor Sampling Ledger */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Muestreo de Verificación para Auditor Externo</h3>
            <p className="text-xs text-slate-500 mt-0.5">Selecciona cualquier fila de muestra para inspeccionar la evidencia y la fórmula</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">ID Registro</th>
                <th className="px-5 py-3.5">Alcance</th>
                <th className="px-5 py-3.5">Actividad Muestreada</th>
                <th className="px-5 py-3.5 text-right">Cantidad Primaria</th>
                <th className="px-5 py-3.5 text-right">Emisión Resultante</th>
                <th className="px-5 py-3.5">Hash Documento</th>
                <th className="px-5 py-3.5 text-center">Verificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activityData.slice(0, 5).map(act => {
                const evi = evidences.find(e => e.id === act.evidenceId);
                return (
                  <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-700">{act.id}</td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {act.scope}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{act.activityType}</td>
                    <td className="px-5 py-4 text-right font-mono text-slate-700">
                      {act.quantity.toLocaleString('es-CL')} {act.unit}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
                      {act.calculatedCo2eTons.toFixed(3)} tCO₂e
                    </td>
                    <td className="px-5 py-4 font-mono text-[10px] text-slate-400 truncate max-w-xs">
                      {evi?.sha256Hash || 'N/A (Cálculo Estimado)'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => onExplainCalculation(act.id)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200/60 transition-colors inline-flex items-center gap-1.5 text-[11px]"
                      >
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        Auditar Línea
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
