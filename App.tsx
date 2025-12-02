import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import OperatorDashboard from './components/OperatorDashboard';
import LoadingScreen from './components/LoadingScreen';
import { fetchOperatorData } from './services/geminiService';
import { OperatorProfile } from './types';
import { Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<OperatorProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Apply theme to HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setSearchData(null); 

    try {
      const result = await fetchOperatorData(query);
      setSearchData(result);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os dados. Verifique a conexão ou tente outra operadora.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B1121] text-slate-900 dark:text-slate-100 transition-colors duration-500">
        
        {/* Header / Theme Toggle */}
        <header className="absolute top-0 right-0 p-6 z-50">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-slate-600 dark:text-slate-300"
            title={`Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative w-full">
          
          <div className="w-full max-w-[1400px] mx-auto px-4 pt-4">
             <SearchBar 
                onSearch={handleSearch} 
                isLoading={isLoading} 
                hasSearched={!!searchData || isLoading} 
             />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="w-full max-w-xl mx-auto px-4 animate-fade-in mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 text-sm shadow-sm backdrop-blur-sm">
                <span className="font-bold">Erro:</span>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Dynamic Loading Screen */}
          {isLoading && !searchData && (
             <LoadingScreen />
          )}

          {/* Dashboard Results */}
          {searchData && !isLoading && (
            <OperatorDashboard data={searchData} />
          )}

        </main>

        <footer className="py-8 text-center border-t border-slate-200 dark:border-slate-800/50 mt-8">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            © 2025 Operator Lookup 3.0 • NOC Intelligence System • Powered by Gemini 2.5
          </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;