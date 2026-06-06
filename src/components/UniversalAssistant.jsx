import React, { useState, useEffect } from 'react';
import { 
  Heart, Zap, User, FileText, Phone, CheckCircle, 
  Search, Package, MapPin, Volume2, Info, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function UniversalAssistant() {
  const { lang, t } = useLanguage();
  const a = t.assistant; // shortcut
  const [mode, setMode] = useState('normal'); // 'normal' или 'care'

  // --- Состояния для режима "Забота" ---
  const [careStep, setCareStep] = useState(1);
  const [careData, setCareData] = useState({ name: '', iin: '', query: '', phone: '' });
  const [isCareSubmitted, setIsCareSubmitted] = useState(false);

  // --- Состояния для Обычного режима ---
  const [statusIin, setStatusIin] = useState('');
  const [trackerStep, setTrackerStep] = useState(-1); // -1: скрыто, 0: получено, 1: поиск, 2: готово
  const [genealogyData, setGenealogyData] = useState({ ancestorName: '', birthYear: '', region: '' });
  const [activeHint, setActiveHint] = useState('');

  // Функция озвучки текста
  const speakText = (text) => {
    if (mode === 'care' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'kz' ? 'kk-KZ' : 'ru-RU';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Остановка озвучки при смене режима или анмаунте
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [mode, lang]);

  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState('');

  // Обработка проверки статуса
  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (statusIin.length === 12) {
      setIsChecking(true);
      setCheckError('');
      setTrackerStep(-1);
      
      try {
        const res = await fetch(`/api/orders?iin=${statusIin}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        
        if (data.length === 0) {
          setCheckError(a.notFound);
        } else {
          setTrackerStep(0);
          setTimeout(() => setTrackerStep(1), 1500);
          setTimeout(() => setTrackerStep(2), 3000);
        }
      } catch (err) {
        setCheckError(a.notFound);
      } finally {
        setIsChecking(false);
      }
    }
  };

  // --- Рендер режима "Забота" (Увеличенный UI, пошаговый) ---
  const renderCareMode = () => {
    if (isCareSubmitted) {
      return (
        <div className="flex flex-col items-center text-center p-8 space-y-6 animate-in fade-in zoom-in duration-500">
          <CheckCircle className="w-24 h-24 text-green-600" />
          <h2 
            className="text-4xl font-bold text-slate-800"
            onMouseEnter={() => speakText(a.successSpeech)}
          >
            {a.successTitle}
          </h2>
          <p className="text-2xl text-slate-700 max-w-lg">
            {a.successDesc.replace('{phone}', careData.phone)}
          </p>
          <button 
            onClick={() => { setCareStep(1); setCareData({ name: '', iin: '', query: '', phone: '' }); setIsCareSubmitted(false); }}
            className="mt-8 px-10 py-5 bg-brand-blue text-white text-2xl font-bold rounded-2xl hover:bg-brand-dark transition-colors"
            onMouseEnter={() => speakText(a.newRequest)}
          >
            {a.newRequest}
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto bg-amber-50 p-8 md:p-12 rounded-3xl border-4 border-amber-200 shadow-xl relative min-h-[500px] flex flex-col">
        {/* Индикатор озвучки */}
        <div className="absolute top-6 right-6 flex items-center text-amber-700 bg-amber-200 px-4 py-2 rounded-full font-bold text-lg animate-pulse">
          <Volume2 className="w-6 h-6 mr-2" /> {a.hoverToSpeak}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {careStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
              <label 
                className="block text-3xl font-bold text-slate-800 mb-6 flex items-center"
                onMouseEnter={() => speakText(a.step1Speech)}
              >
                <User className="w-10 h-10 mr-4 text-brand-blue" />
                {a.step1Title}
              </label>
              <input 
                type="text" 
                value={careData.name}
                onChange={e => setCareData({...careData, name: e.target.value})}
                placeholder={a.step1Placeholder}
                className="w-full text-2xl p-6 rounded-2xl border-4 border-slate-300 focus:border-brand-blue focus:ring-0 outline-none"
              />
            </div>
          )}

          {careStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
              <label 
                className="block text-3xl font-bold text-slate-800 mb-6 flex items-center"
                onMouseEnter={() => speakText(a.step2Speech)}
              >
                <FileText className="w-10 h-10 mr-4 text-brand-blue" />
                {a.step2Title}
              </label>
              <input 
                type="text"
                maxLength="12"
                value={careData.iin}
                onChange={e => setCareData({...careData, iin: e.target.value})}
                placeholder={a.step2Placeholder}
                className="w-full text-3xl tracking-widest text-center p-6 rounded-2xl border-4 border-slate-300 focus:border-brand-blue outline-none"
              />
            </div>
          )}

          {careStep === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
              <label 
                className="block text-3xl font-bold text-slate-800 mb-6 flex items-center"
                onMouseEnter={() => speakText(a.step3Speech)}
              >
                <Search className="w-10 h-10 mr-4 text-brand-blue" />
                {a.step3Title}
              </label>
              <textarea 
                rows="3"
                value={careData.query}
                onChange={e => setCareData({...careData, query: e.target.value})}
                placeholder={a.step3Placeholder}
                className="w-full text-2xl p-6 rounded-2xl border-4 border-slate-300 focus:border-brand-blue outline-none resize-none"
              ></textarea>
            </div>
          )}

          {careStep === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
              <label 
                className="block text-3xl font-bold text-slate-800 mb-6 flex items-center"
                onMouseEnter={() => speakText(a.step4Speech)}
              >
                <Phone className="w-10 h-10 mr-4 text-brand-blue" />
                {a.step4Title}
              </label>
              <input 
                type="tel" 
                value={careData.phone}
                onChange={e => setCareData({...careData, phone: e.target.value})}
                placeholder={a.step4Placeholder}
                className="w-full text-3xl p-6 rounded-2xl border-4 border-slate-300 focus:border-brand-blue outline-none"
              />
            </div>
          )}
        </div>

        {/* Навигация режима Забота */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t-4 border-amber-200">
          <button 
            onClick={() => setCareStep(Math.max(1, careStep - 1))}
            className={`flex items-center px-6 py-4 text-2xl font-bold text-slate-500 hover:text-slate-800 transition-colors ${careStep === 1 ? 'invisible' : ''}`}
            onMouseEnter={() => speakText(a.btnBack)}
          >
            <ArrowLeft className="w-8 h-8 mr-2" /> {a.btnBack}
          </button>

          <span className="text-xl font-bold text-slate-400">
            {a.stepOf.replace('{current}', careStep).replace('{total}', 4)}
          </span>

          {careStep < 4 ? (
            <button 
              onClick={() => setCareStep(careStep + 1)}
              className="flex items-center px-8 py-4 bg-brand-blue text-white text-2xl font-bold rounded-2xl shadow-lg hover:bg-brand-dark transition-all hover:scale-105"
              onMouseEnter={() => speakText(a.btnNext)}
            >
              {a.btnNext} <ArrowRight className="w-8 h-8 ml-2" />
            </button>
          ) : (
            <button 
              onClick={() => setIsCareSubmitted(true)}
              className="flex items-center px-10 py-4 bg-green-600 text-white text-2xl font-bold rounded-2xl shadow-lg hover:bg-green-700 transition-all hover:scale-105"
              onMouseEnter={() => speakText(a.btnSubmit)}
            >
              {a.btnSubmit} <CheckCircle className="w-8 h-8 ml-3" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // --- Рендер Обычного режима ---
  const renderNormalMode = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      
      {/* Левая колонка: Трекер статуса */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full w-full">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl"><Package className="text-brand-blue w-6 h-6" /></div>
          <h3 className="text-2xl font-bold text-slate-800">{a.statusTitle}</h3>
        </div>
        <p className="text-slate-600 mb-6">{a.statusDesc}</p>
        
        <form onSubmit={handleCheckStatus} className="flex flex-col sm:flex-row gap-2 mb-10">
          <input 
            type="text" 
            placeholder={a.iinPlaceholder}
            maxLength="12"
            value={statusIin}
            onChange={e => setStatusIin(e.target.value)}
            className="flex-1 px-5 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none w-full min-w-0"
          />
          <button type="submit" disabled={isChecking} className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-md shrink-0 whitespace-nowrap disabled:opacity-70">
            {isChecking ? a.loading : a.btnCheck}
          </button>
        </form>
        {checkError && <p className="text-red-500 font-bold mb-4 -mt-6">{checkError}</p>}

        {trackerStep >= 0 && (
          <div className="relative flex flex-col space-y-8 mt-auto px-4">
            {/* Линия соединитель */}
            <div className="absolute left-[31px] top-6 bottom-6 w-1 bg-slate-100 rounded-full z-0"></div>
            <div className="absolute left-[31px] top-6 w-1 bg-brand-gold rounded-full z-0 transition-all duration-1000 ease-in-out" 
                 style={{ height: trackerStep === 0 ? '0%' : trackerStep === 1 ? '50%' : '100%' }}></div>

            {/* Шаг 1 */}
            <div className="relative z-10 flex items-center space-x-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 shrink-0 ${trackerStep >= 0 ? 'bg-brand-gold text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}>
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold text-lg ${trackerStep >= 0 ? 'text-slate-800' : 'text-slate-400'}`}>{a.status1Title}</h4>
                <p className="text-sm text-slate-500">{a.status1Desc}</p>
              </div>
            </div>

            {/* Шаг 2 */}
            <div className="relative z-10 flex items-center space-x-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 delay-300 shrink-0 ${trackerStep >= 1 ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' : 'bg-slate-200 text-slate-400'}`}>
                <Search className={`w-6 h-6 ${trackerStep === 1 ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <h4 className={`font-bold text-lg ${trackerStep >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>{a.status2Title}</h4>
                <p className="text-sm text-slate-500">{a.status2Desc}</p>
              </div>
            </div>

            {/* Шаг 3 */}
            <div className="relative z-10 flex items-center space-x-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 delay-500 shrink-0 ${trackerStep === 2 ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-200 text-slate-400'}`}>
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold text-lg ${trackerStep === 2 ? 'text-slate-800' : 'text-slate-400'}`}>{a.status3Title}</h4>
                <p className="text-sm text-slate-500">{a.status3Desc}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Правая колонка: Экспресс генеалогия */}
      <div className="bg-slate-800 p-8 rounded-3xl shadow-xl flex flex-col text-white relative overflow-hidden group h-full w-full">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <MapPin className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-brand-gold/20 p-3 rounded-xl"><User className="text-brand-gold w-6 h-6" /></div>
            <h3 className="text-2xl font-bold text-white">{a.genTitle}</h3>
          </div>
          <p className="text-slate-300 mb-8">{a.genDesc}</p>

          <form className="space-y-6 flex-grow">
            <div className="relative">
              <label className="block text-sm font-semibold text-brand-gold mb-2">{a.genFio}</label>
              <input 
                type="text" 
                placeholder={a.genFioPlaceholder}
                onFocus={() => setActiveHint(a.genFioHint)}
                onBlur={() => setActiveHint('')}
                className="w-full px-5 py-4 rounded-xl bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-brand-gold outline-none text-white placeholder-slate-400 transition-all min-w-0"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-brand-gold mb-2">{a.genYear}</label>
                <input 
                  type="text" 
                  placeholder={a.genYearPlaceholder}
                  onFocus={() => setActiveHint(a.genYearHint)}
                  onBlur={() => setActiveHint('')}
                  className="w-full px-5 py-4 rounded-xl bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-brand-gold outline-none text-white placeholder-slate-400 transition-all min-w-0"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-brand-gold mb-2">{a.genRegion}</label>
                <input 
                  type="text" 
                  placeholder={a.genRegionPlaceholder}
                  onFocus={() => setActiveHint(a.genRegionHint)}
                  onBlur={() => setActiveHint('')}
                  className="w-full px-5 py-4 rounded-xl bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-brand-gold outline-none text-white placeholder-slate-400 transition-all min-w-0"
                />
              </div>
            </div>

            <button type="button" className="w-full py-4 bg-brand-gold text-brand-dark rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-brand-gold/20 flex justify-center items-center mt-6">
              {a.genBtn} <ArrowRight className="ml-2 w-5 h-5 shrink-0" />
            </button>
          </form>

          {/* Интерактивная подсказка */}
          <div className={`mt-6 p-4 rounded-xl bg-brand-blue/30 border border-brand-blue/50 flex items-start space-x-3 transition-opacity duration-300 ${activeHint ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Info className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
            <p className="text-sm text-slate-200">{activeHint}</p>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <div className="my-16 bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 flex items-center">
            {a.title}
            <span className="ml-3 px-3 py-1 bg-brand-blue text-white text-xs rounded-full font-bold uppercase tracking-wider">Beta</span>
          </h2>
          <p className="text-slate-500 mt-2">{a.subtitle}</p>
        </div>

        <div className="flex bg-slate-200 p-1.5 rounded-2xl">
          <button 
            onClick={() => setMode('normal')}
            className={`flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${mode === 'normal' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Zap className="w-4 h-4 mr-2" /> {a.normalMode}
          </button>
          <button 
            onClick={() => setMode('care')}
            className={`flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${mode === 'care' ? 'bg-brand-gold text-brand-dark shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Heart className="w-4 h-4 mr-2" /> {a.careMode}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-10">
        {mode === 'normal' ? renderNormalMode() : renderCareMode()}
      </div>
    </div>
  );
}
