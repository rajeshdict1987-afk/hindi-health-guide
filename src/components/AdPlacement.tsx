import React from 'react';

interface AdPlacementProps {
  slotId?: string;
  format?: 'horizontal' | 'sidebar' | 'inline';
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({
  format = 'horizontal',
  className = '',
}) => {
  return (
    <div
      className={`my-8 p-4 bg-stone-100/80 border border-dashed border-stone-300 rounded-xl text-center select-none ${className}`}
      aria-label="विज्ञापन स्थान"
    >
      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
        <span>विज्ञापन (Advertisement)</span>
        <span className="text-[10px] text-stone-400">ASCI मानक अनुपालन</span>
      </div>
      <div
        className={`flex flex-col items-center justify-center bg-white/60 rounded-lg border border-stone-200/60 text-stone-400 text-xs ${
          format === 'horizontal'
            ? 'h-24 sm:h-28'
            : format === 'sidebar'
            ? 'h-64'
            : 'h-20'
        }`}
      >
        <p className="font-medium text-stone-500">Google AdSense / प्रायोजित सूचना स्थान</p>
        <p className="text-[11px] text-stone-400 mt-0.5">
          (केवल प्रासंगिक एवं परिवार-सुरक्षित स्वास्थ्य विज्ञापन)
        </p>
      </div>
    </div>
  );
};
