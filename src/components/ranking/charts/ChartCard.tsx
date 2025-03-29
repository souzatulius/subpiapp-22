
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartCardProps {
  title: string;
  value: string | number;
  isLoading: boolean;
  children: ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  value, 
  isLoading, 
  children 
}) => {
  return (
    <Card className="overflow-hidden border border-orange-200 hover:shadow-md transition-all bg-white">
      <CardContent className="p-0">
        <div className="p-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white">
          <h3 className="text-sm sm:text-base font-medium text-orange-700">{title}</h3>
          {isLoading ? (
            <Skeleton className="h-6 w-28 mt-1 bg-orange-100" />
          ) : (
            <p className="text-lg sm:text-xl font-semibold text-orange-600">
              {value}
            </p>
          )}
        </div>
        <div className="p-4 h-[250px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Skeleton className="h-[200px] w-full rounded-md bg-orange-50" />
              <div className="mt-2 text-orange-400 text-sm animate-pulse">
                Carregando dados...
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-hidden">{children}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
