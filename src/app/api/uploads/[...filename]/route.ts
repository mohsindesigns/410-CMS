import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string[] }> }) {
  const resolvedParams = await params;
  const filePathSegment = resolvedParams.filename.join('/');
  
  // 1. Check if the file exists on the local filesystem (development / VPS)
  const localFilePath = path.join(process.cwd(), 'public', 'uploads', ...resolvedParams.filename);
  if (fs.existsSync(localFilePath)) {
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

  // 2. If not on local disk (e.g. on serverless production), redirect/proxy to Cloudinary
  const baseName = path.basename(filePathSegment, path.extname(filePathSegment)).replace(/[^a-zA-Z0-9_-]/g, '_');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dytytwyp6';
  
  // Check if blog image
  const isBlog = filePathSegment.startsWith('blog/') || filePathSegment.includes('/blog/');
  const publicId = isBlog ? `blog_${baseName}` : baseName;

  // Attempt to fetch from Cloudinary
  const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  return NextResponse.redirect(cloudinaryUrl, { status: 307 });
}

