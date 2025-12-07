import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  months: readonly string[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Global language state for use outside React components
let currentLanguage: Language = 'en';

export function getCurrentLanguage(): Language {
  return currentLanguage;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = useCallback((lang: Language) => {
    currentLanguage = lang;
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: keyof typeof translations.en): string => {
    const value = translations[language][key];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value as string;
  }, [language]);

  const months = translations[language].months;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, months }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

