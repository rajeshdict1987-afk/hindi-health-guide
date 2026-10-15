'use client';

import React from 'react';

interface AdsterraNativeAdProps {
  className?: string;
  adId?: string;
  placement?: 'homepage' | 'article-midway' | 'article-end' | 'sidebar' | string;
}

export function AdsterraNativeAd({
  className = '',
  adId = 'd9642fd6678c07a30a56b2fd136e6cb5',
  placement = 'general'
}: AdsterraNativeAdProps) {
  const iframeHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base target="_blank">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    #container-${adId} {
      width: 100%;
      min-height: 90px;
    }
  </style>
</head>
<body>
  <div id="container-${adId}"></div>
  <script async="async" data-cfasync="false" src="https://bicea.org/21/${adId}"></script>
</body>
</html>`;

  return (
    <div
      data-placement={placement}
      className={`adsterra-native-ad-wrapper my-6 overflow-hidden bg-white/90 border border-stone-200/90 rounded-2xl p-4 shadow-sm transition-all ${className}`}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
        <span className="text-[10px] tracking-wider font-semibold text-stone-400 uppercase">
          विज्ञापन / प्रायोजित स्वास्थ्य सिफारिशें (Sponsored)
        </span>
        <span className="text-[10px] text-stone-400">
          Adsterra Native
        </span>
      </div>

      <div className="w-full flex justify-center items-center min-h-[110px] overflow-hidden">
        <iframe
          title={`Adsterra Native Ad - ${placement}`}
          srcDoc={iframeHtml}
          className="w-full border-0 overflow-hidden min-h-[110px]"
          scrolling="no"
          loading="lazy"
        />
      </div>
    </div>
  );
}
