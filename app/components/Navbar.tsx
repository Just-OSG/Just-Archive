"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { FACULTIES } from "../constants/faculties";
import { Faculty } from "@/types";

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  showMobileMenu?: boolean;
  selectedMajorCode: string | null;
  setSelectedMajorCode: ((code: string | null) => void) | null;
}

export default function Navbar({ onToggleMobileMenu, showMobileMenu = false, selectedMajorCode, setSelectedMajorCode }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, setLang, theme, setTheme, isRTL, isDark } = useApp();
  const { t } = useTranslation();
  
  // Always start with default order to avoid hydration mismatch
  const [faculties, setFaculties] = useState<Faculty[]>(FACULTIES);
  
  // Load custom order from localStorage after mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('facultiesOrder');
    if (savedOrder) {
      try {
        const orderIds: number[] = JSON.parse(savedOrder);
        const ordered = orderIds
          .map((id: number) => FACULTIES.find(f => f.id === id))
          .filter(Boolean) as Faculty[];
        
        const existingIds = new Set(orderIds);
        const newFaculties = FACULTIES.filter(f => !existingIds.has(f.id));
        
        const newOrder = [...ordered, ...newFaculties];
        
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => {
          setFaculties(prev => {
            if (JSON.stringify(prev.map(f => f.id)) !== JSON.stringify(newOrder.map(f => f.id))) {
              return newOrder;
            }
            return prev;
          });
        }, 0);
      } catch (e) {
        console.error("Failed to load faculty order", e);
      }
    }
  }, []);
  
  // Initialize all faculties as collapsed by default
  const [collapsedFaculties, setCollapsedFaculties] = useState(() => 
    new Set(FACULTIES.map(f => f.id))
  );

  const toggleFaculty = (facultyId: number) => {
    setCollapsedFaculties(prev => {
      const next = new Set(prev);
      if (next.has(facultyId)) {
        next.delete(facultyId);
      } else {
        next.add(facultyId);
      }
      return next;
    });
  };

  const moveFaculty = (index: number, direction: 'up' | 'down') => {
    const newFaculties = [...faculties];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newFaculties.length) {
      [newFaculties[index], newFaculties[newIndex]] = [newFaculties[newIndex], newFaculties[index]];
      setFaculties(newFaculties);
      
      // Save the new order to localStorage
      const orderIds = newFaculties.map(f => f.id);
      localStorage.setItem('facultiesOrder', JSON.stringify(orderIds));
    }
  };

  return (
    <>
    <header
      className={
        (isDark ? "bg-slate-900 border-slate-700 shadow-sm" : "bg-white/70 border-slate-200 ") +
        " border-b sticky top-0 z-60 backdrop-blur-md cursor-pointer"
      }
      dir={isRTL ? "rtl" : "ltr"}
      onClick={(e) => {
        // Only navigate if clicking on the header background, not on buttons
        if (e.target === e.currentTarget || (e.target instanceof HTMLElement && e.target.closest('.header-container') === e.currentTarget.firstChild)) {
          router.push("/");
        }
      }}
    >
      <div className="mx-auto flex max-w-[1350px] items-center md:justify-between lg:justify-between px-4 py-2.5 gap-3 header-container">
        
        {/* Mobile Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMobileMenu?.();
          }}
          className={
            (isDark
              ? " text-slate-300"
              : " text-slate-700") +
            " md:hidden transition-colors"
          }
          aria-label="Toggle menu"
        >
          {showMobileMenu ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push('/');
            }}
            className={
              " flex h-9 w-9 items-center justify-center hover:opacity-90 transition overflow-visible"
            }
            aria-label="Go to home"
          >
            <Image 
              src="/logo.png" 
              alt="JUST ARCHIVE Logo" 
              width={48} 
              height={48}
              className="object-contain"
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push('/');
            }}
            className={isRTL ? "text-right" : "text-left"}
          >
            <p className={(isDark ? "text-slate-100" : "text-slate-900") + " text-base font-semibold leading-tight"}>
              {t('appName')}
            </p>
            <p className={"lg:text-sm text-xs leading-tight " + (isDark ? "text-slate-400" : "text-slate-500")}>
              {t('university')}
            </p>
          </button>
        </div>

        {/* Desktop Navigation & Controls */}
        <div className="hidden md:flex items-center gap-1">

                    {/* Favorites */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push("/favorite");
            }}
            className={
              (isDark
                ? "border-slate-700 hover:bg-slate-800/50 text-slate-300"
                : "border-slate-200 hover:bg-slate-50 text-slate-700") +
              " rounded-md px-1.5 py-1.5 text-sm font-medium flex items-center gap-1.5 transition"
            }
            aria-label="Favorites"
          >
            <svg className="w-4.5 h-4.5" fill={pathname === "/favorite" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTheme(isDark ? "light" : "dark");
            }}
            className={
              (isDark
                ? "border-slate-700 hover:bg-slate-800/50 text-slate-300"
                : "border-slate-200 hover:bg-slate-50 text-slate-700") +
              " rounded-md px-1.5 py-1.5 text-sm font-medium flex items-center gap-1.5 transition"
            }
            aria-label={isDark ? t('themeToggleLight') : t('themeToggleDark')}
          >
            {isDark ? (
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>


          {/* Language Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLang(lang === "en" ? "ar" : "en");
            }}
            className={
              (isDark
                ? "border-slate-700 hover:bg-slate-800/50 text-slate-300"
                : "border-slate-200 hover:bg-slate-50 text-slate-700") +
              " rounded-md px-1.5 py-1.5 text-sm font-medium flex items-center gap-1.5 transition"
            }
            aria-label={t('langToggle')}
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>



        </div>

      </div>
    </header>

    {/* Mobile Sidebar Menu */}
    <>
      {/* Mobile overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-65 bg-black/50 md:hidden"
          onClick={onToggleMobileMenu}
        />
      )}
     
      {/* Majors sidebar for mobile */}
      <aside className={
        "w-80 shrink-0 md:hidden fixed inset-y-0 z-70 transform transition-transform duration-300 " +
        (isRTL ? "right-0 " : "left-0 ") +
        (showMobileMenu ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full"))
      }>
        <div
          className={
            (isDark
              ? "bg-slate-900 border-slate-700 shadow-sm"
              : "bg-white border-slate-200 shadow-sm") +
            " border flex flex-col h-full"
          }
        >
          {/* Header with close button */}
          <div className={(isDark ? "border-slate-700" : "border-slate-200") + " border-b px-5 py-4 flex items-start justify-between"}>
            <div className="flex-1">
              <h2
                className={
                  (isDark ? "text-slate-100" : "text-slate-900") +
                  " text-sm font-semibold"
                }
              >
                {t('majorsTitle')}
              </h2>
              <p className={(isDark ? "text-slate-500" : "text-slate-400") + " mt-0.5 text-xs"}>
                {t('majorsSubtitle')}
              </p>
            </div>
            
            {/* Close button - Mobile only */}
            <button
              onClick={onToggleMobileMenu}
              className={(isDark ? "text-slate-400 hover:text-slate-100" : "text-slate-400 hover:text-slate-900") + " transition-colors"}
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {/* Show All Courses Button */}
            <div className="mb-4">
              <button
                onClick={() => {
                  if (setSelectedMajorCode) setSelectedMajorCode(null);
                  onToggleMobileMenu?.();
                  if (window.location.hash) window.location.href = window.location.pathname;
                }}
                className={
                  "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition " +
                  (selectedMajorCode === null
                    ? isDark
                      ? "bg-[#7DB4E5]/10 text-slate-100 border-l-2 border-[#7DB4E5]"
                      : "bg-[#145C9E]/10 text-slate-900 border-l-2 border-[#145C9E]"
                    : isDark
                    ? "text-slate-400 hover:bg-slate-800/50"
                    : "text-slate-500 hover:bg-slate-50")
                }
              >
                <span className="font-medium">{t('showAllCourses')}</span>
                {selectedMajorCode === null && (
                  <span
                    className={
                      (isDark
                        ? "bg-slate-800 text-[#7DB4E5]"
                        : "bg-[#145C9E]/10 text-[#145C9E]") +
                      " rounded-full px-2 py-0.5 text-xs font-medium"
                    }
                  >
                    {t('selected')}
                  </span>
                )}
              </button>
            </div>

            {faculties.map((faculty, index) => (
              <div key={faculty.id} className="mb-3">
                <div
                  className={
                    (isDark
                      ? "text-[#7DB4E5] bg-[#7DB4E5]/3"
                      : "text-[#145C9E] bg-slate-100") +
                    " flex items-center justify-between px-4 py-2 group"
                  }
                >
                  <button
                    onClick={() => toggleFaculty(faculty.id)}
                    className={(isRTL ? "text-right" : "text-left") + " flex-1 text-xs font-bold uppercase tracking-wider"}
                  >
                    {lang === "en" ? faculty.nameEn : faculty.nameAr}
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveFaculty(index, 'up')}
                      disabled={index === 0}
                      className={(isDark ? "text-slate-500 hover:text-[#7DB4E5] disabled:opacity-30" : "text-slate-500 hover:text-[#145C9E] disabled:opacity-30") + " p-1 disabled:cursor-not-allowed"}
                      aria-label="Move faculty up"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveFaculty(index, 'down')}
                      disabled={index === faculties.length - 1}
                      className={(isDark ? "text-slate-500 hover:text-[#7DB4E5] disabled:opacity-30" : "text-slate-500 hover:text-[#145C9E] disabled:opacity-30") + " p-1 disabled:cursor-not-allowed"}
                      aria-label="Move faculty down"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                {!collapsedFaculties.has(faculty.id) && (
                  <ul>
                    {faculty.majors.map((major) => {
                      const active = major.code === selectedMajorCode;
                      return (
                        <li key={major.id}>
                          <button
                            onClick={() => {
                              if (setSelectedMajorCode) setSelectedMajorCode(major.code);
                              onToggleMobileMenu?.();
                              if (window.location.hash) window.location.href = window.location.pathname;
                            }}
                            className={
                              "flex w-full items-center justify-between px-4 py-2 " + (isRTL ? "text-right" : "text-left") + " text-sm transition " +
                              (active
                                ? isDark
                                  ? "bg-[#7DB4E5]/10 text-slate-100 " + (isRTL ? "border-r-2" : "border-l-2") + " border-[#7DB4E5]"
                                  : "bg-[#145C9E]/10 text-slate-900 " + (isRTL ? "border-r-2" : "border-l-2") + " border-[#145C9E]"
                                : isDark
                                ? "text-slate-400 hover:bg-slate-800/50"
                                : "text-slate-500 hover:bg-slate-50")
                            }
                          >
                            <span>{lang === "en" ? major.nameEn : major.nameAr}</span>
                            {active && (
                              <span
                                className={
                                  (isDark
                                    ? "bg-slate-800 text-[#7DB4E5]"
                                    : "bg-[#145C9E]/10 text-[#145C9E]") +
                                  " rounded-full px-2 py-0.5 text-xs font-medium"
                                }
                              >
                                {lang === "en" ? "Selected" : "محدد"}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile Settings Footer - Icon buttons */}
          <div className={(isDark ? "bg-slate-900" : "bg-white") + " px-3 py-4 flex items-center gap-0.2"}>
            {/* Favorites */}
            <button
              onClick={() => {
                router.push("/favorite");
                onToggleMobileMenu?.();
              }}
              className={
                (isDark
                  ? "hover:bg-slate-800/50 text-slate-300"
                  : "hover:bg-slate-50 text-slate-700") +
                " rounded-md px-3 py-2 text-sm font-medium flex items-center gap-1.5 transition"
              }
              aria-label="Favorites"
            >
              <svg className="w-4 h-4" fill={pathname === "/favorite" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={
                (isDark
                  ? "hover:bg-slate-800/50 text-slate-300"
                  : "hover:bg-slate-50 text-slate-700") +
                " rounded-md px-3 py-2 text-sm font-medium flex items-center gap-1.5 transition"
              }
              aria-label={isDark ? t('themeToggleLight') : t('themeToggleDark')}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className={
                (isDark
                  ? "hover:bg-slate-800/50 text-slate-300"
                  : "hover:bg-slate-50 text-slate-700") +
                " rounded-md px-3 py-2 text-sm font-medium flex items-center gap-1.5 transition"
              }
              aria-label={t('langToggle')}
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
    </>
  );
}
