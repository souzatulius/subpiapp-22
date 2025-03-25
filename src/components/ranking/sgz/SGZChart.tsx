
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import NoDataMessage from '../charts/NoDataMessage';

interface SGZChartProps {
  title: string;
  value: string | number;
  isLoading: boolean;
  hasData: boolean;
  children: React.ReactNode;
}

const SGZChart: React.FC<SGZChartProps> = ({
  title,
  value,
  isLoading,
  hasData,
  children
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="text-2xl font-bold">
          {isLoading ? <Skeleton className="h-8 w-24" /> : value}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : !hasData ? (
          <NoDataMessage />
        ) : (
          <div className="h-[200px]">{children}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default SGZChart;
