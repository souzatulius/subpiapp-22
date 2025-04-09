
import React from 'react';
import { StatsCard } from './components/StatsCard';
import { useReportsData } from './hooks/useReportsData';
import ESICProcessesCard from './ESICProcessesCard';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const RelatoriosKPICards: React.FC = () => {
  const [esicStats, setEsicStats] = React.useState({
    total: 0,
    responded: 0,
    justified: 0
  });
  const [loadingESIC, setLoadingESIC] = React.useState(true);

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

  // Fetch ESIC stats
  React.useEffect(() => {
    const fetchESICStats = async () => {
      setLoadingESIC(true);
      try {
        // Get total count
        const { count: total } = await supabase
          .from('esic_processos')
          .select('*', { count: 'exact', head: true });
        
        // Get responded count
        const { count: responded } = await supabase
          .from('esic_processos')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'concluido');
        
        // Get justified count
        const { count: justified } = await supabase
          .from('esic_justificativas')
          .select('*', { count: 'exact', head: true });
        
        setEsicStats({
          total: total || 0,
          responded: responded || 0,
          justified: justified || 0
        });
      } catch (error) {
        console.error('Error fetching ESIC stats:', error);
      } finally {
        setLoadingESIC(false);
      }
    };
    
    fetchESICStats();
  }, []);

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
      <ESICProcessesCard 
        loading={loadingESIC} 
        total={esicStats.total}
        responded={esicStats.responded}
        justified={esicStats.justified}
      />
    </div>
  );
};
