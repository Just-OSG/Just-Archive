import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getUploadUrl } from '@/lib/r2';
import { getDb, createFile } from '@/lib/db';

// Check if user is admin
function isAdmin(email?: string): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(email);
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Get user email from auth session
    const userEmail = req.headers.get('x-user-email'); // Placeholder until auth is set up
    
    if (!isAdmin(userEmail || undefined)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { courseId, fileName, fileType, contentType, semester, year, doctorName, tags, notes } = body;

    // Validate required fields
    if (!courseId || !fileName || !fileType || !contentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique file ID and R2 key
    const fileId = uuidv4();
    const fileExtension = contentType.split('/')[1] || 'pdf';
    const r2Key = `courses/${courseId}/${fileType}/${fileId}.${fileExtension}`;

    // Generate presigned upload URL
    const uploadUrl = await getUploadUrl(r2Key, contentType);

    // Return upload URL and file metadata
    // Frontend will upload directly to R2, then call /api/files/confirm
    return NextResponse.json({
      fileId,
      uploadUrl,
      r2Key,
      message: 'Upload URL generated. Upload file, then call /api/files/confirm',
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
