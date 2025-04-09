
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProcessoListSkeletonProps {
  count?: number;
  viewMode?: 'list' | 'cards';
}

const ProcessoListSkeleton: React.FC<ProcessoListSkeletonProps> = ({ 
  count = 3, 
  viewMode = 'list'
}) => {
  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="rounded-xl overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <Skeleton className="h-6 w-full rounded-xl" />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3 rounded-xl" />
                <Skeleton className="h-4 w-1/3 rounded-xl" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3 rounded-xl" />
                <Skeleton className="h-4 w-1/3 rounded-xl" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3 rounded-xl" />
                <Skeleton className="h-4 w-20 rounded-xl" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 flex justify-end space-x-2 bg-gray-50">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
              <div className="space-y-3 w-full md:w-auto md:flex-1">
                <Skeleton className="h-6 w-3/4 rounded-xl" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-4 w-24 rounded-xl" />
                  <Skeleton className="h-4 w-32 rounded-xl" />
                  <Skeleton className="h-4 w-20 rounded-xl" />
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-4 w-full md:w-auto">
                <Skeleton className="h-6 w-20 rounded-xl" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-xl" />
                  <Skeleton className="h-8 w-8 rounded-xl" />
                  <Skeleton className="h-8 w-8 rounded-xl" />
                  <Skeleton className="h-8 w-8 rounded-xl" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProcessoListSkeleton;
