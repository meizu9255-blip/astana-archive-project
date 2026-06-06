import React, { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    const saved = localStorage.getItem('highContrast');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('highContrast', isHighContrast);
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [isHighContrast]);

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider value={{ isHighContrast, toggleHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
