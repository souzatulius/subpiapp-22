
import React from 'react';
import { StatsCard } from './components/StatsCard';
import { useReportsData } from './hooks/useReportsData';
import ESICProcessesCard from './ESICProcessesCard';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const RelatoriosKPICards: React.FC = () => {
  const [esicStats, setEsicStats] = React.useState({
    total: 0,
    responded: 0,
    justified: 0
  });
  const [loadingESIC, setLoadingESIC] = React.useState(true);
  const [kpiStats, setKpiStats] = React.useState({
    totalDemandas: 0,
    totalNotas: 0,
    totalReleases: 0,
    noticiasPublicadas: 0,
    demandasVariacao: 0,
    notasVariacao: 0,
    releasesVariacao: 0,
  });
  const [loadingKPIs, setLoadingKPIs] = React.useState(true);
  const { toast } = useToast();

  // Get report data with default filters
  const { cardStats: stats, isLoading: isLoadingStats } = useReportsData({
    dateRange: {
      from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      to: new Date()
    }
  });

  // Use default fallback values when data is not available
  const defaultStats = {
    totalDemandas: 0,
    notasAprovadas: 0,
    taxaAprovacao: 0,
    demandasVariacao: 0,
    notasVariacao: 0,
    tempoMedioResposta: 0,
    tempoRespostaVariacao: 0,
    totalNotas: 0,
    notasEditadas: 0
  };

  // Merge with defaults to ensure we always have values
  const displayStats = {
    ...defaultStats,
    ...(stats || {})
  };

  // Fetch KPI stats directly from Supabase
  React.useEffect(() => {
    const fetchKPIStats = async () => {
      setLoadingKPIs(true);
      try {
        // Get demandas count
        const { count: demandasCount, error: demandasError } = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true });
        
        if (demandasError) throw demandasError;

        // Get notas count
        const { count: notasCount, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('*', { count: 'exact', head: true });
        
        if (notasError) throw notasError;

        // Get releases count
        const { count: releasesCount, error: releasesError } = await supabase
          .from('releases')
          .select('*', { count: 'exact', head: true });
        
        if (releasesError) throw releasesError;

        // Get published releases/news count
        const { count: noticiasPublicadasCount, error: noticiasError } = await supabase
          .from('releases')
          .select('*', { count: 'exact', head: true })
          .eq('publicada', true);
        
        if (noticiasError) throw noticiasError;

        setKpiStats({
          totalDemandas: demandasCount || 0,
          totalNotas: notasCount || 0,
          totalReleases: releasesCount || 0,
          noticiasPublicadas: noticiasPublicadasCount || 0,
          demandasVariacao: displayStats.demandasVariacao,
          notasVariacao: displayStats.notasVariacao,
          releasesVariacao: 0, // We don't have this data yet, using 0 as default
        });
      } catch (error) {
        console.error('Error fetching KPI stats:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar todos os dados dos KPIs.",
          variant: "destructive"
        });
      } finally {
        setLoadingKPIs(false);
      }
    };
    
    fetchKPIStats();
  }, [displayStats.demandasVariacao, displayStats.notasVariacao, toast]);

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
        value={kpiStats.totalDemandas}
        comparison={`Últimos 30 dias: ${Math.abs(displayStats.demandasVariacao || 0)}% ${displayStats.demandasVariacao >= 0 ? '↑' : '↓'}`}
        isLoading={loadingKPIs}
        description="Total de solicitações recebidas"
      />
      
      <StatsCard
        title="Notícias e Releases"
        value={kpiStats.noticiasPublicadas}
        comparison={`${kpiStats.totalReleases} no total`}
        isLoading={loadingKPIs}
        description="Notícias publicadas oficialmente"
      />
      
      <StatsCard
        title="Notas emitidas"
        value={kpiStats.totalNotas}
        comparison={`${Math.abs(displayStats.notasVariacao || 0)}% ${displayStats.notasVariacao >= 0 ? 'mais' : 'menos'} que período anterior`}
        isLoading={loadingKPIs}
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
