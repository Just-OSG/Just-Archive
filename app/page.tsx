// app/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./context/AppContext";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";

import { FACULTIES } from "./constants/faculties";
import { BrandColors, Faculty, Major, CourseWithCode } from "@/types";

const BRAND: BrandColors = {
  light: {
    primary: "#2467a4",        // deep academic blue
    primarySoft: "#E6F1FB",    // soft background
    primaryBorder: "#C3DBF3",
  },
  dark: {
    primary: "#2467a4",        // same blue for consistency
    primarySoft: "rgba(36,103,164,0.12)",
    primaryBorder: "rgba(36,103,164,0.25)",
  },
};

// Get all majors as flat array
const MAJORS = FACULTIES.flatMap(f => f.majors);

// dummy courses grouped by major code (later: fetch from Strapi by major id)
interface CoursesByMajor {
  [key: string]: CourseWithCode[];
}

const COURSES_BY_MAJOR: CoursesByMajor = {
  CPE: [
    { id: 101, code: "CPE 101", nameEn: "Introduction to Programming", nameAr: "مقدمة في البرمجة" },
    { id: 102, code: "CPE 241", nameEn: "Data Structures", nameAr: "هياكل البيانات" },
    { id: 103, code: "CPE 351", nameEn: "Computer Networks", nameAr: "شبكات الحاسوب" },
  ],
  EE: [
    { id: 201, code: "EE 241", nameEn: "Signals & Systems", nameAr: "الإشارات والأنظمة" },
    { id: 202, code: "EE 231", nameEn: "Electronics I", nameAr: "الإلكترونيات 1" },
    { id: 203, code: "EE 332", nameEn: "Power Systems", nameAr: "أنظمة القدرة" },
  ],
  ME: [
    { id: 301, code: "ME 210", nameEn: "Thermodynamics", nameAr: "الثرموديناميك" },
    { id: 302, code: "ME 315", nameEn: "Machine Design", nameAr: "تصميم الآلات" },
  ],
  CE: [
    { id: 401, code: "CE 210", nameEn: "Statics", nameAr: "الستاتيك" },
    { id: 402, code: "CE 340", nameEn: "Concrete Design", nameAr: "تصميم الخرسانة" },
  ],
  MED: [
    { id: 501, code: "MED 212", nameEn: "Anatomy", nameAr: "التشريح" },
    { id: 502, code: "MED 231", nameEn: "Physiology", nameAr: "علم وظائف الأعضاء" },
    { id: 503, code: "MED 245", nameEn: "Pathology", nameAr: "الباثولوجيا" },
  ],
  PHAR: [
    { id: 601, code: "PHAR 210", nameEn: "Pharmacology I", nameAr: "علم الأدوية 1" },
    { id: 602, code: "PHAR 220", nameEn: "Pharmaceutics", nameAr: "الصيدلانيات" },
  ],
  NURS: [
    { id: 701, code: "NURS 110", nameEn: "Fundamentals of Nursing", nameAr: "أساسيات التمريض" },
  ],
};

// Color mapping for different major codes
interface MajorColor {
  light: string;
  dark: string;
}

interface MajorColors {
  [key: string]: MajorColor;
}

const MAJOR_COLORS: MajorColors = {
  CPE: { light: "#f97316", dark: "#fb923c" },      // orange
  EE: { light: "#eab308", dark: "#fbbf24" },       // yellow
  ME: { light: "#10b981", dark: "#34d399" },       // green
  CE: { light: "#06b6d4", dark: "#22d3ee" },       // cyan
  CHE: { light: "#8b5cf6", dark: "#a78bfa" },      // violet
  AR: { light: "#ec4899", dark: "#f472b6" },       // pink
  CSIT: { light: "#f97316", dark: "#fb923c" },     // orange
  SCI: { light: "#10b981", dark: "#34d399" },      // green
  MED: { light: "#ef4444", dark: "#f87171" },      // red
  DEN: { light: "#3b82f6", dark: "#60a5fa" },      // blue
  PHAR: { light: "#14b8a6", dark: "#2dd4bf" },     // teal
  NURS: { light: "#ec4899", dark: "#f472b6" },     // pink
  AMS: { light: "#f59e0b", dark: "#fbbf24" },      // amber
  AGRI: { light: "#22c55e", dark: "#4ade80" },     // green
  VET: { light: "#8b5cf6", dark: "#a78bfa" },      // violet
};

// Helper function to get color for a course based on its code
const getCourseColor = (courseCode: string, isDark: boolean): string => {
  const majorCode = courseCode.split(' ')[0]; // Extract major code (e.g., "CPE" from "CPE 101")
  const colors = MAJOR_COLORS[majorCode];
  if (!colors) return isDark ? "#fb923c" : "#f97316"; // fallback to orange
  return isDark ? colors.dark : colors.light;
};

