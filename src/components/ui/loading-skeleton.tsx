
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`col-${rowIndex}-${colIndex}`}
              className={`h-10 ${colIndex === 0 ? 'w-[30%]' : 'w-full'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
