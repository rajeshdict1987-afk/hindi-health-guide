'use client';

import React, { useId } from 'react';

interface BannerProps {
  keyId: string;
  width: number;
  height: number;
  className?: string;
}

export default function AdsterraBanner({ keyId, width, height, className = '' }: BannerProps) {
  const instanceId = useId().replace(/:/g, '');

  const srcDocHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base target="_blank">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key': '${keyId}',
      'format': 'iframe',
      'height': ${height},
      'width': ${width},
      'params': {}
    };
  </script>
  <script type="text/javascript" src="https://bicea.org/22/${keyId}"></script>
</body>
</html>`;

  return (
    <div className={`my-4 flex flex-col items-center justify-center overflow-hidden w-full ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium mb-1 select-none">
        विज्ञापन (Sponsored)
      </span>
      <div 
        style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
        className="flex items-center justify-center bg-stone-50 rounded-xl overflow-hidden border border-stone-200/70 shadow-xs"
      >
        <iframe
          id={`ad-frame-${instanceId}`}
          title={`Adsterra Ad ${width}x${height}`}
          srcDoc={srcDocHtml}
          width={width}
          height={height}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            maxWidth: '100%',
            border: 'none',
            overflow: 'hidden',
            display: 'block',
          }}
          scrolling="no"
          loading="lazy"
        />
      </div>
    </div>
  );
}
