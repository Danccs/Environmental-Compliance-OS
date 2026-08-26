import React, { useState } from 'react';
import { 
  CloudSun, 
  Flame, 
  Zap, 
  Truck, 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Cpu, 
  TrendingDown, 
  Award,
  Download,
  Plus
} from 'lucide-react';
import { 
  ActivityData, 
  Scope3CategoryInfo, 
  DecarbonizationInitiative,
  Facility,
  EmissionFactor
} from '../types';

interface CorporateCarbonViewProps {
  activityData: ActivityData[];
  scope3Categories: Scope3CategoryInfo[];
  initiatives: DecarbonizationInitiative[];
  facilities: Facility[];
  emissionFactors: EmissionFactor[];
  onExplainCalculation: (actId: string) => void;
  onNewActivityRecord: () => void;
}

export const CorporateCarbonView: React.FC<CorporateCarbonViewProps> = ({
  activityData,
  scope3Categories,
  initiatives,
  facilities,
  emissionFactors,
  onExplainCalculation,
  onNewActivityRecord
}) => {
  const [activeTab, setActiveTab] = useState<'explorer' | 'scopes' | 'materiality' | 'macc'>('explorer');
  const [selectedScopeFilter, setSelectedScopeFilter] = useState<string>('all');
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered activity records
  const filteredRecords = activityData.filter(record => {
    if (selectedScopeFilter !== 'all' && record.scope !== selectedScopeFilter) return false;
    if (selectedFacilityFilter !== 'all' && record.facilityId !== selectedFacilityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchAct = record.activityType.toLowerCase().includes(q);
      const matchCat = record.scopeCategory.toLowerCase().includes(q);
      const matchSrc = record.sourceRecordId.toLowerCase().includes(q);
      if (!matchAct && !matchCat && !matchSrc) return false;
    }
    return true;
  });

  const scope1Total = activityData.filter(a => a.scope === 'Scope 1').reduce((s, a) => s + a.calculatedCo2eTons, 0);
  const scope2Location = activityData.filter(a => a.scope === 'Scope 2' && a.emissionFactorId !== 'ef-electricidad-irec-market').reduce((s, a) => s + a.calculatedCo2eTons, 0);
  const scope2Market = activityData.filter(a => a.scope === 'Scope 2' && a.emissionFactorId === 'ef-electricidad-irec-market').reduce((s, a) => s + a.calculatedCo2eTons, 0);
  const scope3Total = activityData.filter(a => a.scope === 'Scope 3').reduce((s, a) => s + a.calculatedCo2eTons, 0);
  const totalEmissions = scope1Total + scope2Location + scope3Total;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Huella Corporativa de Carbono (GEI)</h2>
            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
              NCh-ISO 14064-1 &middot; GHG Protocol
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Inventario organizacional de emisiones directas e indirectas con trazabilidad y linaje auditable.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'explorer' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Explorador
            </button>
            <button
              onClick={() => setActiveTab('scopes')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'scopes' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alcances
            </button>
            <button
              onClick={() => setActiveTab('materiality')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'materiality' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Materialidad Scope 3
            </button>
            <button
              onClick={() => setActiveTab('macc')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'macc' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curva MACC
            </button>
          </div>

          <button
            onClick={onNewActivityRecord}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo Registro
          </button>
        </div>
      </div>

      {/* Scopes Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Scope 1 */}
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alcance 1 (Directas)</span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mt-2">
              {scope1Total.toFixed(2)} <span className="text-sm font-normal text-slate-500">tCO₂e</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            Calderas Gas Natural, Flota Diésel y Fugas R-410A
          </p>
        </div>

        {/* Scope 2 Location */}
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alcance 2 (Location)</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mt-2">
              {scope2Location.toFixed(2)} <span className="text-sm font-normal text-slate-500">tCO₂e</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            Factor SEN 0.2854 kgCO₂e/kWh (Quilicura & San Bernardo)
          </p>
        </div>

        {/* Scope 2 Market (I-REC) */}
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alcance 2 (Market I-REC)</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mt-2">
              {scope2Market.toFixed(2)} <span className="text-sm font-normal text-slate-500">tCO₂e</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            100% Solar Antofagasta (Certificados I-REC Enel)
          </p>
        </div>

        {/* Scope 3 */}
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alcance 3 (Cadena)</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mt-2">
              {scope3Total.toFixed(2)} <span className="text-sm font-normal text-slate-500">tCO₂e</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            Materias primas (PET/Cartón), Fletes y Viajes
          </p>
        </div>
      </div>

      {/* TAB 1: CARBON EXPLORER */}
      {activeTab === 'explorer' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-4">
          {/* Table Filters Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar actividad, fuente, ERP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 rounded-full border-0 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
                />
              </div>

              <select
                value={selectedScopeFilter}
                onChange={(e) => setSelectedScopeFilter(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-100 border-0 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los Alcances</option>
                <option value="Scope 1">Alcance 1 (Directas)</option>
                <option value="Scope 2">Alcance 2 (Energía)</option>
                <option value="Scope 3">Alcance 3 (Cadena)</option>
              </select>

              <select
                value={selectedFacilityFilter}
                onChange={(e) => setSelectedFacilityFilter(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-100 border-0 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las Plantas</option>
                {facilities.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Mostrando <strong>{filteredRecords.length}</strong> de {activityData.length} registros
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Periodo</th>
                  <th className="px-5 py-3.5">Planta</th>
                  <th className="px-5 py-3.5">Alcance</th>
                  <th className="px-5 py-3.5">Actividad</th>
                  <th className="px-5 py-3.5 text-right">Cantidad</th>
                  <th className="px-5 py-3.5">Factor</th>
                  <th className="px-5 py-3.5 text-right">Emisión</th>
                  <th className="px-5 py-3.5">Calidad</th>
                  <th className="px-5 py-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => {
                  const facility = facilities.find(f => f.id === record.facilityId);
                  const factor = emissionFactors.find(ef => ef.id === record.emissionFactorId);
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 text-slate-700 font-mono">
                        {record.periodDate}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {facility?.code || 'PLT'}
                        <span className="block text-[11px] text-slate-400 font-normal">{facility?.commune}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          record.scope === 'Scope 1'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200/60'
                            : record.scope === 'Scope 2'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                            : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                        }`}>
                          {record.scope}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5 font-medium">{record.scopeCategory}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{record.activityType}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{record.sourceSystem} &middot; {record.sourceRecordId}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-slate-800">
                        {record.quantity.toLocaleString('es-CL')} <span className="text-slate-400 font-normal text-[11px]">{record.unit}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-mono text-[11px] font-semibold text-slate-800">{factor?.co2eFactor} {factor?.outputUnit}/{factor?.inputUnit}</p>
                        <p className="text-[10px] text-slate-400">{factor?.sourceAgency} ({factor?.version})</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="font-bold text-slate-900 text-xs">
                          {record.calculatedCo2eTons.toFixed(3)} <span className="text-[11px] font-normal text-slate-500">tCO₂e</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          ({record.calculatedCo2eKg.toLocaleString('es-CL', { maximumFractionDigits: 1 })} kg)
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Score {record.dataQualityScore}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => onExplainCalculation(record.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors inline-flex items-center gap-1"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          Explicar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SCOPES BREAKDOWN */}
      {activeTab === 'scopes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Scope 1 Stationary & Mobile Detail */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Alcance 1: Emisiones Directas</h3>
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Combustión Móvil (Flota Diésel)</p>
                  <p className="text-[11px] text-slate-500">35.420 Litros Diésel en camiones reparto San Bernardo</p>
                </div>
                <span className="font-mono font-bold text-xs text-orange-700">95.07 tCO₂e</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Combustión Estacionaria (Caldera Gas Natural)</p>
                  <p className="text-[11px] text-slate-500">48.500 m³ Gas Natural en Planta Quilicura</p>
                </div>
                <span className="font-mono font-bold text-xs text-orange-700">93.70 tCO₂e</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Emisiones Fugitivas (Gases Refrigerantes)</p>
                  <p className="text-[11px] text-slate-500">18.5 kg recarga Gas R-410A (GWP AR5 = 2.088)</p>
                </div>
                <span className="font-mono font-bold text-xs text-orange-700">38.63 tCO₂e</span>
              </div>
            </div>
          </div>

          {/* Scope 2 Location vs Market Detail */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Alcance 2: Enfoque Dual</h3>
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-900">Enfoque Ubicación (Location-Based)</p>
                  <p className="text-[11px] text-blue-700">Factor promedio red SEN Coordinador Eléctrico: 0.2854 kg/kWh</p>
                </div>
                <span className="font-mono font-bold text-xs text-blue-900">121.30 tCO₂e</span>
              </div>
              <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-900">Enfoque Mercado (Market-Based I-REC)</p>
                  <p className="text-[11px] text-emerald-700">168.000 kWh Planta Antofagasta con certificados 100% solares</p>
                </div>
                <span className="font-mono font-bold text-xs text-emerald-900">0.00 tCO₂e</span>
              </div>
              <p className="text-[11px] text-slate-400 italic pt-2">
                * Conforme al GHG Protocol Scope 2 Guidance, se reportan ambos métodos obligatoriamente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCOPE 3 MATERIALITY */}
      {activeTab === 'materiality' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Matriz de Materialidad Alcance 3</h3>
              <p className="text-xs text-slate-500 mt-0.5">Evaluación de relevancia para las 15 categorías GHG Protocol</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60">
              Total Scope 3: {scope3Total.toFixed(2)} tCO₂e
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scope3Categories.map(cat => (
              <div 
                key={cat.number} 
                className={`p-4 rounded-xl border transition-all ${
                  cat.isMaterial 
                    ? 'bg-purple-50/30 border-purple-200/80 shadow-2xs' 
                    : 'bg-slate-50/60 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-purple-800">Cat {cat.number}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    cat.isMaterial ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cat.isMaterial ? 'Material' : 'No Material'}
                  </span>
                </div>
                <h5 className="font-bold text-slate-900 text-xs mt-2">{cat.name}</h5>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cat.materialityReason}</p>
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Emisión Estimada:</span>
                  <span className="font-mono font-bold text-purple-900">{cat.emissionsTons.toFixed(2)} t</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MACC & REDUCTION TARGETS */}
      {activeTab === 'macc' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Curva de Abatimiento Marginal (MACC)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Iniciativas de mitigación priorizadas por costo-efectividad ($ USD / tCO₂e)</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Meta 2030: -30% Emisiones
            </span>
          </div>

          <div className="space-y-3">
            {initiatives.map(init => (
              <div 
                key={init.id} 
                className="p-5 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800">
                      {init.targetScope}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900">{init.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Inversión: ${(init.investmentClp / 1000000).toFixed(0)}M CLP &middot; Responsable: {init.owner} &middot; Inicio: {init.startDate}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 text-right">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Reducción Anual</p>
                    <p className="text-sm font-bold text-emerald-600">-{init.expectedAnnualReductionTons} tCO₂e/año</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Costo Abatimiento</p>
                    <p className={`text-sm font-mono font-bold ${
                      init.marginalAbatementCostUsdPerTon < 0 ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {init.marginalAbatementCostUsdPerTon > 0 ? '+' : ''}{init.marginalAbatementCostUsdPerTon} USD/t
                    </p>
                  </div>

                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    init.status === 'Aprobada'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : init.status === 'En Implementación'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {init.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
