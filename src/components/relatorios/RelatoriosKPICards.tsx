
import React from 'react';
import { StatsCard } from './components/StatsCard';
import { useReportsData } from './hooks/useReportsData';
import ESICProcessesCard from './ESICProcessesCard';

export const RelatoriosKPICards: React.FC = () => {
  const { cardStats: stats, isLoading: isLoadingStats } = useReportsData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Demandas"
        value={stats?.totalDemandas || 0}
        comparison="Últimos 30 dias"
        isLoading={isLoadingStats}
      />
      
      <StatsCard
        title="Respostas enviadas"
        value={stats?.notasAprovadas || 0}
        comparison={`${stats?.taxaAprovacao || 0}% respondidas`}
        isLoading={isLoadingStats}
      />
      
      <StatsCard
        title="Notas emitidas"
        value={stats?.totalNotas || 0}
        comparison="Últimos 30 dias"
        isLoading={isLoadingStats}
      />

      {/* KPI de Processos e-SIC */}
      <ESICProcessesCard loading={isLoadingStats} />
    </div>
  );
};
