import { NextRequest, NextResponse } from 'next/server';
import { getDb, getFilesByCourse } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;

    // Get D1 database
    const db = getDb((req as any).env?.DB);
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const filesList = await getFilesByCourse(db, courseId);

    // Parse tags from JSON strings
    const filesWithTags = filesList.map(file => ({
      ...file,
      tags: file.tags ? JSON.parse(file.tags as string) : [],
      date: new Date(file.date * 1000), // Convert Unix timestamp to Date
      uploadedAt: new Date(file.uploadedAt * 1000),
    }));

    return NextResponse.json({ files: filesWithTags });

  } catch (error) {
    console.error('Get files error:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
