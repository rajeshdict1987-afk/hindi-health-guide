'use client';

import React, { useState, useEffect } from 'react';

interface AdsterraNativeAdProps {
  className?: string;
  adId?: string;
  placement?: string;
}

export function AdsterraNativeAd({
  className = '',
  adId = 'd9642fd6678c07a30a56b2fd136e6cb5',
  placement = 'general'
}: AdsterraNativeAdProps) {
  const [iframeHeight, setIframeHeight] = useState<number>(140);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data && event.data.type === 'ADSTERRA_RESIZE' && event.data.placement === placement) {
        if (typeof event.data.height === 'number' && event.data.height > 60) {
          setIframeHeight(Math.min(event.data.height, 600));
        }
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [placement]);

  const iframeHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <base target="_blank">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    #container-${adId} {
      width: 100% !important;
      min-height: 100px;
      display: block;
    }
    iframe, table, div {
      max-width: 100% !important;
    }
  </style>
</head>
<body>
  <div id="container-${adId}"></div>
  <script async="async" data-cfasync="false" src="https://bicea.org/21/${adId}"></script>
  <script>
    function notifyHeight() {
      try {
        var h = document.body.scrollHeight || document.documentElement.scrollHeight;
        if (h > 60 && window.parent) {
          window.parent.postMessage({ type: 'ADSTERRA_RESIZE', placement: '${placement}', height: h }, '*');
        }
      } catch(e) {}
    }
    window.addEventListener('load', function() {
      notifyHeight();
      setTimeout(notifyHeight, 800);
      setTimeout(notifyHeight, 2000);
      setTimeout(notifyHeight, 4000);
    });
    if (window.ResizeObserver) {
      new ResizeObserver(notifyHeight).observe(document.body);
    }
  </script>
</body>
</html>`;

  return (
    <div
      data-placement={placement}
      className={`adsterra-native-ad-wrapper my-6 overflow-hidden bg-white/95 border border-stone-200/90 rounded-2xl p-4 shadow-sm transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
        <span className="text-[10px] tracking-wider font-semibold text-stone-500 uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          विज्ञापन / प्रायोजित स्वास्थ्य सिफारिशें (Sponsored)
        </span>
        <span className="text-[10px] text-stone-400 font-medium">
          Adsterra Native
        </span>
      </div>

      <div className="w-full flex justify-center items-center overflow-hidden">
        <iframe
          title={`Adsterra Native Ad - ${placement}`}
          srcDoc={iframeHtml}
          style={{ height: `${iframeHeight}px`, minHeight: '120px' }}
          className="w-full border-0 overflow-hidden transition-all duration-300"
          scrolling="no"
          loading="lazy"
        />
      </div>
    </div>
  );
}
