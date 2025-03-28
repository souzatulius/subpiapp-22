
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string;
  comment: string;
  isLoading?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  value, 
  comment, 
  isLoading = false 
}) => {
  return (
    <Card className="h-full border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-orange-50">
      <CardHeader className="pb-2 border-b border-orange-200">
        <CardTitle className="text-base text-gray-800 font-semibold flex items-center">
          {title}
        </CardTitle>
        <div className="text-2xl font-bold text-orange-600">
          {isLoading ? <Skeleton className="h-8 w-24" /> : value}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <Skeleton className="h-[60px] w-full" />
        ) : (
          <div className="flex items-start gap-2 text-gray-500 text-sm">
            <Lightbulb className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <p>{comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightCard;
