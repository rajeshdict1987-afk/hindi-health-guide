/**
 * Client-side Image Optimization & Resizing Utility
 * Supports all mobile and desktop browsers (Android, iOS, Chrome, Safari, etc.)
 * Resizes large camera photos (5MB-15MB) down to optimized 1200px (~100KB-200KB)
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
}

export interface OptimizedImageResult {
  blob: Blob;
  dataUrl: string;
  name: string;
}

export async function optimizeImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<OptimizedImageResult> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = options;

  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('कृपया केवल वैध इमेज फाइल (JPG/PNG/WebP) चुनें।');
  }

  // 1. Read file to Data URL
  const originalDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('फाइल पढ़ने में विफल'));
    reader.readAsDataURL(file);
  });

  // 2. Load into Image
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('इमेज लोड करने में विफल'));
    image.src = originalDataUrl;
  });

  // 3. Proportional resize within maxWidth x maxHeight
  let { width, height } = img;
  if (width > maxWidth || height > maxHeight) {
    if (width > height) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    } else {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }

  // 4. Draw to Canvas
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context error');
  ctx.drawImage(img, 0, 0, width, height);

  // 5. Try WebP first (supported by 98%+ modern browsers), fallback to JPEG
  let dataUrl = '';
  try {
    dataUrl = canvas.toDataURL('image/webp', quality);
    if (!dataUrl.startsWith('data:image/webp')) {
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }
  } catch {
    try {
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    } catch {
      dataUrl = originalDataUrl;
    }
  }

  // 6. Create Blob safely (try WebP, fallback to JPEG)
  let blob: Blob | null = await new Promise<Blob | null>((resolve) => {
    try {
      canvas.toBlob((b) => {
        if (b && b.type.includes('webp')) {
          resolve(b);
        } else {
          canvas.toBlob((bJpg) => resolve(bJpg), 'image/jpeg', quality);
        }
      }, 'image/webp', quality);
    } catch {
      resolve(null);
    }
  });

  if (!blob) {
    try {
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      blob = new Blob([ab], { type: mimeString });
    } catch {
      blob = file;
    }
  }

  const cleanBase = (file.name || 'photo').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30) || 'photo';
  const name = `${cleanBase}_${Date.now()}.webp`;

  return { blob, dataUrl, name };
}

// Backward-compatible wrapper
export async function compressAndConvertToWebP(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const result = await optimizeImageFile(file, options);
  try {
    return new File([result.blob], result.name, {
      type: result.blob.type || 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch {
    // If new File() constructor is not supported on this mobile browser
    const blobWithProps = result.blob as any;
    blobWithProps.name = result.name;
    blobWithProps.lastModified = Date.now();
    return blobWithProps as File;
  }
}
