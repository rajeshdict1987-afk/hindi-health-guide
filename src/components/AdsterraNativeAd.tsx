'use client';

import React, { useEffect, useRef, useId } from 'react';

interface AdsterraNativeAdProps {
  className?: string;
  adId?: string;
}

export function AdsterraNativeAd({ className = '', adId = 'd9642fd6678c07a30a56b2fd136e6cb5' }: AdsterraNativeAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/[:]/g, '');

  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerElementId = `container-${adId}-${reactId}`;
    
    containerRef.current.innerHTML = '';
    const innerDiv = document.createElement('div');
    innerDiv.id = containerElementId;
    containerRef.current.appendChild(innerDiv);

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = `https://bicea.org/21/${adId}`;
    
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [adId, reactId]);

  return (
    <div className={`my-6 text-center overflow-hidden bg-white/50 backdrop-blur-sm border border-stone-200/60 p-4 rounded-2xl shadow-sm ${className}`}>
      <span style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
        विज्ञापन / Sponsored
      </span>
      <div ref={containerRef} className="flex justify-center items-center min-h-[90px] w-full" />
    </div>
  );
}

