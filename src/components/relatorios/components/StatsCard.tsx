
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value?: number | string;
  comparison?: string;
  isLoading?: boolean;
  description?: string;
  direction?: 'increase' | 'decrease' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  comparison, 
  isLoading = false,
  description,
  direction = 'neutral'
}) => {
  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {title}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">
                {value}
              </p>
              
              {direction !== 'neutral' && (
                direction === 'increase' ? (
                  <ArrowUpCircle className="text-green-500 h-5 w-5" />
                ) : (
                  <ArrowDownCircle className="text-red-500 h-5 w-5" />
                )
              )}
            </div>
            
            {comparison && (
              <p className="text-sm text-gray-600 mt-1">
                {comparison}
              </p>
            )}
            
            {description && (
              <p className="text-xs text-gray-500 mt-2 border-t pt-2">
                {description}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
