import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-[#FF5500]/20" />
        <div className="absolute inset-0 rounded-full border-2 border-[#FF5500] border-t-transparent animate-spin" style={{ animationDuration: '900ms' }} />
      </div>
    </div>
  );
};

export default LoadingSpinner; 