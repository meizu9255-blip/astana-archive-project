import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Landmark, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useAccessibility } from '../AccessibilityContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();
  const { isHighContrast, toggleHighContrast } = useAccessibility();

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const links = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/funds', label: t.nav.funds },
    { path: '/services', label: t.nav.services },
    { path: '/status', label: lang === 'ru' ? 'Статус заявки' : 'Өтініш мәртебесі' },
    { path: '/contacts', label: t.nav.contacts },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-brand-blue dark:bg-slate-950 text-white shadow-lg sticky top-0 z-50 transition-colors duration-300 max-w-full">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <Landmark className="h-9 w-9 text-brand-gold group-hover:scale-105 transition-transform" />
              <div className="flex flex-col text-left justify-center">
                <span className="text-xs xl:text-sm 2xl:text-base font-bold text-white leading-tight uppercase">Астана қаласының Мемлекеттік архиві</span>
                <span className="text-[10px] xl:text-xs 2xl:text-sm text-yellow-500 whitespace-nowrap leading-tight uppercase">Государственный архив г. Астаны</span>
              </div>
            </Link>
          </div>

          <div className="hidden 2xl:flex items-center gap-3 2xl:gap-5 flex-shrink-0">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-300 text-xs 2xl:text-[13px] font-semibold uppercase tracking-wider py-2 whitespace-nowrap
                  ${isActive(link.path) 
                    ? 'text-brand-gold border-b-2 border-brand-gold' 
                    : 'text-white/90 hover:text-brand-gold'}
                `}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Accessibility Mode Toggle */}
            <button 
              onClick={toggleHighContrast}
              className={`text-white/70 hover:text-brand-gold transition ml-2 focus:outline-none ${isHighContrast ? 'text-brand-gold' : ''}`}
              title={lang === 'ru' ? 'Режим для слабовидящих' : 'Нашар көретіндерге арналған режим'}
              aria-label={lang === 'ru' ? 'Режим для слабовидящих' : 'Нашар көретіндерге арналған режим'}
            >
              {isHighContrast ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="text-white/70 hover:text-brand-gold transition ml-2 focus:outline-none"
              title={lang === 'ru' ? 'Переключить темную тему' : 'Қараңғы режимді ауыстыру'}
              aria-label={lang === 'ru' ? 'Переключить темную тему' : 'Қараңғы режимді ауыстыру'}
            >
              {darkMode ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
            </button>

            {/* Переключатель языков Desktop */}
            <div className="flex items-center gap-2 border-l border-white/20 pl-4 lg:pl-6 ml-2 shrink-0">
              <Globe className="h-4 w-4 text-white/70" />
              <button 
                onClick={() => toggleLanguage('kz')}
                className={`text-xs lg:text-sm font-bold px-2 py-1 rounded transition ${lang === 'kz' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-brand-gold'}`}
              >
                KZ
              </button>
              <button 
                onClick={() => toggleLanguage('ru')}
                className={`text-xs lg:text-sm font-bold px-2 py-1 rounded transition ${lang === 'ru' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-brand-gold'}`}
              >
                RU
              </button>
            </div>
          </div>

          <div className="2xl:hidden flex items-center space-x-4">
            <button 
              onClick={toggleHighContrast}
              className={`text-white/70 hover:text-brand-gold transition focus:outline-none ${isHighContrast ? 'text-brand-gold' : ''}`}
            >
              {isHighContrast ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="text-white/70 hover:text-brand-gold transition focus:outline-none"
            >
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-brand-gold transition">
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`2xl:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-brand-blue dark:bg-slate-950 border-t border-white/10 px-4 pt-4 pb-6 flex flex-col gap-2 shadow-inner">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors whitespace-nowrap
                ${isActive(link.path) 
                  ? 'bg-white/10 text-brand-gold' 
                  : 'text-white/90 hover:bg-white/5 hover:text-brand-gold'}
              `}
            >
              {link.label}
            </Link>
          ))}
          {/* Переключатель языков Mobile */}
          <div className="px-4 py-4 flex items-center gap-3 border-t border-white/10 mt-2">
            <Globe className="h-5 w-5 text-white/70" />
            <button 
              onClick={() => { toggleLanguage('kz'); setIsOpen(false); }}
              className={`text-sm font-bold px-4 py-2 rounded-lg transition ${lang === 'kz' ? 'bg-blue-600 text-white shadow-md' : 'text-white/60 hover:text-brand-gold hover:bg-white/5'}`}
            >
              KZ
            </button>
            <button 
              onClick={() => { toggleLanguage('ru'); setIsOpen(false); }}
              className={`text-sm font-bold px-4 py-2 rounded-lg transition ${lang === 'ru' ? 'bg-blue-600 text-white shadow-md' : 'text-white/60 hover:text-brand-gold hover:bg-white/5'}`}
            >
              RU
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
