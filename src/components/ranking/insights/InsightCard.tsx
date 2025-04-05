
import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface InsightCardProps {
  title: string;
  value: string;
  comment: string;
  isLoading: boolean;
  isSimulated?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  comment,
  isLoading,
  isSimulated = false
}) => {
  // Function to format numbers with comma as decimal separator
  const formatValue = (val: string): string => {
    // Check if the value contains a decimal point
    if (val.includes('.')) {
      return val.replace('.', ',');
    }
    
    // Special case for "OS Fora do Prazo" - remove "OS" suffix
    if (title === "OS Fora do Prazo" && val.endsWith(" OS")) {
      return val.replace(" OS", "");
    }
    
    return val;
  };

  return (
    <Card className={`p-4 border ${isSimulated ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200'} hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-blue-700">{title}</h3>
        {isSimulated && <Sparkles className="h-4 w-4 text-blue-500" />}
      </div>
      
      {isLoading ? (
        <>
          <Skeleton className="h-7 w-24 bg-gray-200 mb-2" />
          <Skeleton className="h-4 w-full bg-gray-100 mb-1" />
          <Skeleton className="h-4 w-3/4 bg-gray-100" />
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-blue-600 mb-2">{formatValue(value)}</p>
          <p className="text-xs text-gray-600 line-clamp-2" title={comment}>
            {comment}
          </p>
        </>
      )}
    </Card>
  );
};

export default InsightCard;
