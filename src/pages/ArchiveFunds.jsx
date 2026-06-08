import React, { useState, useEffect } from 'react';
import { Search, Filter, FolderOpen, AlertCircle, X, ArrowRight, BookOpen, Building2, Camera, FileText } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import DetailsModal from '../components/DetailsModal';
import Timeline from '../components/Timeline';
import { fundsData as localFundsData } from '../data';

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
        const enrichedData = data.map(fund => {
          const localFund = localFundsData.find(f => f.code === fund.code);
          return {
            ...fund,
            fullText_ru: localFund ? localFund.fullText_ru : fund.desc_ru,
            fullText_kz: localFund ? localFund.fullText_kz : fund.desc_kz
          };
        });
        setFundsData(enrichedData);
        setIsLoading(false);
      })
      .catch(err => {
        setError(f.error);
        setIsLoading(false);
      });
  }, [f.error]);

  const getCategoryStyle = (categoryRu) => {
    if (!categoryRu) return { icon: FolderOpen, gradient: 'from-slate-100 to-gray-200 dark:from-slate-800 dark:to-gray-700', iconColor: 'text-slate-600 dark:text-slate-400' };
    if (categoryRu.includes('Дореволюционный')) return { icon: BookOpen, gradient: 'from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20', iconColor: 'text-amber-600 dark:text-amber-500' };
    if (categoryRu.includes('Советский')) return { icon: FileText, gradient: 'from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20', iconColor: 'text-red-600 dark:text-red-500' };
    if (categoryRu.includes('Современный')) return { icon: Building2, gradient: 'from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20', iconColor: 'text-blue-600 dark:text-blue-500' };
    if (categoryRu.includes('Фото')) return { icon: Camera, gradient: 'from-purple-50 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20', iconColor: 'text-purple-600 dark:text-purple-500' };
    return { icon: FolderOpen, gradient: 'from-slate-100 to-gray-200 dark:from-slate-800 dark:to-gray-700', iconColor: 'text-slate-600 dark:text-slate-400' };
  };

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
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">{f.title}</h1>
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
              <div key={fund.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group flex flex-col h-full relative overflow-hidden">
                
                {/* Фоновый градиент карточки */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryStyle(fund.category_ru).gradient} opacity-50 dark:opacity-20 pointer-events-none`}></div>

                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
                    {React.createElement(getCategoryStyle(fund.category_ru).icon, { className: `w-6 h-6 ${getCategoryStyle(fund.category_ru).iconColor}` })}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-md backdrop-blur-sm">{fund.period}</span>
                    <span className={`text-xs px-2 py-1 rounded-md font-bold shadow-sm
                      ${fund[`status_${lang}`] === 'Доступен' || fund[`status_${lang}`] === 'Қолжетімді' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'}`}
                    >
                      {fund[`status_${lang}`]}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 mb-4 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-sm border border-slate-100 dark:border-slate-600">
                    <FolderOpen className="w-3 h-3 mr-1" />
                    {fund.code}
                  </span>
                </div>


                <h3 className="relative z-10 text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-brand-blue dark:group-hover:text-brand-cyan transition-colors">
                  {fund[`title_${lang}`]}
                </h3>
                <p className="relative z-10 text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                  {fund[`desc_${lang}`]}
                </p>
                <div className="relative z-10 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{fund[`category_${lang}`]}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedFund(fund); }}
                    className="text-brand-blue dark:text-brand-cyan text-sm font-bold hover:text-brand-gold transition-colors flex items-center cursor-pointer"
                  >
                    {f.btnDetails}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center transition-colors duration-300">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-full mb-6 border-2 border-dashed border-slate-300 dark:border-slate-600">
              <FolderOpen className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{f.notFoundTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              {f.notFoundDesc.replace('{query}', searchTerm).replace('{category}', f.categories[activeCategoryIndex])}
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategoryIndex(0); }}
              className="mt-6 text-brand-blue dark:text-brand-cyan font-bold hover:text-brand-gold transition-colors flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              {f.btnReset}
            </button>
          </div>
        )}

      </div>

      {/* Модальное окно */}
      <DetailsModal 
        isOpen={!!selectedFund}
        onClose={() => setSelectedFund(null)}
        title={selectedFund ? selectedFund[`title_${lang}`] : ''}
        meta={selectedFund ? `${f.modalShifr}: ${selectedFund.code} | ${f.modalCategory}: ${selectedFund[`category_${lang}`]} | ${f.modalPeriod}: ${selectedFund.period}` : ''}
        content={selectedFund ? selectedFund[`fullText_${lang}`] : ''}
        icon={FolderOpen}
      />

      {/* Историческая лента (Timeline) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <Timeline />
      </div>
    </div>
  );
}
