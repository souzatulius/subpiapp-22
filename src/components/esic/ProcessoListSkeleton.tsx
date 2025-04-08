
import React from 'react';

interface ProcessoListSkeletonProps {
  count?: number;
}

const ProcessoListSkeleton: React.FC<ProcessoListSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-md p-4 animate-pulse">
          <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
          <div className="flex justify-between">
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessoListSkeleton;
