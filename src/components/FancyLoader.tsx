import React from "react";

type FancyLoaderProps = {
  fullScreen?: boolean;
  label?: string;
};

const FancyLoader: React.FC<FancyLoaderProps> = ({ fullScreen = false, label = "Loading..." }) => {
  return (
    <div className={`${fullScreen ? 'min-h-screen' : ''} flex items-center justify-center bg-white dark:bg-slate-900`}>
      <div className="flex flex-col items-center gap-3 p-6">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#FF5500]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-[#FF5500] border-t-transparent animate-spin" style={{ animationDuration: '900ms' }} />
        </div>
        <div className="text-xs font-medium text-gray-600 dark:text-gray-300 tracking-wide">
          {label}
        </div>
      </div>
    </div>
  );
};

export default FancyLoader;



