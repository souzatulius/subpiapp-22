
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ComunicacaoCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  badgeCount?: number;
  loading?: boolean;
}

const ComunicacaoCard: React.FC<ComunicacaoCardProps> = ({
  title,
  icon,
  children,
  badgeCount,
  loading = false
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && <span className="text-subpi-blue">{icon}</span>}
            <CardTitle className="text-lg font-semibold text-[#003570]">
              {title}
            </CardTitle>
          </div>
          
          {typeof badgeCount !== 'undefined' && (
            <div className="h-6 min-w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-medium px-1.5">
              {loading ? (
                <Skeleton className="h-4 w-4 rounded-full bg-orange-400" />
              ) : (
                badgeCount
              )}
            </div>
          )}
        </div>
      </CardHeader>
      {loading ? (
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        children
      )}
    </Card>
  );
};

export default ComunicacaoCard;
