import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center px-4 py-20 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <div className="inline-flex justify-center items-center bg-brand-blue/10 dark:bg-brand-blue/20 p-8 rounded-full mb-8">
          <FileQuestion className="w-24 h-24 text-brand-blue dark:text-brand-cyan" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-200 mb-6">
          {lang === 'ru' ? 'Страница не найдена' : 'Бет табылмады'}
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed">
          {lang === 'ru' 
            ? 'Возможно, вы ввели неправильный адрес, или страница была удалена. Проверьте правильность URL или вернитесь на главную.' 
            : 'Мүмкін сіз қате мекенжай енгіздіңіз немесе бет жойылған болуы мүмкін. URL мекенжайының дұрыстығын тексеріңіз немесе басты бетке оралыңыз.'}
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center px-8 py-4 bg-brand-blue text-white rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {lang === 'ru' ? 'Вернуться на главную' : 'Басты бетке оралу'}
        </Link>
      </motion.div>
    </div>
  );
}
