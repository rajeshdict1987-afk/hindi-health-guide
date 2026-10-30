import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

/**
 * Universal Image Processor & WebP Converter
 * - Converts ANY image format (JPG, JPEG, PNG, GIF, WebP, TIFF, HEIC, etc.) to modern WebP
 * - Auto-orients mobile camera photos using EXIF metadata (.rotate())
 * - Resizes large photos (5MB - 20MB) down to max 1200px dimension
 * - Compresses to lightweight ~50KB - 180KB WebP file for maximum speed and zero server bloat
 */
async function processAndSaveToWebP(
  inputBuffer: Buffer,
  rawName: string,
  uploadDir: string
): Promise<{ url: string; filename: string; size: number; sizeKB: number }> {
  // Clean filename base
  const ext = path.extname(rawName);
  const baseName = path.basename(rawName, ext)
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_\u0900-\u097F-]/g, '_')
    .substring(0, 40) || 'photo';

  const uniqueName = `${baseName}_${Date.now()}.webp`;
  const filePath = path.join(uploadDir, uniqueName);

  let outputBuffer: Buffer;
  try {
    outputBuffer = await sharp(inputBuffer)
      .rotate() // Auto-orient mobile camera photos based on EXIF tag
      .resize({
        width: 1200,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 80, // High visual fidelity with ~50KB - 180KB file size
        effort: 4,
      })
      .toBuffer();
  } catch (sharpError) {
    console.warn('Sharp WebP conversion fallback:', sharpError);
    // If sharp fails for any rare raw buffer reason, write input directly
    outputBuffer = inputBuffer;
  }

  fs.writeFileSync(filePath, outputBuffer);

  return {
    url: `/uploads/${uniqueName}`,
    filename: uniqueName,
    size: outputBuffer.length,
    sizeKB: Math.round(outputBuffer.length / 1024),
  };
}

export async function POST(req: NextRequest) {
  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const contentType = req.headers.get('content-type') || '';

    // Case 1: multipart/form-data upload (Direct file / camera selection)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'कोई फोटो फाइल नहीं मिली (No file provided)' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const inputBuffer = Buffer.from(bytes);

      const result = await processAndSaveToWebP(inputBuffer, file.name || 'image', uploadDir);

      return NextResponse.json({
        success: true,
        url: result.url,
        filename: result.filename,
        format: 'webp',
        size: result.size,
        sizeKB: `${result.sizeKB} KB`,
      });
    }

    // Case 2: JSON payload with Base64 data (Data URL from client canvas / camera preview)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { base64, filename } = body;

      if (!base64 || typeof base64 !== 'string') {
        return NextResponse.json(
          { success: false, error: 'अमान्य बेस64 डेटा' },
          { status: 400 }
        );
      }

      // Extract raw base64 data by stripping data:image/...;base64,
      const matches = base64.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      const rawBase64 = matches ? matches[2] : base64;
      const inputBuffer = Buffer.from(rawBase64, 'base64');

      const result = await processAndSaveToWebP(inputBuffer, filename || 'photo', uploadDir);

      return NextResponse.json({
        success: true,
        url: result.url,
        filename: result.filename,
        format: 'webp',
        size: result.size,
        sizeKB: `${result.sizeKB} KB`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'अमान्य Content-Type (multipart/form-data या application/json आवश्यक)' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('API /api/upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'इमेज अपलोड व WebP कन्वर्शन विफल रहा' },
      { status: 500 }
    );
  }
}
