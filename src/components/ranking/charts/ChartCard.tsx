
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartCardProps {
  title: string; 
  value: string | number; 
  isLoading: boolean; 
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  value, 
  isLoading, 
  children 
}) => (
  <Card className="h-full border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-blue-50 to-blue-100">
    <CardHeader className="pb-2 border-b border-blue-200">
      <div className="flex flex-col">
        <CardTitle className="text-lg text-blue-800">{title}</CardTitle>
        <div className="text-2xl font-bold text-blue-700">
          {isLoading ? <Skeleton className="h-8 w-24" /> : value}
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-4">
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
