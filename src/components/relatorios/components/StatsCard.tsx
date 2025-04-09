
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  comparison?: string;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  comparison,
  trend,
  isLoading = false,
  description
}) => {
  // Format value with comma as decimal separator
  const formatValue = (val: string | number): string => {
    const stringValue = val.toString();
    if (stringValue.includes('.')) {
      return stringValue.replace('.', ',');
    }
    return stringValue;
  };
  
  return (
    <Card className="p-4 border border-blue-200 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
      </div>
      
      {isLoading ? (
        <>
          <Skeleton className="h-7 w-24 bg-gray-200 mb-2" />
          <Skeleton className="h-4 w-full bg-gray-100 mb-1" />
          <Skeleton className="h-4 w-3/4 bg-gray-100" />
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-blue-600 mb-1">{formatValue(value)}</p>
          {description && (
            <p className="text-xs text-gray-600 line-clamp-1">
              {description}
            </p>
          )}
          {comparison && (
            <p className="text-xs text-orange-600 font-medium mt-1">
              {comparison}
            </p>
          )}
        </>
      )}
    </Card>
  );
};
