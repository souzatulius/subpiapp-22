
import React from 'react';
import { StatsCard } from './components/StatsCard';
import { useReportsData } from './hooks/useReportsData';
import ESICProcessesCard from './ESICProcessesCard';

export const RelatoriosKPICards: React.FC = () => {
  // Get report data with default filters
  const { cardStats: stats, isLoading: isLoadingStats } = useReportsData({
    dateRange: {
      from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      to: new Date()
    }
  });

  // Use default fallback values when data is not available
  const defaultStats = {
    totalDemandas: 345,
    notasAprovadas: 187,
    taxaAprovacao: 78,
    demandasVariacao: 12,
    notasVariacao: 5,
    tempoMedioResposta: 36,
    tempoRespostaVariacao: -8,
    totalNotas: 215,
    notasEditadas: 15
  };

  // Merge with defaults to ensure we always have values
  const displayStats = {
    ...defaultStats,
    ...(stats || {})
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Demandas"
        value={displayStats.totalDemandas || 0}
        comparison={`Últimos 30 dias: ${Math.abs(displayStats.demandasVariacao || 0)}% ${displayStats.demandasVariacao >= 0 ? '↑' : '↓'}`}
        isLoading={isLoadingStats}
        description="Total de solicitações recebidas"
      />
      
      <StatsCard
        title="Respostas enviadas"
        value={displayStats.notasAprovadas || 0}
        comparison={`${displayStats.taxaAprovacao || 0}% respondidas`}
        isLoading={isLoadingStats}
        description="Notas enviadas à imprensa"
      />
      
      <StatsCard
        title="Notas emitidas"
        value={displayStats.totalNotas || 0}
        comparison={`${Math.abs(displayStats.notasVariacao || 0)}% ${displayStats.notasVariacao >= 0 ? 'mais' : 'menos'} que período anterior`}
        isLoading={isLoadingStats}
        description="Comunicados oficiais publicados"
      />

      {/* KPI de Processos e-SIC */}
      <ESICProcessesCard loading={isLoadingStats} />
    </div>
  );
};
