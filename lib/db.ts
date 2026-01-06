import { drizzle } from 'drizzle-orm/d1';
import { eq, and, desc } from 'drizzle-orm';
import { files, courses, courseMajors } from '@/db/schema';
import type { File, Course } from '@/types';

// This will be initialized with D1 database in API routes
export function getDb(d1Database: D1Database) {
  return drizzle(d1Database);
}


// Insert a new file record
export async function createFile(db: ReturnType<typeof getDb>, file: Omit<File, 'createdAt' | 'updatedAt'>) {
  return await db.insert(files).values({
    id: file.id,
    courseId: file.courseId,
    fileName: file.fileName,
    fileType: file.fileType,
    fileUrl: file.fileUrl,
    fileSizeBytes: file.fileSizeBytes,
    mimeType: file.mimeType,
    date: Math.floor(file.date.getTime() / 1000), // Convert to Unix timestamp
    semester: file.semester,
    year: file.year,
    doctorName: file.doctorName,
    uploadedBy: file.uploadedBy,
    uploadedAt: Math.floor((file.uploadedAt || new Date()).getTime() / 1000),
    isVerified: file.isVerified ? 1 : 0,
    downloadCount: file.downloadCount || 0,
    tags: file.tags ? JSON.stringify(file.tags) : null,
    notes: file.notes,
  }).returning();
}

// Get all files for a course
export async function getFilesByCourse(db: ReturnType<typeof getDb>, courseId: string) {
  return await db.select().from(files).where(eq(files.courseId, courseId)).orderBy(desc(files.uploadedAt));
}

// Get a single file by ID
export async function getFileById(db: ReturnType<typeof getDb>, fileId: string) {
  const result = await db.select().from(files).where(eq(files.id, fileId)).limit(1);
  return result[0];
}

// Delete a file record
export async function deleteFile(db: ReturnType<typeof getDb>, fileId: string) {
  return await db.delete(files).where(eq(files.id, fileId));
}

// Increment download count
export async function incrementDownloadCount(db: ReturnType<typeof getDb>, fileId: string) {
  const file = await getFileById(db, fileId);
  if (file) {
    return await db.update(files)
      .set({ downloadCount: (file.downloadCount || 0) + 1 })
      .where(eq(files.id, fileId));
  }
}

// Get or create a course
export async function getCourseById(db: ReturnType<typeof getDb>, courseId: string) {
  const result = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  return result[0];
}
