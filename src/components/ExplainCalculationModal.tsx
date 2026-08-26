import React from 'react';
import { 
  X, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Hash, 
  Layers, 
  Clock, 
  Building2, 
  Cpu, 
  ShieldCheck
} from 'lucide-react';
import { CalculationLineage } from '../types';

interface ExplainCalculationModalProps {
  lineage: CalculationLineage | null;
  onClose: () => void;
}

export const ExplainCalculationModal: React.FC<ExplainCalculationModalProps> = ({
  lineage,
  onClose
}) => {
  if (!lineage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white">Linaje y Trazabilidad del Cálculo</h3>
              <p className="text-[11px] text-slate-400 font-mono">ID: {lineage.calculationId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Result Highlight Card */}
          <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Emisión Total Resultante</p>
              <h4 className="text-2xl font-bold text-emerald-950 mt-0.5">
                {lineage.resultKg.toLocaleString('es-CL', { maximumFractionDigits: 2 })} <span className="text-sm font-semibold text-emerald-700">kgCO₂e</span>
              </h4>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">Equivalente a <strong className="text-emerald-900">{lineage.resultTons.toFixed(4)} tCO₂e</strong></p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Score: {lineage.dataQualityScore}/100
              </span>
              <p className="text-[11px] text-emerald-700 mt-1 font-medium">Estándar {lineage.gwpStandard}</p>
            </div>
          </div>

          {/* Mathematical Step-by-Step Tree */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Cadena Causal del Cálculo (Formula Breakdown)
            </h5>

            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 space-y-4">
              {/* Step 1: Activity Data */}
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">Dato de Actividad Primario</p>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/60">
                      {lineage.quantity.toLocaleString('es-CL')} {lineage.unit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Registrado en <strong className="text-slate-700">{lineage.facilityName}</strong> mediante <strong className="text-slate-700">{lineage.sourceSystem}</strong> (ID: {lineage.sourceRecordId}).
                  </p>
                </div>
              </div>

              {/* Operator */}
              <div className="flex items-center justify-center text-slate-400 font-semibold text-xs py-1">
                &times; Multiplicado por
              </div>

              {/* Step 2: Emission Factor */}
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">Factor de Emisión Oficial Versionado</p>
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200/60">
                      {lineage.factorValue} {lineage.factorUnit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">{lineage.factorName}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>Agencia: <strong className="text-slate-600">{lineage.factorSource}</strong></span>
                    <span>&middot;</span>
                    <span>Código: <strong className="font-mono text-slate-600">{lineage.factorCode}</strong></span>
                    <span>&middot;</span>
                    <span>Versión: <strong className="text-slate-600">{lineage.factorVersion}</strong></span>
                  </div>
                </div>
              </div>

              {/* Equals */}
              <div className="flex items-center justify-center text-slate-400 font-semibold text-xs py-1">
                = Resultado Final
              </div>

              {/* Formula String */}
              <div className="p-3 bg-white border border-slate-200/60 rounded-xl text-center font-mono text-xs text-slate-800 font-semibold shadow-2xs">
                {lineage.formula}
              </div>
            </div>
          </div>

          {/* Evidence Verification Details */}
          <div className="border-t border-slate-100 pt-4 space-y-2.5">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Respaldo Documental en Bóveda (Evidence Vault)
            </h5>

            {lineage.evidenceName ? (
              <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-800">{lineage.evidenceName}</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Firma Válida
                  </span>
                </div>
                {lineage.evidenceHash && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200/60">
                    <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[10px] truncate">SHA-256: {lineage.evidenceHash}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No se adjuntó archivo de respaldo directo para este registro.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50/80 border-t border-slate-100 px-6 py-3.5 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Calculado: {new Date(lineage.timestamp).toLocaleString('es-CL')}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            Cerrar Explicación
          </button>
        </div>
      </div>
    </div>
  );
};
