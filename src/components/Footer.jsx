import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, MapPin, Phone, Mail, Globe, Database, Book } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-dark text-white/80 pt-16 pb-8 border-t-[4px] border-brand-gold mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 text-white mb-6">
              <Landmark className="h-10 w-10 text-brand-gold" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight uppercase">{t.nav.archiveShort}</span>
                <span className="text-xs text-brand-gold uppercase tracking-wider">{t.nav.archive.replace('Государственный архив', '').replace('Астана қаласының мемлекеттік архиві', 'Астана қаласының')}</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              {t.footer.desc}
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6">{t.footer.fastLinks}</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-brand-gold transition text-sm">{t.nav.about}</Link></li>
              <li><Link to="/funds" className="hover:text-brand-gold transition text-sm">{t.nav.funds}</Link></li>
              <li><Link to="/services" className="hover:text-brand-gold transition text-sm">{t.nav.services}</Link></li>
              <li><Link to="/contacts" className="hover:text-brand-gold transition text-sm">{t.nav.contacts}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6">{t.footer.contacts}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <span>{t.contacts.addressVal}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-gold shrink-0" />
                <span>{t.contacts.phoneVal}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-gold shrink-0" />
                <span>{t.contacts.emailVal}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6">{t.footer.resources}</h3>
            <div className="flex flex-col space-y-4">
              <a href="https://www.gosarhiv.kz/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all border border-white/10 hover:border-brand-gold/50">
                <div className="bg-brand-gold/20 p-2 rounded-lg group-hover:bg-brand-gold transition-colors">
                  <Globe className="h-5 w-5 text-brand-gold group-hover:text-brand-dark transition-colors" />
                </div>
                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                  {lang === 'ru' ? 'Официальный сайт' : 'Ресми сайт'}
                </span>
              </a>
              <a href="#" className="flex items-center space-x-3 group bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all border border-white/10 hover:border-brand-cyan/50">
                <div className="bg-brand-blue/20 p-2 rounded-lg group-hover:bg-brand-cyan transition-colors">
                  <Database className="h-5 w-5 text-brand-cyan group-hover:text-brand-dark transition-colors" />
                </div>
                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                  {lang === 'ru' ? 'Электронный архив акимата' : 'Әкімдіктің электронды архиві'}
                </span>
              </a>
              <a href="#" className="flex items-center space-x-3 group bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all border border-white/10 hover:border-white/50">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white transition-colors">
                  <Book className="h-5 w-5 text-white/70 group-hover:text-brand-dark transition-colors" />
                </div>
                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                  {lang === 'ru' ? 'Архивный вестник' : 'Архив жаршысы'}
                </span>
              </a>
            </div>
            <p className="text-xs mt-6 text-white/50">
              {t.footer.schedule}
            </p>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} {t.footer.rights}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-brand-gold transition">{t.footer.privacy}</Link>
            <Link to="#" className="hover:text-brand-gold transition">{t.footer.sitemap}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
