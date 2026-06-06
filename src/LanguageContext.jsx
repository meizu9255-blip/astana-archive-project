import React, { createContext, useState, useContext } from 'react';
import { siteContent } from './data';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ru'); // 'ru' или 'kz'

  const toggleLanguage = (selectedLang) => {
    setLang(selectedLang);
  };

  const value = {
    lang,
    toggleLanguage,
    t: siteContent[lang]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
