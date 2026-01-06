"use client";

import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

import { FavoriteCourse } from "@/types";

export default function FavoritesPage() {
  const { isDark, lang, isRTL } = useApp();
  const { t } = useTranslation();
  const router = useRouter();
  const [favoriteCourses, setFavoriteCourses] = useState<FavoriteCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage
    const favoritesStored = localStorage.getItem('favoriteCourses');
    if (favoritesStored) {
      try {
        const favorites = JSON.parse(favoritesStored);
        setFavoriteCourses(favorites);
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
      }
    }
    setLoading(false);
  }, []);

  const removeFavorite = (courseCode: string) => {
    const updatedFavorites = favoriteCourses.filter(course => course.code !== courseCode);
    setFavoriteCourses(updatedFavorites);
    localStorage.setItem('favoriteCourses', JSON.stringify(updatedFavorites));
  };

  const goToCourse = (courseCode: string) => {
    const formattedCode = courseCode.replace(/\s+/g, '');
    router.push(`/#course/${formattedCode}`);
  };

  if (loading) {
    return (
      <div className={isDark ? "min-h-screen bg-slate-900" : "min-h-screen bg-slate-50"}>
        <Navbar 
          onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)} 
          showMobileMenu={showMobileMenu}
          selectedMajorCode={null}
          setSelectedMajorCode={null}
        />
        <main className="mb-10 mx-auto max-w-[1350px] px-4 py-6">
          <p className={(isDark ? "text-slate-400" : "text-slate-600") + " text-center"}>
            Loading...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className={isDark ? "min-h-screen bg-slate-900" : "min-h-screen bg-slate-50"}>
      <Navbar 
        onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)} 
        showMobileMenu={showMobileMenu}
        selectedMajorCode={null}
        setSelectedMajorCode={null}
      />
      <main className="mb-10 mx-auto max-w-[1350px] px-4 py-6 space-y-6">
        {/* Header */}
        <section className={
          (isDark ? "bg-slate-900/30 border-slate-700" : "bg-white border-slate-200") +
          " rounded-lg px-4 sm:px-6 py-4 sm:py-5 border"
        }>
          <button
            onClick={() => router.push("/")}
            className={
              (isDark ? "text-[#7DB4E5] hover:text-[#9CC5E9]" : "text-[#145C9E] hover:text-[#1f3d78]") +
              " text-[11px] sm:text-xs hover:underline mb-2 flex items-center gap-1 transition-all"
            }
          >
            <svg className={"w-3 h-3 sm:w-3.5 sm:h-3.5" + (isRTL ? " rotate-180" : "")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToCourses')}
          </button>
          <h1 className={(isDark ? "text-slate-100" : "text-slate-800") + " text-xl sm:text-2xl font-semibold"}>
            {lang === "en" ? "Favorite Courses" : "المساقات المفضلة"}
          </h1>
          <p className={(isDark ? "text-slate-400" : "text-slate-500") + " mt-1 text-sm"}>
            {lang === "en" 
              ? `${favoriteCourses.length} course${favoriteCourses.length !== 1 ? 's' : ''} saved`
              : `${favoriteCourses.length} مساق محفوظ`
            }
          </p>
        </section>

        {/* Favorites Grid */}
        {favoriteCourses.length === 0 ? (
          <section className={
            (isDark ? "bg-slate-900/30 border-slate-700" : "bg-white border-slate-200") +
            " rounded-lg px-6 py-12 shadow-sm border text-center"
          }>
            <svg 
              className={(isDark ? "text-slate-600" : "text-slate-300") + " w-16 h-16 mx-auto mb-4"} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className={(isDark ? "text-slate-300" : "text-slate-700") + " text-lg font-medium mb-2"}>
              {lang === "en" ? "No favorites yet" : "لا توجد مساقات مفضلة"}
            </h3>
            <p className={(isDark ? "text-slate-500" : "text-slate-500") + " text-sm"}>
              {lang === "en" 
                ? "Click the heart icon on any course page to add it to favorites"
                : "اضغط على أيقونة القلب في صفحة المساق لإضافته للمفضلة"
              }
            </p>
          </section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteCourses.map((course) => (
              <div
                key={course.code}
                className={
                  (isDark ? "bg-slate-900/30 border-slate-700 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300") +
                  " rounded-lg px-4 py-4 shadow-sm border transition-all cursor-pointer group"
                }
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1" onClick={() => goToCourse(course.code)}>
                    <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-[10px] uppercase tracking-wide"}>
                      {lang === "en" ? course.majorEn : course.majorAr}
                    </p>
                    <h3 className={(isDark ? "text-slate-100 group-hover:text-[#7DB4E5]" : "text-slate-800 group-hover:text-[#145C9E]") + " text-base font-semibold mt-1 transition-colors"}>
                      {lang === "en" ? course.nameEn : course.nameAr}
                    </h3>
                    <p className={(isDark ? "text-slate-400" : "text-slate-500") + " text-xs mt-0.5"}>
                      {course.code}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(course.code);
                    }}
                    className={
                      (isDark ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600") +
                      " transition-colors p-1"
                    }
                    aria-label="Remove from favorites"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => goToCourse(course.code)}
                  className={
                    (isDark ? "bg-[#7DB4E5] text-slate-950 hover:bg-[#9CC5E9]" : "bg-[#145C9E] text-white hover:bg-[#1f3d78]") +
                    " w-full rounded-md px-3 py-1.5 text-xs font-medium transition"
                  }
                >
                  {lang === "en" ? "View Course" : "عرض المساق"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
