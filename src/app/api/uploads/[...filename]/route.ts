import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string[] }> }) {
  const resolvedParams = await params;
  const filePathSegment = resolvedParams.filename.join('/');

  // 1. Check if the file exists on the local filesystem (development / VPS)
  const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
  const localFilePath = path.resolve(uploadsDir, ...resolvedParams.filename);
  // never serve anything outside public/uploads (blocks ../ and encoded-slash traversal)
  if (localFilePath !== uploadsDir && !localFilePath.startsWith(uploadsDir + path.sep)) {
    return new NextResponse('Not found', { status: 404 });
  }
  if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
    const fileBuffer = fs.readFileSync(localFilePath);
    const ext = path.extname(localFilePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.mp4': 'video/mp4'
    };
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  // 2. Not on local disk: try the matching Cloudinary asset, but only redirect when it really exists.
  //    (Redirecting to a guessed id that 404s left broken images with a temporary 307.)
  const baseName = path.basename(filePathSegment, path.extname(filePathSegment)).replace(/[^a-zA-Z0-9_-]/g, '_');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dytytwyp6';
  const isBlog = filePathSegment.startsWith('blog/') || filePathSegment.includes('/blog/');
  const publicId = isBlog ? `blog_${baseName}` : baseName;
  const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;

  try {
    const head = await fetch(cloudinaryUrl, { method: 'HEAD', signal: AbortSignal.timeout(4000) });
    if (head.ok) {
      return NextResponse.redirect(cloudinaryUrl, { status: 301, headers: { 'Cache-Control': 'public, max-age=86400' } });
    }
  } catch {
    // fall through to 404
  }
  return new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'public, max-age=300' } });
}
