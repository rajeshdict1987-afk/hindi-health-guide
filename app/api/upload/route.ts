import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const contentType = req.headers.get('content-type') || '';

    // Handling multipart/form-data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: 'कोई फाइल नहीं मिली (No file provided)' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename
      const originalName = file.name || 'image.webp';
      const ext = path.extname(originalName) || '.webp';
      const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
      const uniqueName = `${baseName}_${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueName}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: uniqueName,
        size: buffer.length,
      });
    }

    // Handling JSON with base64 payload
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { base64, filename } = body;

      if (!base64 || typeof base64 !== 'string') {
        return NextResponse.json({ success: false, error: 'अमान्य बेस64 डेटा' }, { status: 400 });
      }

      // Strip data:image/...;base64,
      const matches = base64.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      const rawBase64 = matches ? matches[2] : base64;
      const format = matches ? matches[1].replace('jpeg', 'jpg') : 'webp';

      const buffer = Buffer.from(rawBase64, 'base64');
      const cleanBaseName = (filename || 'photo').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
      const uniqueName = `${cleanBaseName}_${Date.now()}.${format}`;
      const filePath = path.join(uploadDir, uniqueName);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueName}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: uniqueName,
        size: buffer.length,
      });
    }

    return NextResponse.json({ success: false, error: 'अमान्य Content-Type' }, { status: 400 });
  } catch (error: any) {
    console.error('API /api/upload error:', error);
    return NextResponse.json({ success: false, error: error.message || 'इमेज अपलोड विफल रहा' }, { status: 500 });
  }
}
