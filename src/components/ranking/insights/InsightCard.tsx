
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
  // Format value to use commas instead of periods for decimal separator (Brazilian format)
  const formatValue = (val: string): string => {
    return val.replace('.', ',');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all ${
        isSimulated ? 'border-orange-300 bg-orange-50' : 'border-blue-100'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium text-blue-900`}>
              {title}
            </h3>
            {trend && (
              <div className={`flex items-center ${
                trend === 'up' 
                  ? 'text-green-500' 
                  : trend === 'down' 
                    ? 'text-red-500' 
                    : 'text-gray-400'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp size={16} className="animate-pulse" />
                ) : trend === 'down' ? (
                  <TrendingDown size={16} className="animate-pulse" />
                ) : (
                  <Minus size={16} />
                )}
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <Skeleton className="h-8 w-24 bg-blue-50" />
                <Loader2 size={16} className="ml-2 animate-spin text-blue-500" />
              </div>
              <Skeleton className="h-4 w-full mt-2 bg-blue-50" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <p className={`text-2xl font-bold mt-1 text-orange-500`}>
                {isSimulated ? formatValue(value) : value}
              </p>
              <p className="text-xs mt-1.5 text-gray-500">{comment}</p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default InsightCard;
