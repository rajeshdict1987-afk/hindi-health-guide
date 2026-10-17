'use client';

import React, { useEffect, useRef } from 'react';

export default function AdsterraNative() {
  const nativeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nativeRef.current) return;
    nativeRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = 'https://bicea.org/21/a9ad3018c2431fdea4af006d48b847cc';

    nativeRef.current.appendChild(script);
  }, []);

  return (
    <div className="my-6 p-2 bg-white border border-gray-100 rounded-lg shadow-sm flex justify-center">
      <div id="container-a9ad3018c2431fdea4af006d48b847cc" ref={nativeRef} className="w-full max-w-full"></div>
    </div>
  );
}
