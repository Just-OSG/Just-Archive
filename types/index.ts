// Shared type definitions for the application

export interface Major {
  id: number;
  code: string;
  nameEn: string;
  nameAr: string;
}

export interface Faculty {
  id: number;
  nameEn: string;
  nameAr: string;
  majors: Major[];
}

export interface Course {
  id: string; // Course code: "CPE333", "DSE211"
  nameEn: string;
  nameAr: string;
  facultyId: number;
  credits?: number;
  descriptionEn?: string;
  descriptionAr?: string;
  createdAt: Date;
  updatedAt: Date;
  // For display purposes
  majorEn?: string;
  majorAr?: string;
}

export interface FavoriteCourse {
  code: string;
  nameEn: string;
  nameAr: string;
  majorEn: string;
  majorAr: string;
}

export type FileType = 'pyq' | 'notes' | 'syllabus' | 'assignment' | 'slides' | 'solution' | 'book' | 'other';

export interface File {
  id: string; // UUID
  courseId: string; // Course code
  
  // File Info
  fileName: string;
  fileType: FileType;
  fileUrl: string; // R2 URL
  fileSizeBytes: number;
  mimeType: string;
  
  // Metadata
  date: Date; // Exam date or semester date
  semester?: string; // "Fall 2024", "Spring 2025"
  year?: number;
  doctorName?: string;
  
  // Admin tracking
  uploadedBy: string; // Admin email
  uploadedAt: Date;
  isVerified: boolean;
  downloadCount: number;
  
  // Search & Display
  tags?: string[];
  notes?: string;
}

export interface CourseMajor {
  id: number;
  courseId: string;
  majorId: number;
}

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';

export interface BrandColors {
  light: {
    primary: string;
    primarySoft: string;
    primaryBorder: string;
  };
  dark: {
    primary: string;
    primarySoft: string;
    primaryBorder: string;
  };
}

export interface ResourceItem {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
  uploader: string;
}

export interface ResourceSection {
  section: string;
  items: ResourceItem[];
}

export interface CompletedFiles {
  [key: string]: boolean;
}

export interface CourseWithCode {
  id: number;
  code: string;
  nameEn: string;
  nameAr: string;
  majorCode?: string;
}
