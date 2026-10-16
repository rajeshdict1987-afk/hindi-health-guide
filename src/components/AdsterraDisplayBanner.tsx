'use client';

import React from 'react';

export type AdsterraBannerFormat =
  | '728x90'          // Leaderboard Header / Footer
  | '300x250'         // Medium Rectangle In-Article / Middle Column
  | '468x60'          // Content Inline Banner
  | '160x600'         // Right Sidebar Skyscraper (15% Column) default
  | '160x600-sidebar' // Right Sidebar Skyscraper (15% Column)
  | '160x600-middle'  // Middle Column Skyscraper (25% Column)
  | '160x300'         // Middle Column Half-Skyscraper (25% Column) default
  | '160x300-middle'  // Middle Column Half-Skyscraper (25% Column)
  | '320x50';         // Mobile Sticky Footer Banner

interface BannerConfig {
  key: string;
  width: number;
  height: number;
  label: string;
}

export const ADSTERRA_BANNER_CONFIGS: Record<AdsterraBannerFormat, BannerConfig> = {
  '728x90': {
    key: '3e0d3210b9a9da73c0f4336c0f8d21fe',
    width: 728,
    height: 90,
    label: 'लीडरबोर्ड (728x90)',
  },
  '300x250': {
    key: '316fb9190ed4222a503bf837f29adea2',
    width: 300,
    height: 250,
    label: 'मध्यम आयत (300x250)',
  },
  '468x60': {
    key: 'a378f41055501ef2404d04d36be861cd',
    width: 468,
    height: 60,
    label: 'कंटेंट इनलाइन (468x60)',
  },
  '160x600': {
    key: 'b2e3bd75bd1ec0a824b2f19356300975',
    width: 160,
    height: 600,
    label: 'दायां साइडबार स्काईस्क्रेपर (160x600)',
  },
  '160x600-sidebar': {
    key: 'b2e3bd75bd1ec0a824b2f19356300975',
    width: 160,
    height: 600,
    label: 'दायां साइडबार स्काईस्क्रेपर (160x600)',
  },
  '160x600-middle': {
    key: '6e2ca6e4610cb2cf54c146f919553023',
    width: 160,
    height: 600,
    label: 'मिडिल कॉलम बैनर (160x600)',
  },
  '160x300': {
    key: '6e2ca6e4610cb2cf54c146f919553023',
    width: 160,
    height: 300,
    label: 'मिडिल कॉलम बैनर (160x300)',
  },
  '160x300-middle': {
    key: '6e2ca6e4610cb2cf54c146f919553023',
    width: 160,
    height: 300,
    label: 'मिडिल कॉलम बैनर (160x300)',
  },
  '320x50': {
    key: 'c7a2f1935c0da36c7b84231f71353506',
    width: 320,
    height: 50,
    label: 'मोबाइल बैनर (320x50)',
  },
};

interface AdsterraDisplayBannerProps {
  format: AdsterraBannerFormat;
  className?: string;
  hideBadge?: boolean;
}

export function AdsterraDisplayBanner({
  format,
  className = '',
  hideBadge = false,
}: AdsterraDisplayBannerProps) {
  const config = ADSTERRA_BANNER_CONFIGS[format];

  if (!config) return null;

  const { key, width, height, label } = config;

  const iframeSrcDoc = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <base target="_blank">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background: transparent;
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #ad-wrapper {
      width: ${width}px;
      height: ${height}px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div id="ad-wrapper">
    <script type="text/javascript">
      atOptions = {
        'key' : '${key}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
  </div>
</body>
</html>`;

  return (
    <div
      data-adsterra-banner={format}
      className={`adsterra-banner-container my-4 overflow-hidden bg-white/95 border border-stone-200/90 rounded-2xl p-3 sm:p-4 shadow-xs transition-all duration-300 flex flex-col items-center justify-center ${className}`}
    >
      {!hideBadge && (
        <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-stone-100/90 text-[10px] text-stone-500 font-semibold tracking-wider uppercase">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            विज्ञापन / Sponsored
          </span>
          <span className="text-[10px] text-stone-400 font-medium">
            {label}
          </span>
        </div>
      )}

      <div
        className="w-full flex justify-center items-center overflow-hidden"
        style={{ minHeight: `${height}px` }}
      >
        <iframe
          title={`Adsterra Display Banner - ${format}`}
          srcDoc={iframeSrcDoc}
          width={width}
          height={height}
          style={{
            maxWidth: '100%',
            height: `${height}px`,
            border: 'none',
            overflow: 'hidden',
          }}
          scrolling="no"
          loading="lazy"
        />
      </div>
    </div>
  );
}
