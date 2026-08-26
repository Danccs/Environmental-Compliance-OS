import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Truck, 
  Recycle, 
  Factory, 
  PieChart as PieIcon,
  HelpCircle,
  Cpu,
  RotateCcw
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { ProductCarbonStudy, PcfProcessNode } from '../types';

interface ProductCarbonViewProps {
  study: ProductCarbonStudy;
  nodes: PcfProcessNode[];
  onExplainCalculation: (actId: string) => void;
}

export const ProductCarbonView: React.FC<ProductCarbonViewProps> = ({
  study,
  nodes,
  onExplainCalculation
}) => {
  const [activeTab, setActiveTab] = useState<'lca-graph' | 'hotspots' | 'ecodesign'>('lca-graph');
  
  // EcoDesign Simulator State
  const [rpetPercentage, setRpetPercentage] = useState<number>(25);
  const [weightReductionPct, setWeightReductionPct] = useState<number>(0);
  const [transportKm, setTransportKm] = useState<number>(160);
  const [renewableEnergyShare, setRenewableEnergyShare] = useState<number>(0);

  // Recalculate simulation dynamically
  const baseTotal = study.totalPcfKgCo2e; // 0.1384 kgCO2e
  const basePetWeight = 0.022 * (1 - weightReductionPct / 100);
  const virginWeight = basePetWeight * (1 - rpetPercentage / 100);
  const recycledWeight = basePetWeight * (rpetPercentage / 100);
  const rawMaterialEmissions = (virginWeight * 2.351) + (recycledWeight * 0.624);
  const elecKwh = 0.045;
  const mfgEmissions = (elecKwh * (1 - renewableEnergyShare / 100) * 0.2854) + (0.0058 * 1.932);
  const packEmissions = 0.0163;
  const distEmissions = (0.022 + 0.500) * (transportKm / 1000) * 0.0892;
  const eolEmissions = 0.0208 * (1 - (rpetPercentage - 25) * 0.004);
  const simulatedTotal = rawMaterialEmissions + mfgEmissions + packEmissions + distEmissions + 0.0042 + eolEmissions;
  const reductionPct = Math.max(0, ((baseTotal - simulatedTotal) / baseTotal) * 100);

  const hotspotData = [
    { name: 'Materias Primas (PET/PP)', value: 0.0581, color: '#f97316' },
    { name: 'Manufactura & Soplado', value: 0.0241, color: '#3b82f6' },
    { name: 'Embalaje Secundario', value: 0.0163, color: '#eab308' },
    { name: 'Distribución Fletes', value: 0.0143, color: '#8b5cf6' },
    { name: 'Fin de Vida (EoL)', value: 0.0208, color: '#10b981' },
    { name: 'Fase de Uso / Frío', value: 0.0042, color: '#64748b' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Huella de Carbono de Producto (PCF)</h2>
            <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60 px-2.5 py-0.5 rounded-full">
              NCh-ISO 14067 &middot; Cradle-to-Grave
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Cuantificación de ciclo de vida, modelado de procesos unitarios y simulación de ecodiseño circular.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('lca-graph')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'lca-graph' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grafo de Procesos
          </button>
          <button
            onClick={() => setActiveTab('hotspots')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'hotspots' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hotspots de Emisión
          </button>
          <button
            onClick={() => setActiveTab('ecodesign')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'ecodesign' ? 'bg-blue-600 text-white shadow-2xs' : 'text-blue-700 hover:text-blue-900 font-semibold'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simulador Ecodiseño
          </button>
        </div>
      </div>

      {/* Product Study Summary Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
              Estudio Certificado ISO 14067:2018
            </span>
            <span className="text-xs text-slate-400 font-mono">SKU-BIOFRESH-500ML</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold">{study.productName}</h3>
          <p className="text-xs text-slate-400">
            Unidad Funcional: <strong className="text-slate-200">{study.functionalUnit}</strong> &middot; Límite: <strong className="text-slate-200">{study.systemBoundary}</strong> &middot; Corte de Masa: <strong className="text-slate-200">{study.cutOffCriteria}</strong>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 shrink-0 relative z-10">
          <div className="text-right">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Huella Unitaria</p>
            <p className="text-3xl font-bold text-white">
              {(study.totalPcfKgCo2e * 1000).toFixed(1)}{' '}
              <span className="text-sm font-medium text-slate-300">gCO₂e</span>
            </p>
            <p className="text-[11px] text-slate-400 font-mono">0.1384 kgCO₂e / botella</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TAB 1: LCA PROCESS GRAPH */}
      {activeTab === 'lca-graph' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Grafo de Procesos Unitarios del Ciclo de Vida</h3>
              <p className="text-xs text-slate-500 mt-0.5">Mapeo de entradas, salidas, energía, scrap y factores de emisión por etapa</p>
            </div>
            <button
              onClick={() => onExplainCalculation('act-003')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-xl"
            >
              <Cpu className="w-3.5 h-3.5" />
              Explicar Insumo Resina &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Upstream Stage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-orange-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Upstream</span>
                <span className="text-[10px] bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded-full border border-orange-200/60">42.0%</span>
              </div>
              {nodes.filter(n => n.stage === 'Upstream').map(node => (
                <div key={node.id} className="p-4 bg-orange-50/30 border border-orange-100 rounded-xl space-y-2 hover:shadow-xs transition-shadow">
                  <p className="font-bold text-xs text-slate-900">{node.name}</p>
                  <p className="text-[11px] text-slate-600">Entradas: {node.inputs.map(i => `${i.name} (${i.amount}${i.unit})`).join(', ')}</p>
                  <div className="pt-2 border-t border-orange-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Emisión:</span>
                    <span className="font-mono font-bold text-orange-950">{node.emissionsKgCo2e} kg</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Core / Manufacturing Stage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">2. Core (Planta)</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200/60">17.4%</span>
              </div>
              {nodes.filter(n => n.stage === 'Core / Manufactura').map(node => (
                <div key={node.id} className="p-4 bg-blue-50/30 border border-blue-100 rounded-xl space-y-2 hover:shadow-xs transition-shadow">
                  <p className="font-bold text-xs text-slate-900">{node.name}</p>
                  <p className="text-[11px] text-slate-600">Energía: {node.energyKwh} kWh &middot; Scrap: {node.scrapRatePct}%</p>
                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Emisión:</span>
                    <span className="font-mono font-bold text-blue-950">{node.emissionsKgCo2e} kg</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Packaging Secondary Stage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">3. Embalaje Sec.</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200/60">11.8%</span>
              </div>
              {nodes.filter(n => n.stage === 'Embalaje Secundario').map(node => (
                <div key={node.id} className="p-4 bg-amber-50/30 border border-amber-100 rounded-xl space-y-2 hover:shadow-xs transition-shadow">
                  <p className="font-bold text-xs text-slate-900">{node.name}</p>
                  <p className="text-[11px] text-slate-600">{node.inputs.map(i => `${i.name}`).join(', ')}</p>
                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Emisión:</span>
                    <span className="font-mono font-bold text-amber-950">{node.emissionsKgCo2e} kg</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Downstream & EoL Stage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">4. Downstream</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">28.8%</span>
              </div>
              {nodes.filter(n => n.stage === 'Downstream & Fin de Vida').map(node => (
                <div key={node.id} className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-xl space-y-2 hover:shadow-xs transition-shadow">
                  <p className="font-bold text-xs text-slate-900">{node.name}</p>
                  <p className="text-[11px] text-slate-600">{node.inputs.map(i => `${i.name}`).join(', ')}</p>
                  <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Emisión:</span>
                    <span className="font-mono font-bold text-emerald-950">{node.emissionsKgCo2e} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOTSPOTS */}
      {activeTab === 'hotspots' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Distribución de Emisiones por Etapa</h3>
              <p className="text-xs text-slate-500 mt-0.5">Identificación de puntos críticos de emisión (Hotspots ISO 14067)</p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hotspotData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${((entry.value / baseTotal) * 100).toFixed(0)}%`}
                  >
                    {hotspotData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val} kgCO₂e`, 'Emisión']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Conclusiones del Análisis de Puntos Críticos</h3>
              <p className="text-xs text-slate-500 mt-0.5">Hallazgos metodológicos clave</p>
            </div>
            
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-200/60">
                <p className="font-bold text-orange-950">Hotspot 1: Resina PET Virgen (42.0% del total)</p>
                <p className="mt-1 text-orange-900 leading-relaxed">
                  La producción de tereftalato de polietileno fósil es la principal fuente de carbono. Cada 10% adicional de resina reciclada (rPET grado alimentario) reduce la huella del producto en ~4.3%.
                </p>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/60">
                <p className="font-bold text-blue-950">Hotspot 2: Consumo Eléctrico en Soplado & Llenado (17.4%)</p>
                <p className="mt-1 text-blue-900 leading-relaxed">
                  El soplado con aire a 40 bar en Quilicura demanda 0.045 kWh por botella. La migración a suministro solar o PPA verde reduce esta etapa a cero neto de emisiones de alcance 2.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
                <p className="font-bold text-emerald-950">Hotspot 3: Disposición Final en Vertedero (15.0%)</p>
                <p className="mt-1 text-emerald-900 leading-relaxed">
                  La recolección y reciclaje circular a través de ReSimple (Ley REP) mitiga el impacto del fin de vida en la modelación ISO 14044.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ECODESIGN SIMULATOR */}
      {activeTab === 'ecodesign' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">Simulador de Ecodiseño Circular en Tiempo Real</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Ajusta parámetros de materialidad, aligeramiento y matriz energética para proyectar la reducción de huella de carbono y cumplimiento REP.
              </p>
            </div>

            <button
              onClick={() => {
                setRpetPercentage(25);
                setWeightReductionPct(0);
                setTransportKm(160);
                setRenewableEnergyShare(0);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Valores Base
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Slider 1: rPET % */}
              <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Recycle className="w-4 h-4 text-emerald-600" />
                    Contenido de Resina Reciclada (rPET Grado Alimento)
                  </span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg">
                    {rpetPercentage}% rPET
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={rpetPercentage}
                  onChange={(e) => setRpetPercentage(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0% (Virgen Puro)</span>
                  <span>25% (Base Actual)</span>
                  <span>100% (Full Circular)</span>
                </div>
              </div>

              {/* Slider 2: Weight Reduction % */}
              <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Aligeramiento de Peso de Botella (Lightweighting)
                  </span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-lg">
                    -{weightReductionPct}% ({((0.022 * (1 - weightReductionPct / 100)) * 1000).toFixed(1)}g)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={weightReductionPct}
                  onChange={(e) => setWeightReductionPct(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0% (22.0g original)</span>
                  <span>-10% (19.8g optimizado)</span>
                  <span>-25% (16.5g ultra-ligero)</span>
                </div>
              </div>

              {/* Slider 3: Renewable Energy Share */}
              <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    Suministro Eléctrico Renovable en Planta (I-REC / Solar)
                  </span>
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-lg">
                    {renewableEnergyShare}% Solar
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={renewableEnergyShare}
                  onChange={(e) => setRenewableEnergyShare(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0% (Red SEN Promedio)</span>
                  <span>50% PPA Mixto</span>
                  <span>100% Cero Emisiones</span>
                </div>
              </div>
            </div>

            {/* Impact Result Card (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Resultado Proyectado ISO 14067
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <h4 className="text-4xl md:text-5xl font-bold text-white">
                    {(simulatedTotal * 1000).toFixed(1)}
                  </h4>
                  <span className="text-sm font-medium text-slate-400">gCO₂e / botella</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Base Original: {(baseTotal * 1000).toFixed(1)} gCO₂e
                </p>
              </div>

              {/* Reduction Gauge */}
              <div className="bg-white/10 p-5 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Reducción de Huella</span>
                  <span className="font-bold text-emerald-400 text-base">-{reductionPct.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, reductionPct * 2))}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  En un lote anual de <strong>1.250.000 unidades</strong>, esto evita la emisión de{' '}
                  <strong className="text-emerald-300">{(((baseTotal - simulatedTotal) * 1250000) / 1000).toFixed(1)} tCO₂e/año</strong>.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span>Cumplimiento Ley REP:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Aprobado DS 12
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
