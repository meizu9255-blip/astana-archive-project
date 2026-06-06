import React, { useState, useEffect } from 'react';
import { Search, Filter, FolderOpen, AlertCircle, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import DocumentViewer from '../components/DocumentViewer';

export default function ArchiveFunds() {
  const { lang, t } = useLanguage();
  const f = t.funds;

  const [searchTerm, setSearchTerm] = useState('');
  // Категории теперь хранятся как индексы массива 'categories' из t.funds.categories
  // По умолчанию 'Все' это index 0
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [fundsData, setFundsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFund, setSelectedFund] = useState(null);

  useEffect(() => {
    fetch('/api/funds')
      .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(data => {
        setFundsData(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(f.error);
        setIsLoading(false);
      });
  }, [f.error]);

  const filteredFunds = fundsData.filter(fund => {
    const title = fund[`title_${lang}`].toLowerCase();
    const shifr = fund.code.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = title.includes(searchLower) || shifr.includes(searchLower);
    
    // index 0 = 'Все' / 'Барлығы'
    const matchesCategory = activeCategoryIndex === 0 || 
                            fund[`category_${lang}`] === f.categories[activeCategoryIndex];
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-900 min-h-screen relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">{f.title}</h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">{f.desc}</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder={f.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-brand-blue focus:border-brand-blue sm:text-sm bg-slate-50 dark:bg-slate-700 dark:text-slate-100 outline-none transition-colors"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {f.categories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategoryIndex(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                    ${activeCategoryIndex === index 
                      ? 'bg-brand-blue text-white shadow-md' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-bold text-slate-600">{f.loading}</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl border border-red-200 dark:border-red-800 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">{error}</h3>
          </div>
        ) : filteredFunds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFunds.map(fund => (
              <div key={fund.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group flex flex-col h-full">
                
                {/* Изображение с эффектом scale */}
                <div className="relative h-40 mb-5 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
                  <img 
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400" 
                    alt="Archive Cover" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80" 
                  />
                  <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-gold/20 text-brand-dark dark:text-brand-gold">
                    <FolderOpen className="w-3 h-3 mr-1" />
                    {fund.code}
                  </span>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{fund.period}</span>
                    <span className={`text-xs px-2 py-1 rounded-md font-bold
                      ${fund[`status_${lang}`] === 'Доступен' || fund[`status_${lang}`] === 'Қолжетімді' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}
                    >
                      {fund[`status_${lang}`]}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-brand-blue dark:group-hover:text-brand-cyan transition-colors">
                  {fund[`title_${lang}`]}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                  {fund[`desc_${lang}`]}
                </p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{fund[`category_${lang}`]}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedFund(fund); }}
                    className="text-brand-blue dark:text-brand-cyan text-sm font-bold hover:text-brand-gold transition-colors flex items-center"
                  >
                    {f.btnDetails}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <AlertCircle className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{f.notFoundTitle}</h3>
            <p className="text-slate-500 max-w-md">
              {f.notFoundDesc.replace('{query}', searchTerm).replace('{category}', f.categories[activeCategoryIndex])}
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategoryIndex(0); }}
              className="mt-6 text-brand-blue font-bold hover:text-brand-gold transition-colors"
            >
              {f.btnReset}
            </button>
          </div>
        )}

      </div>

      {/* Модальное окно */}
      {selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedFund(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-brand-gold/20 p-3 rounded-xl"><FolderOpen className="text-brand-dark w-6 h-6" /></div>
              <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                {selectedFund[`title_${lang}`]}
              </h2>
            </div>
            
            <div className="space-y-4 text-slate-600 mb-8">
              <p className="text-lg border-l-4 border-brand-blue pl-4 bg-slate-50 p-4 rounded-r-lg">
                {selectedFund[`desc_${lang}`]}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{f.modalShifr}</span>
                  <span className="font-semibold text-slate-800">{selectedFund.code}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{f.modalPeriod}</span>
                  <span className="font-semibold text-slate-800">{selectedFund.period}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{f.modalCategory}</span>
                  <span className="font-semibold text-slate-800">{selectedFund[`category_${lang}`]}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedFund(null)}
              className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors"
            >
              {f.modalClose}
            </button>
          </div>
        </div>
      )}

      {/* Цифровой реставратор */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <DocumentViewer />
      </div>
    </div>
  );
}
