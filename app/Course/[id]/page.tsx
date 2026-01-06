// app/course/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import CourseResourcePage from "@/app/components/coursePage";
import Navbar from "@/app/components/Navbar";
import { useApp } from "@/app/context/AppContext";
import { useState } from "react";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const { isDark, isRTL } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedMajorCode, setSelectedMajorCode] = useState<string | null>(null);

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
      
      <CourseResourcePage courseId={courseId} />
    </div>
  );
}
