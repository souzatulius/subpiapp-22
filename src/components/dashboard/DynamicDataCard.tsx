
import React from 'react';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';

interface DynamicDataCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  dataSourceKey: string;
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
    dataSourceKey as any,
    coordenacaoId,
    usuarioId
  );
  
  const borderClass = highlight ? 'border-2 border-orange-500' : 'border border-gray-200';
  const shadowClass = highlight ? 'shadow-lg' : 'shadow-md';

  return (
    <div 
      className={`rounded-md ${shadowClass} p-4 transition-all hover:shadow-lg ${borderClass}`} 
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="text-white">{icon}</div>
        <h4 className="text-md font-semibold text-white">{title}</h4>
      </div>
      
      {loading ? (
        <div className="mt-2">
          <Skeleton className="h-6 w-24 bg-white/30" />
        </div>
      ) : (
        <p className="text-xl font-bold text-white">
          {valueFormatter(data?.length ?? 0)}
        </p>
      )}
    </div>
  );
};

export default DynamicDataCard;