export default function HomePage() {
  const router = useRouter();
  const { lang, setLang, theme, setTheme, isRTL, isDark } = useApp();
  const { t } = useTranslation();
  const [selectedMajorCode, setSelectedMajorCode] = useState<string | null>(null); // null means "show all"
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
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
  const allMajors = faculties.flatMap(f => f.majors);
  const selectedMajor = selectedMajorCode ? allMajors.find((m) => m.code === selectedMajorCode) : null;
  
  // Get courses: if no major selected, show all courses from all majors
  const courses = selectedMajorCode 
    ? (COURSES_BY_MAJOR[selectedMajorCode] || [])
    : Object.entries(COURSES_BY_MAJOR).flatMap(([majorCode, coursesArray]) => 
        coursesArray.map(course => ({
          ...course,
          majorCode, // Add major code to each course for reference
        }))
      );

  return (
    <div
      className={
        "min-h-screen " +
        (isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900") +
        (isRTL ? " rtl" : "")
      }
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar 
        onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)} 
        showMobileMenu={showMobileMenu}
        selectedMajorCode={selectedMajorCode}
        setSelectedMajorCode={setSelectedMajorCode}
      />
      {/* Main Shell */}
      <div className=" mb-10 mx-auto flex max-w-[1400px] gap-4 md:gap-10 px-5 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 min-h-screen">
       
        {/* Majors sidebar - Desktop only */}
        <aside className="w-80 shrink-0 hidden md:flex md:flex-col">
          <div
            className={
              (isDark
                ? "bg-slate-900 md:bg-slate-900/30 border-slate-700 "
                : "bg-white border-slate-200") +
              " md:rounded-lg border flex flex-col h-full"
            }
          >
            {/* Header */}
            <div className={(isDark ? "border-slate-700" : "border-slate-200") + " border-b px-5 py-4"}>
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
            <div className="flex-1 overflow-y-auto py-2">
              {/* Show All Courses Button */}
              <div className="mb-4">
                <button
                  onClick={() => setSelectedMajorCode(null)}
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
                              onClick={() => setSelectedMajorCode(major.code)}
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
            
          </div>
        </aside>

        {/* Courses area */}
        <main className="flex-1 space-y-6">
          {/* Courses list for selected major */}
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <h2
                className={
                  (isDark ? "text-slate-100" : "text-slate-800") +
                  " text-base sm:text-lg font-semibold"
                }
              >
                {selectedMajor
                  ? t('coursesIn', { name: lang === "en" ? selectedMajor.nameEn : selectedMajor.nameAr })
                  : t('allCourses')}
              </h2>
              
              <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1">
                {/* Search Bar */}
                <input
                  className={
                    "flex-1 sm:flex-auto rounded-lg border px-3 sm:px-4 py-2 text-sm outline-none transition " +
                    (isDark
                      ? "border-slate-700 bg-slate-900/40 text-slate-100 placeholder:text-slate-500 focus:border-[#7DB4E5]"
                      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#145C9E] focus:bg-white")
                  }
                  placeholder={t('searchPlaceholder')}
                />

                <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-sm whitespace-nowrap"}>
                  {courses.length} {t('course')}
                </p>
              </div>
            </div>

            <div className="grid gap-3  [@media(max-width:990px)]:grid-cols-1 [@media(max-width:1212px)]:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                return (
                  <div
                    key={course.id}
                    onClick={() => router.push(`/Course/${course.code.replace(/\s+/g, '')}`)}
                    className={
                      (isDark
                        ? "bg-slate-900/40 border-slate-700 hover:border-[#7DB4E5]/40 shadow-sm"
                        : "bg-white border-slate-200 hover:border-[#145C9E]/40 shadow-sm") +
                      " rounded-lg border p-3 sm:p-4 cursor-pointer transition hover:shadow-sm overflow-hidden"
                    }
                  >
                    <p className={(isDark ? "text-slate-500" : "text-[#145C9E]") + " text-sm uppercase tracking-wide"}>
                      {course.code}
                    </p>
                    <h3 className={(isDark ? "text-slate-100" : "text-slate-800") + " mt-1 text-base font-semibold"}>
                      {lang === "en" ? course.nameEn : course.nameAr}
                    </h3>
                    <p className={(isDark ? "text-slate-400" : "text-slate-400") + " mt-1 text-xs mb-3"}>
                      {t('viewResources')}
                    </p>
                    
                    {/* Decorative lines at bottom */}
                    <div className="flex gap-2 mt-auto">
                      <div className={(isDark ? "bg-[#7DB4E5]" : "bg-[#145C9E]") + " h-1 flex-1 rounded-full"}></div>
                      <div 
                        className="h-1 w-10 rounded-full"
                        style={{ backgroundColor: getCourseColor(course.code, isDark) }}
                      ></div>
                      <div 
                        className="h-1 w-10 rounded-full opacity-70"
                        style={{ backgroundColor: getCourseColor(course.code, isDark) }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {courses.length === 0 && (
                <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-base"}>{t('noCourses')}</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}


