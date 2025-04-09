
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RankingProgressCardProps {
  title: string;
  value: number;
  max: number;
  color?: string;
}

const RankingProgressCard: React.FC<RankingProgressCardProps> = ({
  title,
  value,
  max,
  color = 'bg-blue-500'
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <Card className="border border-blue-200 hover:shadow-md transition-all bg-white rounded-xl">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{value}</span>
            <span>{max}</span>
          </div>
          <Progress 
            value={percentage} 
            className="h-2" 
          />
          <div className="mt-1 text-xs text-right text-gray-500">
            {percentage}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingProgressCard;
