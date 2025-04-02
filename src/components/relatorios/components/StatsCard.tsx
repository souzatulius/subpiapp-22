
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardProps {
  title: string;
  value: string | number;
  comparison?: string;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  comparison,
  trend,
  isLoading = false
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4 text-orange-500" />;
      case 'down':
        return <ArrowDownIcon className="h-4 w-4 text-orange-500" />;
      case 'neutral':
        return <ArrowRightIcon className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="transition-all duration-300 border-orange-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-orange-50 to-white">
        <CardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-20 bg-orange-50 mb-2" />
            <Skeleton className="h-3 w-32 bg-orange-50" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-orange-500">{value}</div>
            {comparison && (
              <p className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                {getTrendIcon()}
                {comparison}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
