
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProcessoListSkeletonProps {
  viewMode?: 'list' | 'cards';
}

const ProcessoListSkeleton: React.FC<ProcessoListSkeletonProps> = ({ viewMode = 'list' }) => {
  const skeletonCount = viewMode === 'list' ? 5 : 6;

  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array(skeletonCount).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-5 w-4/5 mt-3" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-3 w-20" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array(skeletonCount).fill(0).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-5 w-4/5" />
              <div className="flex space-x-4 mt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessoListSkeleton;
