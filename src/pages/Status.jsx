import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Search, CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Status() {
  const { lang } = useLanguage();
  const [reqId, setReqId] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!reqId.trim()) {
      setError(true);
      setStatusResult(null);
      return;
    }
    setError(false);
    setIsLoading(true);
    setStatusResult(null);

    try {
      const res = await fetch('/api/admin/requests');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      const foundOrder = data.find(req => req.id.toLowerCase() === reqId.trim().toLowerCase());
      
      if (foundOrder) {
        setStatusResult({
          id: foundOrder.id,
          date: new Date(foundOrder.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'kk-KZ'),
          dbStatus: foundOrder.status
        });
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const currentDbStatus = statusResult ? statusResult.dbStatus : '';
  
  const getStepStatus = (stepIndex) => {
    if (!currentDbStatus) return 'pending';
    let dbIndex = 0;
    if (currentDbStatus === 'Заявка принята') dbIndex = 0;
    else if (currentDbStatus === 'В обработке') dbIndex = 1;
    else if (currentDbStatus === 'Готово к выдаче') dbIndex = 2;
    else return 'pending'; // например 'Отклонено'

    if (stepIndex < dbIndex) return 'done';
    if (stepIndex === dbIndex) return 'current';
    return 'pending';
  };

  const steps = [
    {
      id: 1,
      title: lang === 'ru' ? 'Заявка принята' : 'Өтініш қабылданды',
      status: getStepStatus(0),
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/50',
      border: 'border-green-600 dark:border-green-400',
    },
    {
      id: 2,
      title: lang === 'ru' ? 'В обработке' : 'Өңделуде',
      status: getStepStatus(1),
      icon: Clock,
      color: 'text-brand-gold',
      bg: 'bg-yellow-100 dark:bg-yellow-900/50',
      border: 'border-brand-gold',
    },
    {
      id: 3,
      title: lang === 'ru' ? 'Готово к выдаче' : 'Беруге дайын',
      status: getStepStatus(2),
      icon: FileText,
      color: 'text-slate-400 dark:text-slate-500',
      bg: 'bg-slate-100 dark:bg-slate-800',
      border: 'border-slate-300 dark:border-slate-600',
    }
  ];

  const activeLineClass = currentDbStatus === 'Готово к выдаче' ? 'w-full' : currentDbStatus === 'В обработке' ? 'w-1/2' : 'w-0';

  const t = {
    title: lang === 'ru' ? 'Статус заявки' : 'Өтініш мәртебесі',
    desc: lang === 'ru' ? 'Введите номер вашей заявки (например, REQ-123), чтобы узнать текущий этап ее обработки в архиве.' : 'Өтінішіңіздің (мысалы, REQ-123) өңделуінің ағымдағы кезеңін білу үшін оның нөмірін енгізіңіз.',
    placeholder: lang === 'ru' ? 'Номер заявки...' : 'Өтініш нөмірі...',
    btn: lang === 'ru' ? 'Проверить' : 'Тексеру',
    error: lang === 'ru' ? 'Пожалуйста, введите номер заявки' : 'Өтініш нөмірін енгізіңіз',
    resultTitle: lang === 'ru' ? 'Результат по заявке: ' : 'Өтініш бойынша нәтиже: ',
    date: lang === 'ru' ? 'Дата поступления: ' : 'Келіп түскен күні: '
  };

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">{t.title}</h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t.desc}</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 transition-colors duration-300"
        >
          <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-4 relative">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={reqId}
                onChange={(e) => {
                  setReqId(e.target.value);
                  if (error) setError(false);
                }}
                placeholder={t.placeholder}
                className={`w-full pl-11 pr-4 py-4 rounded-xl border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-brand-blue dark:focus:ring-brand-cyan'} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              />
              {error && (
                <div className="absolute -bottom-6 left-2 flex items-center text-red-500 text-xs mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {t.error}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-brand-blue hover:bg-blue-800 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all duration-300 whitespace-nowrap flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                t.btn
              )}
            </button>
          </form>
        </motion.div>

        {statusResult && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 lg:p-12 border border-slate-100 dark:border-slate-700 overflow-hidden"
          >
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {t.resultTitle} <span className="text-brand-blue dark:text-brand-cyan">{statusResult.id}</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400">{t.date} {statusResult.date}</p>
            </div>

            {/* Прогресс-бар (горизонтальный для md+, вертикальный для mobile) */}
            <div className="relative">
              {/* Линия соединяющая шаги */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 rounded-full z-0"></div>
              
              {/* Активная линия (до текущего шага) */}
              <div className={`hidden md:block absolute top-1/2 left-0 h-1 bg-brand-gold -translate-y-1/2 rounded-full z-0 transition-all duration-700 ${activeLineClass}`}></div>

              <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex md:flex-col items-center group relative">
                    
                    {/* Мобильная линия связи */}
                    {index !== steps.length - 1 && (
                      <div className={`md:hidden absolute left-6 top-14 bottom-0 w-1 ${step.status === 'done' ? 'bg-brand-gold' : 'bg-slate-200 dark:bg-slate-700'} z-0`} style={{ height: 'calc(100% + 2rem)' }}></div>
                    )}

                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 relative z-10 transition-transform duration-300 group-hover:scale-110 
                      ${step.bg} ${step.border} ${step.status === 'current' ? 'ring-4 ring-brand-gold/30' : ''}`}
                    >
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    
                    <div className="ml-4 md:ml-0 md:mt-4 text-left md:text-center">
                      <div className={`font-bold text-lg md:text-base ${step.status === 'pending' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                        {step.status === 'done' && (lang === 'ru' ? 'Выполнено' : 'Орындалды')}
                        {step.status === 'current' && (lang === 'ru' ? 'Текущий этап' : 'Ағымдағы кезең')}
                        {step.status === 'pending' && (lang === 'ru' ? 'Ожидает' : 'Күтілуде')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
