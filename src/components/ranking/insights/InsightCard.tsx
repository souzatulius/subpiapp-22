
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string;
  comment: string;
  isLoading: boolean;
  trend?: 'up' | 'down' | 'neutral';
  isSimulated?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  value, 
  comment, 
  isLoading,
  trend,
  isSimulated = false
}) => {
  return (
    <Card className={`overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all ${
      isSimulated ? 'border-orange-300 bg-orange-50' : 'border-blue-100'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-medium ${isSimulated ? 'text-orange-700' : 'text-blue-700'}`}>
            {title}
          </h3>
          {trend && (
            <div className={`flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="mt-2">
            <Skeleton className="h-8 w-28 bg-blue-50" />
            <Skeleton className="h-4 w-full mt-2 bg-blue-50" />
          </div>
        ) : (
          <>
            <p className={`text-2xl font-bold mt-1 ${isSimulated ? 'text-orange-800' : 'text-blue-900'}`}>
              {value}
            </p>
            <p className="text-xs mt-1.5 text-gray-500">{comment}</p>
          </>
        )}
      </div>
    </Card>
  );
};

export default InsightCard;
