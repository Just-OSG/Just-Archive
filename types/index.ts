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
  code: string;
  nameEn: string;
  nameAr: string;
  majorEn: string;
  majorAr: string;
}

export interface FavoriteCourse {
  code: string;
  nameEn: string;
  nameAr: string;
  majorEn: string;
  majorAr: string;
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
