import React, { useState } from 'react';
import { OperatorProfile, ContactType, Contact, IncidentEvent, DataReliability, OperationalRisk, SourceMetadata } from '../types';
import { 
  AlertTriangle, RefreshCw, MapPin, ExternalLink, 
  Shield, Globe, Copy, Check, Phone, Mail, 
  MessageCircle, Building2, PhoneCall, Send, ChevronDown, ChevronUp,
  Activity, Info, LifeBuoy, Scale, Smartphone, Briefcase, CheckCircle2, AlertOctagon,
  History, TrendingUp, TrendingDown, Minus, ShieldCheck, Gauge, Newspaper, Lock
} from 'lucide-react';

interface OperatorDashboardProps {
  data: OperatorProfile;
}

interface StatusBadgeProps {
  hasOutage: boolean;
  timestamp: string;
}

// --- SUB-COMPONENT: Status Badge (NOC HERO STYLE v2) ---
const StatusBadge: React.FC<StatusBadgeProps> = ({ hasOutage, timestamp }) => {
  const styles = hasOutage 
    ? {
        container: "bg-red-50 dark:bg-red-950/40 border-l-red-600 dark:border-l-red-500",
        border: "border-red-200 dark:border-red-900",
        textMain: "text-red-800 dark:text-red-100",
        textSub: "text-red-700 dark:text-red-200",
        iconBox: "bg-red-600 text-white shadow-lg shadow-red-500/30",
        indicator: "bg-red-500",
        label: "OPERAÇÃO CRÍTICA",
        desc: "Falha massiva ou instabilidade severa detectada",
        icon: <AlertOctagon className="w-10 h-10" />
      }
    : {
        container: "bg-emerald-50 dark:bg-emerald-950/40 border-l-emerald-600 dark:border-l-emerald-500",
        border: "border-emerald-200 dark:border-emerald-900",
        textMain: "text-emerald-900 dark:text-emerald-50",
        textSub: "text-emerald-800 dark:text-emerald-200",
        iconBox: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30",
        indicator: "bg-emerald-500",
        label: "OPERAÇÃO NORMAL",
        desc: "Sistemas operando dentro dos parâmetros",
        icon: <CheckCircle2 className="w-10 h-10" />
      };

  return (
    <div className={`relative w-full rounded-r-xl border-y border-r border-l-[8px] ${styles.container} ${styles.border} shadow-sm transition-all duration-300`}>
      <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6">
        
        {/* Left: Icon & Status Text */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className={`flex-shrink-0 p-4 rounded-2xl ${styles.iconBox} ${hasOutage ? 'animate-pulse' : ''}`}>
            {styles.icon}
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`flex w-3 h-3 rounded-full ${styles.indicator} ${hasOutage ? 'animate-ping' : ''}`}></span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-70 dark:text-white/80">
                Status Operacional
              </span>
            </div>
            <h2 className={`text-2xl md:text-4xl font-black tracking-tight leading-none ${styles.textMain}`}>
              {styles.label}
            </h2>
            <p className={`text-base font-medium mt-2 opacity-90 ${styles.textSub}`}>
              {styles.desc}
            </p>
          </div>
        </div>

        {/* Right: Timestamp & Meta */}
        <div className="flex flex-col items-end justify-center pl-6 border-l border-current/10 w-full md:w-auto min-w-[160px]">
           <div className="flex items-center gap-2 mb-2 opacity-70 dark:text-white/80">
             <RefreshCw className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-wider">Última leitura</span>
           </div>
           <div className="bg-white/50 dark:bg-black/20 px-5 py-3 rounded-lg border border-current/10 backdrop-blur-sm">
              <span className={`text-3xl font-mono font-bold tracking-tight ${styles.textMain}`}>
                {new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
           </div>
        </div>

      </div>
      
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

// --- SUB-COMPONENT: Operational Risk Card ---
const OperationalRiskCard: React.FC<{ risk: OperationalRisk }> = ({ risk }) => {
  const getColor = () => {
    if (risk.level === 'ALTO') return 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10';
    if (risk.level === 'MODERADO') return 'text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/10';
    return 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/10';
  };

  const colorClass = getColor();

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${colorClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Gauge className="w-4 h-4" /> Risco Operacional
        </h3>
        <span className="px-3 py-1 rounded text-xs font-bold uppercase border border-current/20 bg-white/50 dark:bg-black/20">
          {risk.level}
        </span>
      </div>
      
      <div className="flex items-end gap-4 mb-4">
        <span className="text-5xl font-black tracking-tight leading-none">
          {risk.score}%
        </span>
        <div className="flex-1 pb-2">
          <div className="h-3 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-current transition-all duration-1000 ease-out" 
              style={{ width: `${risk.score}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase opacity-80 mb-1">Fatores de Risco:</p>
        {risk.factors.length > 0 ? (
          <ul className="list-disc list-inside text-sm font-medium opacity-90 space-y-1">
            {risk.factors.slice(0, 3).map((f, i) => <li key={i} className="truncate">{f}</li>)}
          </ul>
        ) : (
          <p className="text-sm opacity-80 italic">Nenhum fator crítico identificado.</p>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Data Reliability Card ---
const DataReliabilityCard: React.FC<{ reliability: DataReliability }> = ({ reliability }) => {
  const getColor = () => {
    if (reliability.score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (reliability.score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm dark:shadow-slate-900/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Confiabilidade dos Dados
        </h3>
        <span className={`text-xl font-bold font-mono ${getColor()}`}>
          {reliability.score}%
        </span>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
        {reliability.explanation}
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div className={`p-3 rounded border text-center ${reliability.criteria.source_count ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-50'}`}>
          <span className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Fontes Múltiplas</span>
          {reliability.criteria.source_count && <Check className="w-4 h-4 text-blue-500 mx-auto" />}
        </div>
        <div className={`p-3 rounded border text-center ${reliability.criteria.cross_validation ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-50'}`}>
          <span className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Validação Cruzada</span>
          {reliability.criteria.cross_validation && <Check className="w-4 h-4 text-blue-500 mx-auto" />}
        </div>
        <div className={`p-3 rounded border text-center ${reliability.criteria.recent_update ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-50'}`}>
          <span className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Dados Recentes</span>
          {reliability.criteria.recent_update && <Check className="w-4 h-4 text-blue-500 mx-auto" />}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Incident History Card ---
const IncidentHistoryCard: React.FC<{ history: IncidentEvent[]; trend: string }> = ({ history, trend }) => {
  const TrendIcon = trend === 'MELHORANDO' ? TrendingUp : trend === 'DEGRADANDO' ? TrendingDown : Minus;
  const trendColor = trend === 'MELHORANDO' ? 'text-emerald-500' : trend === 'DEGRADANDO' ? 'text-red-500' : 'text-slate-400';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4" /> Histórico de Incidentes (30d)
        </h3>
        <div className={`flex items-center gap-2 text-xs font-bold ${trendColor} bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded`}>
          <TrendIcon className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      </div>

      <div className="relative border-l border-slate-200 dark:border-slate-700 ml-2 space-y-6 pl-5 py-1">
        {history.length > 0 ? history.map((event, idx) => (
          <div key={idx} className="relative">
            {/* Timeline Dot */}
            <span className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${
              event.severity === 'ALTA' ? 'bg-red-500' : event.severity === 'MEDIA' ? 'bg-yellow-500' : 'bg-blue-400'
            }`}></span>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-slate-600 dark:text-slate-400 font-medium">
                  {new Date(event.date).toLocaleDateString()}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                   event.severity === 'ALTA' ? 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900' : 
                   event.severity === 'MEDIA' ? 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-900' : 
                   'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900'
                }`}>
                  {event.severity}
                </span>
              </div>
              <p className="text-base text-slate-800 dark:text-slate-100 font-medium leading-snug">
                {event.summary}
              </p>
              {event.duration && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Duração aprox: {event.duration}</span>
              )}
            </div>
          </div>
        )) : (
          <div className="py-2 text-slate-500 dark:text-slate-400 text-sm italic">
            Nenhum incidente relevante registrado no período.
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Sources List ---
const SourcesList: React.FC<{ sources: SourceMetadata[] }> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to get Icon by Type
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'OFICIAL': return <Lock className="w-4 h-4 text-blue-500" />;
      case 'TERCEIROS': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'NOTICIA': return <Newspaper className="w-4 h-4 text-slate-500" />;
      default: return <Globe className="w-4 h-4 text-slate-400" />;
    }
  };

  // Helper for Reliability Badge
  const getReliabilityBadge = (level: string) => {
    switch(level) {
      case 'ALTA': return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">CONFIÁVEL</span>;
      case 'MEDIA': return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800/50">MÉDIA</span>;
      default: return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">BAIXA</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm dark:shadow-slate-900/50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Fontes & Grounding
          </span>
          <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-700 dark:text-slate-200 font-mono font-bold">
            {sources.length}
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      
      {isOpen && (
        <div className="p-0 border-t border-slate-100 dark:border-slate-700/50 max-h-80 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
               <tr>
                 <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-10">Tipo</th>
                 <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fonte / URL</th>
                 <th className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Confiança</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
               {sources.map((src, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                   <td className="px-4 py-3" title={src.type}>
                     {getTypeIcon(src.type)}
                   </td>
                   <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title={src.title}>
                          {src.title}
                        </span>
                        <a href={src.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-[200px] flex items-center gap-1">
                          {new URL(src.url).hostname} <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Coletado às {new Date(src.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                   </td>
                   <td className="px-4 py-3 text-right align-top">
                      {getReliabilityBadge(src.reliability)}
                   </td>
                 </tr>
               ))}
               {sources.length === 0 && (
                 <tr>
                   <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500 italic">
                     Nenhuma fonte externa direta retornada. Análise baseada em conhecimento interno.
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: Contact Chip ---
const ContactChip: React.FC<{ contact: Contact }> = ({ contact }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeStyles = (type: ContactType) => {
    switch (type) {
      case ContactType.WHATSAPP:
        return { 
          bg: "bg-green-50 dark:bg-green-900/20", 
          text: "text-green-700 dark:text-green-300", 
          border: "border-green-200 dark:border-green-800",
          icon: <MessageCircle className="w-4 h-4" />,
          label: "WhatsApp"
        };
      case ContactType.SAC:
      case ContactType.SUPORTE_TECNICO:
        return { 
          bg: "bg-blue-50 dark:bg-blue-900/20", 
          text: "text-blue-700 dark:text-blue-300", 
          border: "border-blue-200 dark:border-blue-800",
          icon: <LifeBuoy className="w-4 h-4" />,
          label: type === ContactType.SAC ? "SAC 24h" : "Suporte"
        };
      case ContactType.OUVIDORIA:
        return { 
          bg: "bg-purple-50 dark:bg-purple-900/20", 
          text: "text-purple-700 dark:text-purple-300", 
          border: "border-purple-200 dark:border-purple-800",
          icon: <Scale className="w-4 h-4" />,
          label: "Ouvidoria"
        };
      case ContactType.EMAIL:
        return { 
          bg: "bg-slate-50 dark:bg-slate-800", 
          text: "text-slate-600 dark:text-slate-400", 
          border: "border-slate-200 dark:border-slate-700",
          icon: <Mail className="w-4 h-4" />,
          label: "E-mail"
        };
      default:
        return { 
          bg: "bg-slate-50 dark:bg-slate-800", 
          text: "text-slate-600 dark:text-slate-400", 
          border: "border-slate-200 dark:border-slate-700",
          icon: <Phone className="w-4 h-4" />,
          label: "Comercial"
        };
    }
  };

  const style = getTypeStyles(contact.type);

  let actionUrl = '';
  let ActionButtonIcon = PhoneCall;
  let actionTitle = 'Ligar';
  
  if (contact.type === ContactType.WHATSAPP) {
    const cleanNumber = contact.value.replace(/\D/g, '');
    actionUrl = `https://wa.me/55${cleanNumber}`;
    ActionButtonIcon = ExternalLink;
    actionTitle = 'Abrir WhatsApp';
  } else if (contact.type === ContactType.EMAIL) {
    actionUrl = `mailto:${contact.value}`;
    ActionButtonIcon = Send;
    actionTitle = 'Enviar E-mail';
  } else {
    const cleanNumber = contact.value.replace(/\D/g, '');
    actionUrl = `tel:${cleanNumber}`;
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${style.bg} ${style.border} group transition-all hover:shadow-md`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex-shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-current/10 ${style.text}`}>
          {style.icon}
          <span className="text-xs font-bold uppercase tracking-wide whitespace-nowrap flex-shrink-0">{style.label}</span>
        </div>
        <div className="min-w-0 flex flex-col">
          <span className="text-lg font-mono font-bold text-slate-800 dark:text-slate-100 truncate select-all leading-none">
            {contact.value}
          </span>
          {contact.available_hours && (
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate font-medium">
              {contact.available_hours}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 pl-3">
        <a 
          href={actionUrl}
          target={contact.type === ContactType.WHATSAPP ? '_blank' : undefined}
          rel={contact.type === ContactType.WHATSAPP ? 'noreferrer' : undefined}
          className={`p-2 rounded-md hover:bg-white dark:hover:bg-slate-700 ${style.text} transition-colors`}
          title={actionTitle}
        >
          <ActionButtonIcon className="w-4 h-4" />
        </a>
        <button 
          onClick={handleCopy}
          className="p-2 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
          title="Copiar"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ data }) => {
  const [showAllSources, setShowAllSources] = useState(false);

  const groupedContacts = {
    support: data.contacts.filter(c => [ContactType.SAC, ContactType.SUPORTE_TECNICO].includes(c.type)),
    digital: data.contacts.filter(c => [ContactType.WHATSAPP, ContactType.EMAIL].includes(c.type)),
    ombudsman: data.contacts.filter(c => [ContactType.OUVIDORIA].includes(c.type)),
    commercial: data.contacts.filter(c => [ContactType.VENDAS, ContactType.OUTRO].includes(c.type)),
  };

  const hasContacts = data.contacts.length > 0;

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 md:p-6 animate-fade-in text-slate-800 dark:text-slate-200">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* === COLUMN 1: IDENTITY (20%) === */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm sticky top-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 text-xl font-bold shadow-md">
                {data.name.substring(0, 1)}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight truncate" title={data.name}>{data.name}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate uppercase tracking-wider font-medium" title={data.legal_name}>{data.legal_name || 'Razão Social N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              {data.cnpj && (
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Building2 className="w-4 h-4" /> CNPJ</span>
                   <span className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300 select-all">{data.cnpj}</span>
                 </div>
              )}
              {data.website && (
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-4 h-4" /> Site</span>
                   <a href={data.website} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[140px]">
                     {data.website.replace(/^https?:\/\/(www\.)?/, '')}
                   </a>
                 </div>
              )}
              <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><RefreshCw className="w-4 h-4" /> Updated</span>
                   <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{new Date(data.last_analyzed).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* === COLUMN 2: ACTION & STATUS (50%) === */}
        <div className="lg:col-span-6 flex flex-col gap-6">
           
           {/* 1. STATUS (HERO) */}
           <StatusBadge hasOutage={data.outage_status.has_active_outage} timestamp={data.last_analyzed} />

           {/* 1.5 RISK ASSESSMENT (NEW) */}
           {data.operational_risk && <OperationalRiskCard risk={data.operational_risk} />}

           {/* 2. CONTACTS (GROUPED & COMPACT) */}
           <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80 rounded-t-xl backdrop-blur-sm">
                <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Canais de Atendimento
                </h3>
                <span className="text-xs font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">
                  {data.contacts.length} encontrados
                </span>
              </div>
              
              <div className="p-5 space-y-6">
                {!hasContacts && (
                  <div className="text-center py-6 text-slate-400 dark:text-slate-500 italic text-sm">
                    Nenhum contato público identificado.
                  </div>
                )}

                {/* Group: Support & Emergency */}
                {groupedContacts.support.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                      <LifeBuoy className="w-3.5 h-3.5" /> Suporte & Emergência
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupedContacts.support.map((c, i) => <ContactChip key={i} contact={c} />)}
                    </div>
                  </div>
                )}

                {/* Group: Digital */}
                {groupedContacts.digital.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" /> Digital & WhatsApp
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupedContacts.digital.map((c, i) => <ContactChip key={i} contact={c} />)}
                    </div>
                  </div>
                )}

                {/* Group: Ombudsman */}
                {groupedContacts.ombudsman.length > 0 && (
                  <div className="space-y-3">
                     <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5" /> Ouvidoria & Escalada
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupedContacts.ombudsman.map((c, i) => <ContactChip key={i} contact={c} />)}
                    </div>
                  </div>
                )}

                {/* Group: Commercial */}
                {groupedContacts.commercial.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Comercial & Outros
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupedContacts.commercial.map((c, i) => <ContactChip key={i} contact={c} />)}
                    </div>
                  </div>
                )}
              </div>
           </div>

           {/* 3. INCIDENT HISTORY (NEW) */}
           {data.incident_history && (
             <IncidentHistoryCard 
               history={data.incident_history.events} 
               trend={data.incident_history.stability_trend} 
             />
           )}

           {/* Outage Details */}
           {data.outage_status.has_active_outage && (
             <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-red-800 dark:text-red-400 mb-1.5">Diagnóstico de Falha</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed mb-4 font-medium">
                      {data.outage_status.description}
                    </p>
                    {data.outage_status.affected_regions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {data.outage_status.affected_regions.map(r => (
                          <span key={r} className="px-2 py-1 bg-white/60 dark:bg-red-950/40 text-red-800 dark:text-red-300 text-xs font-bold uppercase rounded border border-red-100 dark:border-red-900/30">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
             </div>
           )}
        </div>

        {/* === COLUMN 3: ANALYSIS & CONTEXT (30%) === */}
        <div className="lg:col-span-3 flex flex-col gap-6">
           
           {/* 4. COVERAGE */}
           <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm dark:shadow-slate-900/50">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Cobertura (UF)
            </h3>
            <div className="flex flex-wrap gap-2">
               {data.coverage.length > 0 ? data.coverage.map(uf => (
                 <span key={uf} className="inline-flex items-center justify-center w-9 h-8 rounded-md bg-slate-50 dark:bg-slate-700/50 text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600/50 cursor-help hover:border-blue-300 hover:text-blue-600 transition-colors" title={`Atende ${uf}`}>
                   {uf}
                 </span>
               )) : <span className="text-sm text-slate-400 italic">Regional / Não inf.</span>}
            </div>
           </div>

           {/* 5. REPUTATION */}
           <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 p-5">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Reputação & Qualidade
              </h3>
              
              {data.reputation.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {data.reputation.map((rep, idx) => (
                    <div key={idx} className="group relative">
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{rep.source}</span>
                          <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{rep.score}<span className="text-xs text-slate-400 font-normal">/10</span></span>
                       </div>
                       <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                          <div 
                             className={`h-full ${rep.score >= 8 ? 'bg-emerald-500' : rep.score >= 6 ? 'bg-blue-500' : rep.score >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                             style={{ width: `${(rep.score / 10) * 100}%` }}
                          ></div>
                       </div>
                       <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right uppercase tracking-wide font-medium">
                         {rep.status}
                       </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 text-sm text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded">
                  Sem dados de reputação.
                </div>
              )}
           </div>

           {/* 6. DATA RELIABILITY (NEW) */}
           {data.data_reliability && <DataReliabilityCard reliability={data.data_reliability} />}

           {/* 7. SOURCES (UPDATED) */}
           {data.sources && <SourcesList sources={data.sources} />}

           {/* AI Summary */}
           <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Grounding AI</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify font-medium">
                Dados consolidados automaticamente em {new Date(data.last_analyzed).toLocaleDateString()}. Valide as informações críticas diretamente com a operadora antes de tomar ações de bloqueio ou escalonamento.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;