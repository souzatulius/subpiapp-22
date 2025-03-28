
import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded-t-md"/>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex py-4 border-b">
          <div className="w-1/3 px-6">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"/>
            <div className="h-4 bg-gray-200 rounded w-1/2"/>
          </div>
          <div className="w-2/3 grid grid-cols-4 gap-2 px-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-5 bg-gray-200 rounded flex justify-center">
                <div className="h-5 w-5 bg-gray-300 rounded"/>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
