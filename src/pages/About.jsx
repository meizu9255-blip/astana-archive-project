import React from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Clock, Users, Database, Server, Smartphone, User, Code, FileSearch, FileText } from 'lucide-react';

const stats = [
  { id: 1, icon: BookOpen, value: '850 000+', label_ru: 'Единиц хранения', label_kz: 'Сақтау бірліктері' },
  { id: 2, icon: Clock, value: '25+', label_ru: 'Лет истории', label_kz: 'Жыл тарихы' },
  { id: 3, icon: Users, value: '150 000+', label_ru: 'Обслуженных граждан', label_kz: 'Қызмет көрсетілген азаматтар' }
];

const departments = [
  { id: 1, name_ru: 'Руководство', name_kz: 'Басшылық', desc_ru: 'Определение стратегических целей архива, координация работы всех подразделений.', desc_kz: 'Мұрағаттың стратегиялық мақсаттарын айқындау, барлық бөлімшелердің жұмысын үйлестіру.', icon: User },
  { id: 2, name_ru: 'Отдел формирования фондов', name_kz: 'Қорларды қалыптастыру бөлімі', desc_ru: 'Поиск, прием и регистрация новых документов, имеющих историческую ценность.', desc_kz: 'Тарихи құндылығы бар жаңа құжаттарды іздеу, қабылдау және тіркеу.', icon: FileText },
  { id: 3, name_ru: 'Сектор обслуживания пользователей', name_kz: 'Пайдаланушыларға қызмет көрсету секторы', desc_ru: 'Работа с запросами граждан, выдача архивных справок и помощь в читальном зале.', desc_kz: 'Азаматтардың сұраныстарымен жұмыс, мұрағаттық анықтамалар беру және оқу залында көмек көрсету.', icon: Users },
  { id: 4, name_ru: 'IT-отдел (Техническая поддержка)', name_kz: 'IT-бөлімі (Техникалық қолдау)', desc_ru: 'Оцифровка документов, поддержка баз данных и внедрение цифровых технологий.', desc_kz: 'Құжаттарды цифрландыру, деректер базасын қолдау және цифрлық технологияларды енгізу.', icon: Database }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function About() {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* 1. Наша миссия */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-4 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full mb-6">
            <Shield className="w-10 h-10 text-brand-blue dark:text-brand-cyan" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
            {lang === 'ru' ? 'Наша миссия' : 'Біздің миссиямыз'}
          </h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full mb-8"></div>
          <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-400">
            {lang === 'ru' 
              ? 'Мы — хранители исторической памяти Астаны. Наша главная задача — бережно сохранить документальное наследие столицы для будущих поколений, обеспечивая открытый и удобный доступ к истории через современные технологии.'
              : 'Біз — Астананың тарихи жадының сақтаушыларымыз. Біздің басты міндетіміз — елорданың құжаттық мұрасын болашақ ұрпақ үшін ұқыпты сақтау және заманауи технологиялар арқылы тарихқа ашық әрі ыңғайлы қолжетімділікті қамтамасыз ету.'}
          </p>
        </motion.div>
      </section>

      {/* 2. Архив в цифрах */}
      <section className="py-20 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {lang === 'ru' ? 'Архив в цифрах' : 'Мұрағат сандармен'}
            </h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map(stat => (
              <motion.div 
                key={stat.id} 
                variants={fadeInUp}
                className="bg-slate-50 dark:bg-slate-700/50 p-8 rounded-2xl text-center border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-brand-gold/20 flex items-center justify-center rounded-2xl mb-6">
                  <stat.icon className="w-8 h-8 text-brand-dark dark:text-brand-gold" />
                </div>
                <div className="text-4xl font-extrabold text-brand-blue dark:text-brand-cyan mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-medium text-slate-600 dark:text-slate-300">
                  {lang === 'ru' ? stat.label_ru : stat.label_kz}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Технологический вектор */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {lang === 'ru' ? 'Технологический вектор' : 'Технологиялық бағыт'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {lang === 'ru' 
                ? 'Сегодня Государственный архив Астаны уверенно переходит в цифровую эпоху. Мы оцифровываем миллионы страниц, создаем надежные электронные базы данных и автоматизируем выдачу справок, интегрируясь с государственными порталами.'
                : 'Бүгінде Астананың мемлекеттік архиві цифрлық дәуірге сенімді қадам басуда. Біз миллиондаған беттерді цифрландырып, сенімді электронды деректер базасын құрудамыз және мемлекеттік порталдармен біріге отырып, анықтамалар беруді автоматтандырамыз.'}
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <Database className="w-8 h-8 text-brand-blue dark:text-brand-cyan mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xl mb-1">{lang === 'ru' ? 'Электронные базы' : 'Электронды базалар'}</h4>
                  <p className="text-slate-500 dark:text-slate-400">{lang === 'ru' ? 'Безопасное облачное хранение отсканированных фондов.' : 'Сканерленген қорлардың қауіпсіз бұлттық қоймасы.'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Server className="w-8 h-8 text-brand-blue dark:text-brand-cyan mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xl mb-1">{lang === 'ru' ? 'Автоматизация' : 'Автоматтандыру'}</h4>
                  <p className="text-slate-500 dark:text-slate-400">{lang === 'ru' ? 'Мгновенный поиск документов с помощью алгоритмов.' : 'Алгоритмдер арқылы құжаттарды лезде іздеу.'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Smartphone className="w-8 h-8 text-brand-blue dark:text-brand-cyan mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xl mb-1">{lang === 'ru' ? 'Интеграция' : 'Интеграция'}</h4>
                  <p className="text-slate-500 dark:text-slate-400">{lang === 'ru' ? 'Доступ к архивным услугам прямо со смартфона.' : 'Мұрағат қызметтеріне смартфоннан тікелей қол жеткізу.'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-brand-blue/20 to-brand-cyan/20 flex items-center justify-center border border-slate-200 dark:border-slate-700">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80')] opacity-30 bg-cover bg-center mix-blend-overlay"></div>
             <Server className="w-40 h-40 text-brand-blue dark:text-brand-cyan relative z-10 drop-shadow-2xl opacity-80" />
          </div>
        </motion.div>
      </section>

      {/* 4. Структура и подразделения */}
      <section className="py-20 bg-slate-100 dark:bg-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {lang === 'ru' ? 'Структура и подразделения' : 'Құрылым және бөлімшелер'}
            </h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {departments.map(dept => (
              <motion.div 
                key={dept.id} 
                variants={fadeInUp}
                className="bg-white dark:bg-slate-700 p-8 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 mx-auto bg-brand-blue/10 dark:bg-slate-600 rounded-full flex items-center justify-center mb-6 overflow-hidden border-4 border-white dark:border-slate-800 group-hover:bg-brand-blue transition-colors duration-300">
                  <dept.icon className="w-8 h-8 text-brand-blue dark:text-brand-cyan group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 leading-tight">{lang === 'ru' ? dept.name_ru : dept.name_kz}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow leading-relaxed">
                  {lang === 'ru' ? dept.desc_ru : dept.desc_kz}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
