import React from "react";

type FancyLoaderProps = {
  fullScreen?: boolean;
  label?: string;
};

const FancyLoader: React.FC<FancyLoaderProps> = ({ fullScreen = false, label = "Loading..." }) => {
  return (
    <div className={`${fullScreen ? 'min-h-screen' : ''} flex items-center justify-center bg-white dark:bg-slate-900`}>
      <div className="flex flex-col items-center gap-4 p-8">
        {/* Glowy gradient orb with bouncing dots */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF5500] via-[#FF7A00] to-[#FFA500] blur-md opacity-60" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF5500] via-[#FF7A00] to-[#FFA500] animate-spin" />
          <div className="absolute inset-2 rounded-full bg-white dark:bg-slate-900" />
          {/* Bouncing dots */}
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5500] animate-bounce" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A00] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFA500] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
        {/* Label */}
        <div className="text-sm font-medium text-gray-700 dark:text-gray-200 tracking-wide">
          {label}
        </div>
      </div>
    </div>
  );
};

export default FancyLoader;



