"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Theme, Language } from "@/types";
import "../i18n/config";

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isRTL: boolean;
  isDark: boolean;
  mounted: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { i18n } = useTranslation();
  
  // Always start with defaults for SSR
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const savedLang = (localStorage.getItem("lang") as Language) || "en";
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setLang(savedLang);
      setTheme(savedTheme);
      i18n.changeLanguage(savedLang);
      document.documentElement.setAttribute('lang', savedLang);
      
      // Apply theme to document
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      setMounted(true);
    }, 0);
  }, [i18n]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
    
    // Update HTML lang attribute for CSS font switching
    document.documentElement.setAttribute('lang', lang);
  }, [lang, mounted, i18n]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("theme", theme);
    
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, mounted]);

  const value: AppContextType = {
    lang,
    setLang,
    theme,
    setTheme,
    isRTL: lang === "ar",
    isDark: theme === "dark",
    mounted,
  };

  // Show nothing until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
