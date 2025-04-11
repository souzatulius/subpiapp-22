
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface InsightCardProps {
  title: string;
  value: string | number;
  comment?: string;
  isLoading?: boolean;
  isSimulated?: boolean;
  progress?: number;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  value, 
  comment,
  isLoading = false,
  isSimulated = false,
  progress = 0
}) => {
  return (
    <Card className={`
      overflow-hidden
      ${isSimulated ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}
      ${isLoading ? 'animate-pulse' : ''}
    `}>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            {/* Mostrar barra de progresso se progress > 0 */}
            {progress > 0 && (
              <div className="mt-2">
                <Progress 
                  value={progress} 
                  className="h-1.5" 
                  indicatorClassName="bg-orange-500" 
                />
                <p className="text-xs text-gray-500 text-right mt-1">
                  {progress < 100 ? 'Analisando...' : 'Análise concluída'} {progress}%
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
            {comment && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{comment}</p>
            )}
            {isSimulated && (
              <div className="mt-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700">
                Simulação
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightCard;
