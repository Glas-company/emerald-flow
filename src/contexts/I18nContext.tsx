import { createContext, useContext, useState, ReactNode } from "react";
import ptTranslations from "@/locales/pt.json";
import enTranslations from "@/locales/en.json";
import esTranslations from "@/locales/es.json";

export type Language = "pt" | "en" | "es";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translationsMap: Record<Language, typeof ptTranslations> = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
};

// Detectar idioma do navegador
const detectBrowserLanguage = (): Language => {
  if (typeof window === "undefined") return "pt";
  
  const storedLang = localStorage.getItem("calc_language") as Language;
  if (storedLang && ["pt", "en", "es"].includes(storedLang)) {
    return storedLang;
  }

  const browserLang = navigator.language || (navigator as any).userLanguage;
  const langCode = browserLang.split("-")[0].toLowerCase();

  if (langCode === "es") return "es";
  if (langCode === "en") return "en";
  return "pt"; // Padrão para português
};

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(detectBrowserLanguage());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("calc_language", lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translationsMap[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Tradução não encontrada para chave: ${key} no idioma ${language}`);
        // Fallback para português se não encontrar
        if (language !== "pt") {
          let ptValue: any = translationsMap["pt"];
          for (const ptKey of keys) {
            if (ptValue && typeof ptValue === "object" && ptKey in ptValue) {
              ptValue = ptValue[ptKey];
            } else {
              return key;
            }
          }
          return typeof ptValue === "string" ? ptValue : key;
        }
        return key; // Retorna a chave se não encontrar tradução
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);

  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
}
