import React, { useState } from 'react';
import { Search, Loader2, Command } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  hasSearched: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, hasSearched }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className={`transition-all duration-700 ease-out flex flex-col items-center justify-center w-full ${hasSearched ? 'py-4' : 'min-h-[45vh]'}`}>
      
      {!hasSearched && (
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-3xl mb-6 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700">
            <Command className="w-8 h-8 text-blue-600 dark:text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Operator Lookup <span className="text-blue-600 dark:text-blue-500">3.0</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-base md:text-lg leading-relaxed font-light">
            Inteligência operacional para Telecom. Busque contatos, status de rede e reputação em tempo real.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`relative w-full transition-all duration-500 ${hasSearched ? 'max-w-4xl' : 'max-w-xl'}`}>
        <div className="relative group rounded-xl shadow-sm hover:shadow-lg dark:hover:shadow-blue-900/10 transition-shadow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={hasSearched ? "Nova busca..." : "Digite a operadora (ex: Vivo, Algar, Desktop)..."}
            className={`w-full bg-white dark:bg-slate-800/80 backdrop-blur border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
              ${hasSearched 
                ? 'pl-11 pr-24 py-3 border-slate-200 dark:border-slate-700 text-sm' 
                : 'pl-14 pr-4 py-5 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 text-lg'
              }`}
            disabled={isLoading}
          />
          
          <div className={`absolute top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 ${hasSearched ? 'left-3.5' : 'left-5'}`}>
            {isLoading ? (
              <Loader2 className={`animate-spin text-blue-600 dark:text-blue-500 ${hasSearched ? 'w-4 h-4' : 'w-6 h-6'}`} />
            ) : (
              <Search className={`${hasSearched ? 'w-4 h-4' : 'w-6 h-6'}`} />
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`absolute top-1/2 -translate-y-1/2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${hasSearched 
                ? 'right-1.5 px-4 py-1.5 rounded-lg text-xs bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-500' 
                : 'right-2.5 px-6 py-2.5 rounded-lg text-sm bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-500 shadow-md'
              }`}
          >
            {isLoading ? '...' : 'Buscar'}
          </button>
        </div>
        
        {!hasSearched && (
          <div className="mt-8 flex flex-wrap gap-3 justify-center text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
            <span className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm">Google Search API</span>
            <span className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm">Gemini Analysis</span>
            <span className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm">Live Data</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;