import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Calendar, ChevronRight } from 'lucide-react';

const timelineEvents = [
  {
    id: 1,
    year: '1997',
    title_ru: 'Основание архива',
    title_kz: 'Мұрағаттың құрылуы',
    desc_ru: 'Государственный архив города Астаны был образован 3 октября 1997 года в преддверии переноса столицы.',
    desc_kz: 'Астана қаласының мемлекеттік архиві елорданы көшіру қарсаңында 1997 жылғы 3 қазанда құрылды.'
  },
  {
    id: 2,
    year: '2005',
    title_ru: 'Завершение первой оцифровки',
    title_kz: 'Алғашқы цифрландырудың аяқталуы',
    desc_ru: 'Завершен первый крупный проект по оцифровке важнейших градостроительных документов.',
    desc_kz: 'Ең маңызды қала құрылысы құжаттарын цифрландыру бойынша алғашқы ірі жоба аяқталды.'
  },
  {
    id: 3,
    year: '2015',
    title_ru: 'Открытие современного читального зала',
    title_kz: 'Заманауи оқу залының ашылуы',
    desc_ru: 'Для исследователей открыт новый, оборудованный по последнему слову техники читальный зал.',
    desc_kz: 'Зерттеушілер үшін соңғы технологиямен жабдықталған жаңа оқу залы ашылды.'
  },
  {
    id: 4,
    year: '2022',
    title_ru: 'Утверждение нового Устава',
    title_kz: 'Жаңа Жарғының бекітілуі',
    desc_ru: 'Акиматом города Астана утвержден новый Устав Государственного учреждения, расширяющий спектр услуг.',
    desc_kz: 'Астана қаласының әкімдігі қызметтер спектрін кеңейтетін Мемлекеттік мекеменің жаңа Жарғысын бекітті.'
  },
  {
    id: 5,
    year: '2026',
    title_ru: 'Запуск Универсального Ассистента',
    title_kz: 'Әмбебап Ассистентті іске қосу',
    desc_ru: 'Внедрение новейшей системы цифрового обслуживания для автоматизации выдачи архивных справок.',
    desc_kz: 'Мұрағаттық анықтамаларды беруді автоматтандыру үшін жаңа цифрлық қызмет көрсету жүйесін енгізу.'
  }
];

export default function Timeline() {
  const { lang } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-colors duration-300 overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">
          {lang === 'ru' ? 'Историческая лента' : 'Тарихи шежіре'}
        </h2>
        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">
          {lang === 'ru' ? 'Ключевые вехи в истории города и архива' : 'Қала мен мұрағат тарихындағы негізгі белестер'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Шкала событий */}
        <div className="w-full lg:w-1/3 relative">
          {/* Вертикальная линия */}
          <div className="absolute left-6 top-4 bottom-4 w-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          
          <div className="space-y-2 relative">
            {timelineEvents.map((event, index) => {
              const isActive = index === activeIndex;
              return (
                <div 
                  key={event.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300
                    ${isActive 
                      ? 'bg-brand-blue/5 dark:bg-brand-blue/10 translate-x-2' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:translate-x-1'
                    }
                  `}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-4 z-10 transition-colors duration-300
                    ${isActive 
                      ? 'bg-brand-blue border-brand-blue/20 text-white shadow-lg' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-400'
                    }
                  `}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h3 className={`font-bold text-lg ${isActive ? 'text-brand-blue dark:text-brand-cyan' : 'text-slate-700 dark:text-slate-300'}`}>
                      {event.year}
                    </h3>
                  </div>

                  {isActive && <ChevronRight className="w-5 h-5 text-brand-blue dark:text-brand-cyan" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Блок с описанием */}
        <div className="w-full lg:w-2/3">
          <div className="bg-slate-50 dark:bg-slate-700/40 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 h-full min-h-[300px] flex flex-col justify-center transition-all duration-500 animate-in fade-in slide-in-from-right-4">
            <div className="inline-block px-4 py-1 rounded-full bg-brand-gold/20 text-brand-dark dark:text-brand-gold font-bold text-sm mb-4 w-fit">
              {timelineEvents[activeIndex].year}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
              {timelineEvents[activeIndex][`title_${lang}`]}
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed border-l-4 border-brand-blue pl-4">
              {timelineEvents[activeIndex][`desc_${lang}`]}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
