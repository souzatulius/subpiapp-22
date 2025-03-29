import React from 'react';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';

interface DynamicDataCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  dataSourceKey: string;
  coordenacaoId: string;
  usuarioId: string;
}

const DynamicDataCard: React.FC<DynamicDataCardProps> = ({
  title,
  icon,
  color,
  dataSourceKey,
  coordenacaoId,
  usuarioId
}) => {
  const { data, loading } = useDashboardData(
    dataSourceKey as any,
    coordenacaoId,
    usuarioId
  );

  return (
    <div className={`rounded-md shadow-md p-4 text-white`} style={{ backgroundColor: color }}>
      <div className="flex items-center gap-2 mb-2">
        <div>{icon}</div>
        <h4 className="text-md font-semibold">{title}</h4>
      </div>
      {loading ? (
        <p className="text-sm">Carregando...</p>
      ) : (
        <p className="text-sm">{data?.length ?? 0} itens</p>
      )}
    </div>
  );
};

export default DynamicDataCard;
