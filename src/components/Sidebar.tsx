import React from 'react';
import {
  LayoutDashboard,
  CloudSun,
  Recycle,
  Layers,
  Database,
  ShieldAlert,
  CalendarCheck,
  Award,
  ChevronRight
} from 'lucide-react';

export type NavViewId = 
  | 'control-center'
  | 'corporate-carbon'
  | 'rep-compliance'
  | 'product-carbon'
  | 'activity-data'
  | 'evidence-vault'
  | 'compliance-calendar'
  | 'audit-workspace';

interface SidebarProps {
  currentView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  openIssuesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  openIssuesCount
}) => {
  const menuItems: { id: NavViewId; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    { id: 'control-center', label: 'Centro de Control', icon: LayoutDashboard },
    { id: 'corporate-carbon', label: 'Huella Corporativa (GEI)', icon: CloudSun, badge: 'Scopes 1-2-3' },
    { id: 'rep-compliance', label: 'Ley REP & Circularidad', icon: Recycle, badge: 'SISREP Ready' },
    { id: 'product-carbon', label: 'Huella de Producto (PCF)', icon: Layers, badge: 'ISO 14067' },
    { id: 'activity-data', label: 'Datos de Actividad', icon: Database },
    { id: 'evidence-vault', label: 'Bóveda de Evidencias', icon: Award, badge: 'SHA-256' },
    { id: 'compliance-calendar', label: 'Calendario & Normativa', icon: CalendarCheck, badge: openIssuesCount > 0 ? openIssuesCount : undefined },
    { id: 'audit-workspace', label: 'Espacio de Auditoría', icon: ShieldAlert }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="p-4 space-y-1.5">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Módulos
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-blue-100 text-blue-800'
                      : typeof item.badge === 'number'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User profile & System Status Footer */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-9 h-9 rounded-full bg-slate-300 overflow-hidden shrink-0">
            <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              IV
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Ignacio Valenzuela</p>
            <p className="text-[10px] text-slate-500 truncate">Director Sostenibilidad</p>
          </div>
        </div>

        <div className="px-2 py-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>Periodo 2026</span>
          <span className="font-mono text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
            ISO 14064 &middot; REP
          </span>
        </div>
      </div>
    </aside>
  );
};
