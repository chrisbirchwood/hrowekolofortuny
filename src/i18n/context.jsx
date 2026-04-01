import { createContext, useContext, useState, useCallback, useEffect } from "react";
import pl from "./pl";
import en from "./en";

const translations = { pl, en };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem("wheel-lang") || "pl";
    } catch {
      return "pl";
    }
  });

  // Synchronizacja atrybutu lang z HTML przy pierwszym renderze
  useEffect(() => {
    document.documentElement.lang = lang;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("wheel-lang", newLang);
    } catch {}
    document.documentElement.lang = newLang;
  }, []);

  const t = useCallback(
    (key) => {
      const keys = key.split(".");
      let value = translations[lang];
      for (const k of keys) {
        if (value == null) return key;
        value = value[k];
      }
      return value ?? key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ t, lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation musi byc uzywany wewnatrz LanguageProvider");
  return ctx;
}
