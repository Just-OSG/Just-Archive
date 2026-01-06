import { NextRequest, NextResponse } from 'next/server';
import { getDb, getFileById, incrementDownloadCount } from '@/lib/db';
import { getDownloadUrl } from '@/lib/r2';

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;

    // Get D1 database
    const db = getDb((req as any).env?.DB);
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const file = await getFileById(db, fileId);
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Extract R2 key from fileUrl
    const r2Key = file.fileUrl.split('.com/')[1];

    // Generate presigned download URL
    const downloadUrl = await getDownloadUrl(r2Key);

    // Increment download count
    await incrementDownloadCount(db, fileId);

    return NextResponse.json({ 
      downloadUrl,
      fileName: file.fileName,
      fileType: file.mimeType
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}
