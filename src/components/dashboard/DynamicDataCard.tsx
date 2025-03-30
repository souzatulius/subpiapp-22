
import React from 'react';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { CardColor, DataSourceKey } from '@/types/dashboard';

interface DynamicDataCardProps {
  title: string;
  icon: React.ReactNode;
  color: CardColor;
  dataSourceKey: DataSourceKey;
  coordenacaoId: string;
  usuarioId: string;
  highlight?: boolean;
  valueFormatter?: (value: number) => string;
}

const DynamicDataCard: React.FC<DynamicDataCardProps> = ({
  title,
  icon,
  color,
  dataSourceKey,
  coordenacaoId,
  usuarioId,
  highlight = false,
  valueFormatter = (value) => `${value} itens`
}) => {
  const { data, loading } = useDashboardData(
    dataSourceKey,
    coordenacaoId,
    usuarioId
  );
  
  const borderClass = highlight ? 'border-2 border-orange-500' : 'border border-gray-200';
  const shadowClass = highlight ? 'shadow-lg' : 'shadow-md';

  // Get the background color based on the color prop
  const getBgColor = (): string => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'orange': return 'bg-orange-500';
      case 'gray-light': return 'bg-gray-200';
      case 'gray-dark': return 'bg-gray-700';
      case 'blue-dark': return 'bg-blue-700';
      case 'orange-light': return 'bg-orange-300';
      case 'gray-ultra-light': return 'bg-gray-100';
      case 'lime': return 'bg-lime-500';
      case 'orange-600': return 'bg-orange-600';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div 
      className={`w-full h-full rounded-md ${shadowClass} transition-all hover:shadow-lg ${borderClass} flex flex-col`}
      style={{ backgroundColor: getBgColor() }}
    >
      <div className="flex items-center gap-2 p-4 pb-2">
        <div className="text-white">{icon}</div>
        <h4 className="text-md font-semibold text-white">{title}</h4>
      </div>
      
      <div className="flex-1 flex items-center p-4 pt-0">
        {loading ? (
          <Skeleton className="h-7 w-24 bg-white/30" />
        ) : (
          <p className="text-2xl font-bold text-white">
            {valueFormatter(data?.length ?? 0)}
          </p>
        )}
      </div>
    </div>
  );
};

export default DynamicDataCard;
