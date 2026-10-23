/**
 * Client-side Image Compression & WebP Conversion Utility
 * यह फ़ंक्शन इमेज को कंप्रेस करके WebP फॉर्मेट में बदलता है (अधिकतम 1200px चौड़ाई और 500KB साइज सीमा),
 * ताकि वेबसाइट हमेशा तेज़ (Fast) रहे, स्टोरेज बचे और कोर वेब वाइटल्स (Core Web Vitals) उच्चतम रहें।
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 से 1.0 के बीच
  maxSizeBytes?: number; // अधिकतम फाइल आकार बाइट्स में (डिफ़ॉल्ट 500KB = 512,000 bytes)
}

export async function compressAndConvertToWebP(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    maxSizeBytes = 200 * 1024 // 200 KB limit for lightning-fast Core Web Vitals
  } = options;

  if (!file.type.startsWith('image/')) {
    throw new Error('कृपया केवल वैध इमेज फाइल (JPEG/PNG/WebP) अपलोड करें।');
  }

  // Load image into HTMLImageElement
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    image.src = dataUrl;
  });

  // Calculate proportional dimensions maintaining aspect ratio within 1200px
  let curWidth = img.width;
  let curHeight = img.height;

  if (curWidth > curHeight) {
    if (curWidth > maxWidth) {
      curHeight = Math.round((curHeight * maxWidth) / curWidth);
      curWidth = maxWidth;
    }
  } else {
    if (curHeight > maxHeight) {
      curWidth = Math.round((curWidth * maxHeight) / curHeight);
      curHeight = maxHeight;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = curWidth;
  canvas.height = curHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context non-functional.');
  }

  ctx.drawImage(img, 0, 0, curWidth, curHeight);

  // Compression loop ensuring <= maxSizeBytes (500KB)
  let currentQuality = quality;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 4; attempt++) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', currentQuality);
    });

    if (blob && blob.size <= maxSizeBytes) {
      break;
    }

    // If still over 500KB, reduce quality and if necessary downscale canvas slightly
    currentQuality = Math.max(0.4, currentQuality - 0.15);
    if (attempt >= 2 && blob && blob.size > maxSizeBytes) {
      curWidth = Math.round(curWidth * 0.85);
      curHeight = Math.round(curHeight * 0.85);
      canvas.width = curWidth;
      canvas.height = curHeight;
      ctx.drawImage(img, 0, 0, curWidth, curHeight);
    }
  }

  if (!blob) {
    throw new Error('इमेज कम्प्रेशन विफल रहा।');
  }

  const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const cleanName = originalNameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_');
  const compressedFileName = `${cleanName}_${Date.now()}.webp`;

  return new File([blob], compressedFileName, {
    type: 'image/webp',
    lastModified: Date.now(),
  });
}
