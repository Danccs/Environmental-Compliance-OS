import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  FileSpreadsheet, 
  AlertTriangle, 
  Download, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { Organization } from '../types';

interface NavbarProps {
  organization: Organization;
  onOpenCopilot: () => void;
  onOpenAuditModal: () => void;
  onOpenImportModal: () => void;
  complianceScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  organization,
  onOpenCopilot,
  onOpenAuditModal,
  onOpenImportModal,
  complianceScore
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3.5 shadow-2xs">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Context */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight">Environmental OS</span>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded-full">
                  Chile &middot; ISO 14064
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {organization.legalName} &middot; RUT {organization.taxId}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center pl-4 border-l border-slate-200 gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/70 rounded-full text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Score Cumplimiento: <strong className="text-emerald-700">{complianceScore}%</strong></span>
            </div>
          </div>
        </div>

        {/* Global Search and Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Buscar registros, factores, RUTs..." 
              className="pl-9 pr-4 py-1.5 bg-slate-100 rounded-full border-0 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 lg:w-64 placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          </div>

          <button
            onClick={onOpenImportModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            Ingestar ERP
          </button>

          <button
            onClick={onOpenAuditModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Auditoría
          </button>

          <button
            onClick={onOpenCopilot}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-100" />
            Copiloto IA
          </button>
        </div>
      </div>
    </header>
  );
};
