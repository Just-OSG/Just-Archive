import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Course table - stores all university courses
export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(), // e.g., "CPE333", "DSE211"
  nameEn: text('name_en').notNull(),
  nameAr: text('name_ar').notNull(),
  facultyId: integer('faculty_id').notNull(),
  credits: integer('credits'),
  descriptionEn: text('description_en'),
  descriptionAr: text('description_ar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Many-to-many relationship between courses and majors
export const courseMajors = sqliteTable('course_majors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  majorId: integer('major_id').notNull(),
});

// File types enum values
export const FILE_TYPES = {
  PYQ: 'pyq',
  NOTES: 'notes',
  SYLLABUS: 'syllabus',
  ASSIGNMENT: 'assignment',
  SLIDES: 'slides',
  SOLUTION: 'solution',
  BOOK: 'book',
  OTHER: 'other',
} as const;

// Files table - stores all uploaded files
export const files = sqliteTable('files', {
  id: text('id').primaryKey(), // UUID
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  
  // File Info
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(), // 'pyq', 'notes', 'syllabus', etc.
  fileUrl: text('file_url').notNull(), // R2 URL
  fileSizeBytes: integer('file_size_bytes').notNull(),
  mimeType: text('mime_type').notNull(),
  
  // Metadata
  date: integer('date', { mode: 'timestamp' }).notNull(), // Exam date or semester date
  semester: text('semester'), // "Fall 2024", "Spring 2025"
  year: integer('year'),
  doctorName: text('doctor_name'),
  
  // Admin tracking
  uploadedBy: text('uploaded_by').notNull(), // Admin email
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  downloadCount: integer('download_count').notNull().default(0),
  
  // Search & Display
  tags: text('tags'), // JSON array: ["chapter1", "algorithms"]
  notes: text('notes'), // Admin notes about the file
});
