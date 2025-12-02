import React, { useState, useEffect } from 'react';
import { Loader2, Server, Globe, ShieldCheck, Search, Database, Cpu, Activity, Wifi, Terminal } from 'lucide-react';

const steps = [
  { icon: Search, text: "Iniciando varredura global...", detail: "Conectando ao Google Search Index..." },
  { icon: Globe, text: "Mapeando fontes de dados...", detail: "Filtrando domínios oficiais e notícias..." },
  { icon: ShieldCheck, text: "Auditando reputação...", detail: "Cruzando dados Reclame Aqui/Consumidor..." },
  { icon: Database, text: "Normalizando contatos...", detail: "Validando padrões de telefonia (ITU-T)..." },
  { icon: Server, text: "Compilando inteligência...", detail: "Gerando inferências de risco e qualidade..." }
];

const tips = [
  "DICA: O índice de 'Confiabilidade' cruza dados de até 3 fontes diferentes.",
  "SABIA? Números 0800 geralmente indicam atendimento nacional gratuito.",
  "INFO: A 'Análise de Sentimento' lê o tom de notícias recentes para gerar notas.",
  "DICA: Use o 'Histórico de Incidentes' para prever janelas de manutenção.",
  "INFO: Dados são cacheados temporariamente para agilizar novas consultas."
];

const LoadingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState({ cpu: 12, ram: 40, ping: 24 });
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle Steps
  useEffect(() => {
    const stepDuration = 1500; // Average time per step
    const timers = steps.map((_, index) => {
      if (index === 0) return null;
      return setTimeout(() => {
        setCurrentStep(index);
      }, index * stepDuration);
    });

    return () => timers.forEach(timer => timer && clearTimeout(timer));
  }, []);

  // Animate Progress Bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(old => {
        if (old >= 100) return 100;
        const jump = Math.random() * 5;
        return Math.min(old + jump, 100);
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Simulate System Metrics (Visual noise)
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * (80 - 10) + 10),
        ram: Math.floor(Math.random() * (60 - 30) + 30),
        ping: Math.floor(Math.random() * (120 - 20) + 20),
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Cycle Tips
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
      
      {/* === TOP SECTION: MAIN STATUS === */}
      <div className="w-full max-w-3xl mb-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-5 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-100 dark:border-slate-700 mb-6 relative group">
          <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/30 rounded-full animate-ping opacity-75"></div>
          <CurrentIcon className="w-10 h-10 text-blue-600 dark:text-blue-400 relative z-10 transition-all duration-500 group-hover:scale-110" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight transition-all duration-300">
          {steps[currentStep].text}
        </h2>
        <p className="text-base text-slate-500 dark:text-slate-400 font-medium opacity-90">
          {steps[currentStep].detail}
        </p>
      </div>

      {/* === MIDDLE SECTION: DASHBOARD METRICS === */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Left: Progress & Terminal */}
        <div className="flex flex-col gap-6">
           {/* Progress Bar */}
           <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progresso da Análise</span>
                <span className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-200 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
           </div>

           {/* Tips Box */}
           <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex items-start gap-3">
              <Activity className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-1">Status do Sistema</span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug animate-fade-in key={tipIndex}">
                  {tips[tipIndex]}
                </p>
              </div>
           </div>
        </div>

        {/* Right: System Metrics Simulator */}
        <div className="bg-slate-900 text-slate-200 p-5 rounded-xl font-mono border border-slate-700 shadow-lg flex flex-col justify-between min-h-[160px]">
           <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
             <div className="flex items-center gap-2">
               <Terminal className="w-4 h-4 text-emerald-400" />
               <span className="text-xs font-bold text-emerald-400 uppercase">System Monitor</span>
             </div>
             <div className="flex gap-1.5">
               <span className="w-2 h-2 rounded-full bg-red-500"></span>
               <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
             </div>
           </div>

           <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-1">
                 <Cpu className="w-5 h-5 text-slate-500" />
                 <span className="text-2xl font-bold">{metrics.cpu}%</span>
                 <span className="text-[10px] uppercase text-slate-500">vCPU Usage</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-l border-slate-700">
                 <Database className="w-5 h-5 text-slate-500" />
                 <span className="text-2xl font-bold">{metrics.ram}%</span>
                 <span className="text-[10px] uppercase text-slate-500">RAM Alloc</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-l border-slate-700">
                 <Wifi className="w-5 h-5 text-slate-500" />
                 <span className="text-2xl font-bold">{metrics.ping}<span className="text-xs font-normal text-slate-500 ml-0.5">ms</span></span>
                 <span className="text-[10px] uppercase text-slate-500">Latency</span>
              </div>
           </div>
        </div>

      </div>

      {/* === BOTTOM SECTION: DETAILED LOG === */}
      <div className="w-full max-w-4xl bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm overflow-hidden relative">
        <div className="space-y-3 relative z-10">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-3 transition-all duration-500 ${
                index > currentStep 
                  ? 'opacity-30' 
                  : index === currentStep 
                    ? 'text-blue-700 dark:text-blue-400 font-bold translate-x-1' 
                    : 'text-emerald-600 dark:text-emerald-500'
              }`}
            >
              <div className={`w-2 h-2 rounded-sm ${
                index > currentStep ? 'bg-slate-300 dark:bg-slate-700' : index === currentStep ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'
              }`}></div>
              <span className="w-16 text-[10px] opacity-60">
                {index <= currentStep ? `00:00:0${index + 2}` : '--:--:--'}
              </span>
              <span>{index === currentStep ? '> Executing: ' : '[OK] '}{step.text}</span>
            </div>
          ))}
        </div>
        {/* Matrix background effect hint */}
        <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
           <Loader2 className="w-24 h-24 animate-spin text-slate-900 dark:text-white" />
        </div>
      </div>

    </div>
  );
};

export default LoadingScreen;
