import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  HelpCircle, 
  Zap, 
  Recycle, 
  Layers, 
  FileText 
} from 'lucide-react';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: '¡Hola! Soy tu Copiloto de Cumplimiento Ambiental IA. Estoy conectado a los inventarios de GEI (NCh-ISO 14064), tus declaraciones de Ley REP (DS 12/2020), huellas de producto (NCh-ISO 14067) y la Bóveda de Evidencias de Demo Manufacturing Chile SpA. ¿En qué te puedo asesorar hoy?',
      timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    '¿Por qué el Alcance 3 representa el 72% de nuestras emisiones?',
    '¿Qué exigencias tiene la declaración SISREP ante ReSimple?',
    '¿Cómo impacta pasar a 50% rPET en la huella de BioFresh 500ml?',
    '¿Qué evidencias críticas faltan para la auditoría ISO 14064-3?'
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();

      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'No fue posible generar respuesta.',
        timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: 'En este momento no fue posible conectar con el servicio IA. Revisa tu conexión o consulta directamente los paneles de cálculo.',
        timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-slate-100 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-white">Copiloto Ambiental IA</h3>
            <p className="text-[10px] text-emerald-400 font-mono">Gemini 3.7 Flash &middot; Asesor Normativo Chile</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs shadow-2xs font-medium'
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-xs shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <p
                className={`text-[9px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </p>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-100 w-max shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Consultando base normativa y modelos matemáticos...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="p-4 bg-white border-t border-slate-100 space-y-2.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preguntas Rápidas Sugeridas</p>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="text-[11px] bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-xl text-left transition-colors truncate max-w-full"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Pregunta sobre Ley REP, factores HuellaChile o ISO 14064..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
