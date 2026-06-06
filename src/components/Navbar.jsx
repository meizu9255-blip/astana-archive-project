import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Landmark } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();

  const links = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/funds', label: t.nav.funds },
    { path: '/services', label: t.nav.services },
    { path: '/contacts', label: t.nav.contacts },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-brand-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <Landmark className="h-9 w-9 text-brand-gold group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight uppercase tracking-wide">{t.nav.archiveShort}</span>
                <span className="text-xs text-brand-gold uppercase tracking-wider">{t.nav.archive}</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-300 text-sm font-semibold uppercase tracking-wider py-2
                  ${isActive(link.path) 
                    ? 'text-brand-gold border-b-2 border-brand-gold' 
                    : 'text-white/90 hover:text-brand-gold'}
                `}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Переключатель языков Desktop */}
            <div className="flex items-center space-x-2 border-l border-white/20 pl-6 ml-2">
              <Globe className="h-4 w-4 text-white/70 mr-1" />
              <button 
                onClick={() => toggleLanguage('kz')}
                className={`text-sm font-bold px-2 py-1 rounded transition ${lang === 'kz' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-brand-gold'}`}
              >
                KZ
              </button>
              <button 
                onClick={() => toggleLanguage('ru')}
                className={`text-sm font-bold px-2 py-1 rounded transition ${lang === 'ru' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-brand-gold'}`}
              >
                RU
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-brand-gold transition">
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-brand-blue border-t border-white/10 px-4 pt-2 pb-4 space-y-1 shadow-inner">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-semibold uppercase tracking-wide transition-colors
                ${isActive(link.path) 
                  ? 'bg-white/10 text-brand-gold' 
                  : 'text-white/90 hover:bg-white/5 hover:text-brand-gold'}
              `}
            >
              {link.label}
            </Link>
          ))}
          {/* Переключатель языков Mobile */}
          <div className="px-4 py-3 flex items-center space-x-2 border-t border-white/10 mt-2">
            <Globe className="h-5 w-5 text-white/70 mr-2" />
            <button 
              onClick={() => { toggleLanguage('kz'); setIsOpen(false); }}
              className={`text-sm font-bold px-3 py-1.5 rounded transition ${lang === 'kz' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-brand-gold'}`}
            >
              KZ
            </button>
            <button 
              onClick={() => { toggleLanguage('ru'); setIsOpen(false); }}
              className={`text-sm font-bold px-3 py-1.5 rounded transition ${lang === 'ru' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-brand-gold'}`}
            >
              RU
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
