
import React from 'react';
import { StatsCard } from './components/StatsCard';
import { useReportsData } from './hooks/useReportsData';
import ESICProcessesCard from './ESICProcessesCard';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const RelatoriosKPICards: React.FC = () => {
  const [esicStats, setEsicStats] = React.useState({
    total: 0,
    responded: 0,
    justified: 0
  });
  const [loadingESIC, setLoadingESIC] = React.useState(true);
  const [kpiStats, setKpiStats] = React.useState({
    totalDemandas: 0,
    demandasSemana: 0,
    demandasMes: 0,
    totalNotas: 0,
    notasSemana: 0,
    notasVariacao: 0,
    totalReleases: 0,
    noticiasPublicadas: 0,
    noticiasVariacao: 0,
    esicTotal: 0,
    esicRespondidos: 0,
    esicPrazo: 0
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

  // Get date ranges for this week and month
  const getDateRanges = () => {
    const today = new Date();
    const startOfWeek = subDays(today, 7);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return {
      weekStart: startOfWeek,
      monthStart: startOfMonth,
      today: today
    };
  };

  const dateRanges = getDateRanges();

  // Format date for display
  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, 'dd/MM', { locale: ptBR })} - ${format(end, 'dd/MM', { locale: ptBR })}`;
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

        // Get demandas from this week
        const { count: demandasSemanaCount } = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true })
          .gte('data_criacao', dateRanges.weekStart.toISOString());

        // Get demandas from this month
        const { count: demandasMesCount } = await supabase
          .from('demandas')
          .select('*', { count: 'exact', head: true })
          .gte('data_criacao', dateRanges.monthStart.toISOString());

        // Get notas count
        const { count: notasCount, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('*', { count: 'exact', head: true });
        
        if (notasError) throw notasError;

        // Get notas from this week
        const { count: notasSemanaCount } = await supabase
          .from('notas_oficiais')
          .select('*', { count: 'exact', head: true })
          .gte('data_criacao', dateRanges.weekStart.toISOString());

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

        // Calculate percentage of notes variation
        const notasVariacao = notasSemanaCount && notasCount 
          ? ((notasSemanaCount / notasCount) * 100) - 100 
          : 0;

        setKpiStats({
          totalDemandas: demandasCount || 0,
          demandasSemana: demandasSemanaCount || 0,
          demandasMes: demandasMesCount || 0,
          totalNotas: notasCount || 0,
          notasSemana: notasSemanaCount || 0,
          notasVariacao: notasVariacao,
          totalReleases: releasesCount || 0,
          noticiasPublicadas: noticiasPublicadasCount || 0,
          noticiasVariacao: displayStats.notasVariacao,
          esicTotal: esicStats.total,
          esicRespondidos: esicStats.responded,
          esicPrazo: esicStats.responded > 0 ? Math.round((esicStats.responded / esicStats.total) * 100) : 0
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
  }, [displayStats.notasVariacao, toast, esicStats]);

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

  const weekRangeText = formatDateRange(dateRanges.weekStart, dateRanges.today);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <StatsCard
          title="Demandas"
          value={kpiStats.demandasSemana}
          comparison={`No mês foram ${kpiStats.demandasMes}`}
          isLoading={loadingKPIs}
          description={`Solicitações recebidas na semana`}
        />
      </div>
      
      <div>
        <StatsCard
          title="Notícias"
          value={kpiStats.noticiasPublicadas}
          comparison={`${kpiStats.totalReleases} releases cadastrados`}
          isLoading={loadingKPIs}
          description="Publicadas no site"
        />
      </div>
      
      <div>
        <StatsCard
          title="Notas de Imprensa"
          value={kpiStats.notasSemana}
          comparison={`${Math.abs(kpiStats.notasVariacao).toFixed(0)}% que semana passada`}
          isLoading={loadingKPIs}
          direction={kpiStats.notasVariacao >= 0 ? 'increase' : 'decrease'}
          description={`Comunicados enviados na semana`}
        />
      </div>

      <div>
        <ESICProcessesCard 
          loading={loadingESIC} 
          total={esicStats.total}
          responded={esicStats.responded}
          justified={esicStats.justified}
          description={`No mês`}
          percentText={`${esicStats.responded > 0 ? Math.round((esicStats.responded / esicStats.total) * 100) : 0}% concluídos no prazo`}
        />
      </div>
    </div>
  );
};
