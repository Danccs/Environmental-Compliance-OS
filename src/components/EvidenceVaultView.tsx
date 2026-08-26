import React, { useState } from 'react';
import { 
  Award, 
  FileText, 
  Hash, 
  CheckCircle2, 
  Upload, 
  Search, 
  Filter, 
  ExternalLink, 
  ShieldCheck,
  Building2,
  Calendar,
  Lock
} from 'lucide-react';
import { EvidenceDocument, Organization } from '../types';

interface EvidenceVaultViewProps {
  evidences: EvidenceDocument[];
  organization: Organization;
  onUploadEvidence: (doc: { fileName: string; category: any; issuerName: string; issuerTaxId: string }) => void;
}

export const EvidenceVaultView: React.FC<EvidenceVaultViewProps> = ({
  evidences,
  organization,
  onUploadEvidence
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    fileName: '',
    category: 'Factura Combustible' as const,
    issuerName: 'Enel Generación Chile S.A.',
    issuerTaxId: '96.502.000-4'
  });

  const filtered = evidences.filter(e => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.fileName.toLowerCase().includes(q) || e.issuerName.toLowerCase().includes(q) || e.sha256Hash.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Bóveda de Evidencias Digitales</h2>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Integridad SHA-256
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Repositorio inmutable de facturas, certificados de gestores Ley REP, I-RECs y mediciones primarias para auditorías ISO 14064-3.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-colors shrink-0"
        >
          <Upload className="w-4 h-4" />
          Cargar Documento a Bóveda
        </button>
      </div>

      {/* Retention Policy Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Política de Retención Legal y Criptográfica</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Documentos resguardados con hash SHA-256 y retención mínima de 10 años conforme a exigencias SMA, Ley REP y SII.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800 self-start sm:self-auto">
          WORM (Write Once, Read Many)
        </span>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre, emisor o hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Factura Combustible">Facturas Combustibles</option>
            <option value="Factura Eléctrica">Facturas Eléctricas</option>
            <option value="Certificado Gestor REP">Certificados Gestores REP</option>
            <option value="Factura Materia Prima">Facturas Materia Prima</option>
            <option value="Certificado I-REC">Certificados I-REC</option>
            <option value="Reporte Fugas Clima">Reportes Fugas Clima</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Archivos en Bóveda: <strong className="text-slate-800">{filtered.length}</strong>
        </div>
      </div>

      {/* Evidences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(doc => (
          <div 
            key={doc.id}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200/80 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{doc.fileName}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{doc.category}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verificado
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl text-xs space-y-1.5 text-slate-600">
                <p className="flex justify-between">
                  <span className="text-slate-400">Emisor:</span>
                  <strong className="text-slate-800 truncate ml-2">{doc.issuerName}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">RUT Emisor:</span>
                  <span className="font-mono text-slate-700">{doc.issuerTaxId}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Fecha Doc:</span>
                  <span className="text-slate-700">{doc.documentDate}</span>
                </p>
              </div>

              <div className="p-2.5 bg-slate-50/50 rounded-xl text-[10px] space-y-1 border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Hash className="w-3 h-3 text-slate-400" />
                  <span>Firma Criptográfica SHA-256:</span>
                </div>
                <p className="font-mono text-[9px] text-slate-600 truncate">{doc.sha256Hash}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">{(doc.fileSizeBytes / 1024).toFixed(0)} KB</span>
              <button
                onClick={() => alert(`Previsualizando documento verificado: ${doc.fileName}\nFirma SHA-256: ${doc.sha256Hash}`)}
                className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
              >
                Ver Documento <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Cargar Documento Soporte a Bóveda</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre del Archivo</label>
                <input
                  type="text"
                  placeholder="ej. Factura_Electricidad_Julio_2026.pdf"
                  value={newDoc.fileName}
                  onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Categoría Documental</label>
                <select
                  value={newDoc.category}
                  onChange={(e: any) => setNewDoc({ ...newDoc, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Factura Combustible">Factura Combustible</option>
                  <option value="Factura Eléctrica">Factura Eléctrica</option>
                  <option value="Certificado Gestor REP">Certificado Gestor REP</option>
                  <option value="Factura Materia Prima">Factura Materia Prima</option>
                  <option value="Certificado I-REC">Certificado I-REC</option>
                  <option value="Reporte Fugas Clima">Reporte Fugas Clima</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Razón Social Emisor</label>
                  <input
                    type="text"
                    value={newDoc.issuerName}
                    onChange={(e) => setNewDoc({ ...newDoc, issuerName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">RUT Emisor</label>
                  <input
                    type="text"
                    value={newDoc.issuerTaxId}
                    onChange={(e) => setNewDoc({ ...newDoc, issuerTaxId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onUploadEvidence({
                    fileName: newDoc.fileName || 'Documento_Soporte_Auditoria.pdf',
                    category: newDoc.category,
                    issuerName: newDoc.issuerName,
                    issuerTaxId: newDoc.issuerTaxId
                  });
                  setShowUploadModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
              >
                Firmar & Almacenar en Bóveda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
