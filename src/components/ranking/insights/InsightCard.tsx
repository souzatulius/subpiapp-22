
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface InsightCardProps {
  title: string;
  value: string;
  comment: string;
  isLoading: boolean;
  isSimulated?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, value, comment, isLoading, isSimulated = false }) => {
  return (
    <Card className={`border ${isSimulated ? 'border-orange-300 bg-orange-50' : 'border-gray-200'} hover:shadow-md transition-all`}>
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <Skeleton className="h-8 w-24 mb-2" />
        ) : (
          <div className={`text-2xl font-bold ${isSimulated ? 'text-orange-600' : 'text-gray-900'}`}>
            {value}
          </div>
        )}
        {isLoading ? (
          <Skeleton className="h-4 w-full mb-1" />
        ) : (
          <p className="text-xs text-gray-500 mt-1">{comment}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightCard;
