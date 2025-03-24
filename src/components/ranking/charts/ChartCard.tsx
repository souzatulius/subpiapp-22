
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartCardProps {
  title: string; 
  value: string | number; 
  isLoading: boolean; 
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  value, 
  isLoading, 
  children,
  className
}) => (
  <Card className={`h-full ${className || ""}`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{title}</CardTitle>
      <div className="text-2xl font-bold">
        {isLoading ? <Skeleton className="h-8 w-24" /> : value}
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : (
        <div className="h-[200px]">
          {children}
        </div>
      )}
    </CardContent>
  </Card>
);

export default ChartCard;
