import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Universal upload function that handles both Cloudinary CDN and local storage fallback
 */
export async function uploadFile(file: File, buffer: Buffer): Promise<{ url: string; publicId?: string }> {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dytytwyp6';
  let apiKey = process.env.CLOUDINARY_API_KEY || '665655696219164';
  let apiSecret = process.env.CLOUDINARY_API_SECRET || 'PXKKxzem3z2pqHtTUI3-J7lcH9k';
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  // Parse CLOUDINARY_URL if provided
  if (cloudinaryUrl && (!cloudName || !apiKey || !apiSecret)) {
    try {
      const url = new URL(cloudinaryUrl);
      cloudName = url.hostname || cloudName;
      apiKey = url.username || apiKey;
      apiSecret = url.password || apiSecret;
    } catch (err) {
      console.error('Failed to parse CLOUDINARY_URL');
    }
  }

  // Use Cloudinary if credentials are present
  if (cloudName && (uploadPreset || (apiKey && apiSecret))) {
    try {
      const formData = new FormData();
      formData.append('file', new Blob([buffer], { type: file.type || 'application/octet-stream' }));
      
      const dotIdx = file.name.lastIndexOf('.');
      const baseName = dotIdx !== -1 ? file.name.substring(0, dotIdx) : file.name;
      const cleanFileName = `${baseName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}`;
      formData.append('public_id', cleanFileName);
      
      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      
      if (uploadPreset) {
        formData.append('upload_preset', uploadPreset);
      } else if (apiKey && apiSecret) {
        const timestamp = Math.round(new Date().getTime() / 1000).toString();
        formData.append('timestamp', timestamp);
        formData.append('api_key', apiKey);
        
        // Generate SHA-1 signature sorted alphabetically by parameters
        const { createHash } = await import('crypto');
        const signatureStr = `public_id=${cleanFileName}&timestamp=${timestamp}${apiSecret}`;
        const signature = createHash('sha1').update(signatureStr).digest('hex');
        formData.append('signature', signature);
      }
      
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok || data.error) {
        const errorMsg = data.error?.message || 'Unknown Cloudinary error';
        console.error('Cloudinary API Error:', data.error);
        throw new Error(`Cloudinary Upload Failed: ${errorMsg}`);
      }

      return {
        url: data.secure_url,
        publicId: data.public_id
      };
    } catch (error: any) {
      console.error('Upload Process Error:', error.message);
      // If Cloudinary fails, fallback to local storage below
    }
  }

  // Fallback to local storage
  try {
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return {
      url: `/uploads/${filename}`,
      publicId: filename
    };
  } catch (fsError: any) {
    console.error('Local FileSystem Storage failed:', fsError.message);
    throw fsError;
  }
}

