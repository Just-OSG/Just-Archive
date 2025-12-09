"use client";

import Link from "next/link";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { isDark } = useApp();
  const { t } = useTranslation();
  
  return (
    <footer className={(isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200") + " border-t mt-auto"}>
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div className="flex flex-col gap-3 flex-1">
            <div className={(isDark ? "text-gray-400" : "text-gray-600") + " flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm"}>
              <Link href="#" className={(isDark ? "hover:text-gray-200" : "hover:text-gray-900") + " transition-colors"}>{t('aboutUs')}</Link>
              <Link href="#" className={(isDark ? "hover:text-gray-200" : "hover:text-gray-900") + " transition-colors"}>{t('submitPapers')}</Link>
              <Link href="#" className={(isDark ? "hover:text-gray-200" : "hover:text-gray-900") + " transition-colors"}>{t('termsOfUse')}</Link>
              <Link href="#" className={(isDark ? "hover:text-gray-200" : "hover:text-gray-900") + " transition-colors"}>{t('privacyPolicy')}</Link>
            </div>
            <div className={(isDark ? "text-gray-500" : "text-gray-500") + " text-xs sm:text-sm"}>
              {t('copyright')} {new Date().getFullYear()}
            </div>
          </div>
          <a 
            href="https://github.com/rknastenka/just-archive" 
            target="_blank" 
            rel="noopener noreferrer"
            className={(isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900") + " transition-colors self-start md:self-auto"}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
