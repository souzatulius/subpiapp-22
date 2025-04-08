
import React from 'react';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { CardColor, DataSourceKey } from '@/types/dashboard';
import { getColorClasses, getTextColorClass } from './utils/cardColorUtils';

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

  // Use utility function to get color classes
  const colorClasses = getColorClasses(color);
  const textColorClass = getTextColorClass(color);

  console.log(`DynamicDataCard: ${title} - dataSourceKey: ${dataSourceKey}, loading: ${loading}, data:`, data);

  return (
    <div 
      className={`w-full h-full rounded-md ${shadowClass} transition-all hover:shadow-lg ${borderClass} flex flex-col ${colorClasses}`}
    >
      <div className="flex items-center gap-2 p-4 pb-2">
        <div className={textColorClass}>{icon}</div>
        <h4 className={`text-md font-semibold ${textColorClass}`}>{title}</h4>
      </div>
      
      <div className="flex-1 flex items-center p-4 pt-0">
        {loading ? (
          <Skeleton className="h-7 w-24 bg-white/30" />
        ) : (
          <p className={`text-2xl font-bold ${textColorClass}`}>
            {Array.isArray(data) ? valueFormatter(data?.length ?? 0) : valueFormatter(0)}
          </p>
        )}
      </div>
    </div>
  );
};

export default DynamicDataCard;
