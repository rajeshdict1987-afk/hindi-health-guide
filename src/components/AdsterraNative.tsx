'use client';

import React, { useId } from 'react';

export default function AdsterraNative() {
  const instanceId = useId().replace(/:/g, '');

  const nativeSrcDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base target="_blank">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; margin: 0; padding: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: transparent; }
  </style>
</head>
<body>
  <script async="async" data-cfasync="false" src="https://bicea.org/21/a9ad3018c2431fdea4af006d48b847cc"></script>
  <div id="container-a9ad3018c2431fdea4af006d48b847cc"></div>
</body>
</html>`;

  return (
    <div className="my-6 p-3 bg-white border border-stone-200/90 rounded-2xl shadow-xs overflow-hidden w-full">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 text-xs text-stone-500 font-medium">
        <span>सुझावित स्वास्थ्य आलेख एवं प्रायोजित सिफारिशें</span>
        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">प्रायोजित</span>
      </div>
      <iframe
        id={`native-frame-${instanceId}`}
        title="Adsterra Native Recommendation"
        srcDoc={nativeSrcDoc}
        style={{
          width: '100%',
          minHeight: '220px',
          border: 'none',
          overflow: 'hidden',
          display: 'block',
        }}
        scrolling="no"
        loading="lazy"
      />
    </div>
  );
}
