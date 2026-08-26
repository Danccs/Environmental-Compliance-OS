import React from 'react';
import { 
  ShieldCheck, 
  CloudSun, 
  Recycle, 
  Layers, 
  AlertTriangle, 
  TrendingDown, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  Cpu, 
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Organization, 
  ComplianceObligation, 
  EnvironmentalIssue,
  ProductCarbonStudy
} from '../types';

interface ControlCenterViewProps {
  organization: Organization;
  carbonSummary: {
    scope1Tons: number;
    scope2LocationTons: number;
    scope2MarketTons: number;
    scope3Tons: number;
    totalLocationTons: number;
    totalMarketTons: number;
    byFacility: { id: string; name: string; commune: string; tons: number }[];
  };
  repSummary: {
    totalMarketDeclaredKg: number;
    totalWasteRecoveredKg: number;
    complianceRatePct: number;
  };
  pcfStudy: ProductCarbonStudy;
  obligations: ComplianceObligation[];
  issues: EnvironmentalIssue[];
  onNavigate: (viewId: any) => void;
  onExplainCalculation: (actId: string) => void;
}

export const ControlCenterView: React.FC<ControlCenterViewProps> = ({
  organization,
  carbonSummary,
  repSummary,
  pcfStudy,
  obligations,
  issues,
  onNavigate,
  onExplainCalculation
}) => {
  const scopeData = [
    { name: 'Alcance 1 (Directas)', tons: carbonSummary.scope1Tons, color: '#f97316' },
    { name: 'Alcance 2 (Energía SEN)', tons: carbonSummary.scope2LocationTons, color: '#3b82f6' },
    { name: 'Alcance 3 (Cadena Valor)', tons: carbonSummary.scope3Tons, color: '#8b5cf6' }
  ];

  const pendingObligations = obligations.filter(o => o.status !== 'Cumplido');
  const criticalIssues = issues.filter(i => i.status !== 'Resuelto');

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header with Title & Quick Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Resumen</h2>
          <p className="text-sm text-slate-500 mt-1">
            Consolidación de huella de carbono, metas Ley REP y gestión regulatoria RETC 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-700">Sistema Verificado ISO 14064</span>
          </div>
        </div>
      </div>

      {/* Main KPI Metric Cards Grid - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Huella Corporativa */}
        <div 
          onClick={() => onNavigate('corporate-carbon')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-slate-500 font-medium">Huella Corporativa</p>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CloudSun className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              {carbonSummary.totalLocationTons.toLocaleString('es-CL', { maximumFractionDigits: 1 })}{' '}
              <span className="text-base font-normal text-slate-500">tCO₂e</span>
            </h3>
            <div className="mt-2 flex items-center gap-1 text-emerald-500 text-sm font-semibold">
              <TrendingDown className="w-4 h-4" />
              <span>6.2% vs año anterior</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Market-Based: {carbonSummary.totalMarketTons.toFixed(1)} t</span>
            <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
              Ver Scopes <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Cumplimiento Ley REP */}
        <div 
          onClick={() => onNavigate('rep-compliance')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-slate-500 font-medium">Cumplimiento Ley REP</p>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Recycle className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              {repSummary.complianceRatePct}%
            </h3>
            <div className="mt-2 flex items-center gap-1 text-emerald-500 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sobre meta MMA (60%)</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{(repSummary.totalMarketDeclaredKg / 1000).toFixed(1)} t declaradas</span>
            <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
              SISREP <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Huella Producto (PCF) */}
        <div 
          onClick={() => onNavigate('product-carbon')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-slate-500 font-medium">Huella Producto (PCF)</p>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              {(pcfStudy.totalPcfKgCo2e * 1000).toFixed(1)}{' '}
              <span className="text-base font-normal text-slate-500">gCO₂e</span>
            </h3>
            <div className="mt-2 flex items-center gap-1 text-slate-500 text-sm truncate font-medium">
              <span>{pcfStudy.productName}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Cradle-to-Grave</span>
            <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
              Ecodiseño <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Obligaciones & Alertas */}
        <div 
          onClick={() => onNavigate('compliance-calendar')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-slate-500 font-medium">Obligaciones & Alertas</p>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              {pendingObligations.length}{' '}
              <span className="text-base font-normal text-slate-500">Pendientes</span>
            </h3>
            <div className="mt-2 flex items-center gap-1 text-amber-600 text-sm font-semibold">
              <span>{criticalIssues.length} hallazgos abiertos</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Próx: 31 Agosto (REP)</span>
            <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
              Calendario <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Row: Corporate Scope Breakdown + Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scopes Breakdown Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-lg text-slate-900">Distribución de Emisiones por Alcance</h4>
              <p className="text-xs text-slate-500 mt-0.5">Cuantificación consolidada año 2026 en toneladas métricas de CO₂e (GHG Protocol)</p>
            </div>
            <button
              onClick={() => onNavigate('corporate-carbon')}
              className="text-blue-600 text-sm font-semibold hover:underline"
            >
              Ver todo
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scopeData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" t" />
                <Tooltip 
                  formatter={(val: any) => [`${Number(val).toFixed(2)} tCO₂e`, 'Emisiones']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="tons" radius={[8, 8, 0, 0]}>
                  {scopeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            {scopeData.map(s => (
              <div key={s.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100/80">
                <p className="text-xs font-medium text-slate-500 truncate">{s.name}</p>
                <p className="text-base font-bold text-slate-900 mt-1">{s.tons.toFixed(1)} tCO₂e</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {((s.tons / carbonSummary.totalLocationTons) * 100).toFixed(1)}% del total
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Facility Distribution Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg text-slate-900">Emisiones por Planta</h4>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">3 Plantas</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Establecimientos registrados ante RETC</p>

            <div className="mt-6 space-y-4">
              {carbonSummary.byFacility.map(f => {
                const pct = ((f.tons / carbonSummary.totalLocationTons) * 100).toFixed(0);
                return (
                  <div key={f.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{f.name}</span>
                      <span className="font-mono font-bold text-slate-900">{f.tons} tCO₂e</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all" 
                        style={{ width: `${Math.max(Number(pct), 8)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{f.commune}</span>
                      <span>{pct}% del inventario</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onExplainCalculation('act-001')}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              Auditar Linaje de Cálculo (Explainability)
            </button>
          </div>
        </div>
      </div>

      {/* Regulatory & Findings Activity Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compliance Obligations */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-lg text-slate-900">Obligaciones Regulatorias</h4>
              <button 
                onClick={() => onNavigate('compliance-calendar')}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                Ver todo
              </button>
            </div>

            <div className="space-y-4">
              {obligations.slice(0, 3).map(obl => (
                <div 
                  key={obl.id} 
                  className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                        {obl.authority}
                      </span>
                      <p className="text-sm font-semibold text-slate-900">{obl.title}</p>
                    </div>
                    <p className="text-xs text-slate-500">{obl.legalBase}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      obl.status === 'Cumplido'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : obl.status === 'En Proceso'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {obl.status}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3" /> {obl.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Environmental Issues / Action Items */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-lg text-slate-900">Hallazgos & Calidad de Datos</h4>
              <button 
                onClick={() => onNavigate('compliance-calendar')}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                Ver todo
              </button>
            </div>

            <div className="space-y-4">
              {issues.slice(0, 3).map(iss => (
                <div 
                  key={iss.id} 
                  className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        iss.severity === 'Crítico'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          : iss.severity === 'Alto'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                      }`}>
                        {iss.severity}
                      </span>
                      <p className="text-sm font-semibold text-slate-900">{iss.title}</p>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{iss.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-semibold bg-white text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                      {iss.status}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">{iss.assignedTo.split(' ')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
