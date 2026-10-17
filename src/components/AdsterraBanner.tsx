'use client';

import React, { useEffect, useRef } from 'react';

interface BannerProps {
  keyId: string;
  width: number;
  height: number;
  className?: string;
}

export default function AdsterraBanner({ keyId, width, height, className = '' }: BannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;
    bannerRef.current.innerHTML = '';

    const container = bannerRef.current;
    const atOptionsScript = document.createElement('script');
    atOptionsScript.type = 'text/javascript';
    atOptionsScript.text = `
      atOptions = {
        'key' : '${keyId}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = `https://bicea.org/22/${keyId}`;
    adScript.async = true;

    container.appendChild(atOptionsScript);
    container.appendChild(adScript);
  }, [keyId, width, height]);

  return (
    <div className={`flex justify-center items-center my-4 overflow-hidden ${className}`}>
      <div 
        ref={bannerRef} 
        style={{ width: `${width}px`, height: `${height}px` }} 
        className="max-w-full flex justify-center items-center" 
      />
    </div>
  );
}
