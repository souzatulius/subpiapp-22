
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ComunicacaoStats {
  totalDemandas: number;
  demandasVariacao: number;
  aguardandoRespostas: number;
  aguardandoVariacao: number;
  tempoMedioResposta: number;
  tempoRespostaVariacao: number;
  taxaAprovacao: number;
  aprovacaoVariacao: number;
  isLoading: boolean;
}

export const useComunicacaoStats = () => {
  const [stats, setStats] = useState<ComunicacaoStats>({
    totalDemandas: 0,
    demandasVariacao: 0,
    aguardandoRespostas: 0,
    aguardandoVariacao: 0,
    tempoMedioResposta: 0,
    tempoRespostaVariacao: 0,
    taxaAprovacao: 0,
    aprovacaoVariacao: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total demands
        const { data: totalDemandasData, error: totalDemandasError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' });
        
        if (totalDemandasError) throw totalDemandasError;
        const totalDemandas = totalDemandasData?.[0]?.count || 0;
        
        // Fetch pending responses
        const { data: aguardandoRespostasData, error: aguardandoRespostasError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' })
          .eq('status', 'pendente');
        
        if (aguardandoRespostasError) throw aguardandoRespostasError;
        const aguardandoRespostas = aguardandoRespostasData?.[0]?.count || 0;
        
        // Fetch response time (this would typically come from a more complex query)
        // For now, we'll calculate it based on the available data
        const { data: respostaTimeData, error: respostaTimeError } = await supabase
          .from('demandas')
          .select('criado_em, atualizado_em')
          .eq('status', 'respondido')
          .limit(50);
        
        let tempoMedioResposta = 0;
        if (!respostaTimeError && respostaTimeData && respostaTimeData.length > 0) {
          const totalDias = respostaTimeData.reduce((acc, item) => {
            const criado = new Date(item.criado_em);
            const atualizado = new Date(item.atualizado_em);
            const dias = (atualizado.getTime() - criado.getTime()) / (1000 * 3600 * 24);
            return acc + dias;
          }, 0);
          tempoMedioResposta = parseFloat((totalDias / respostaTimeData.length).toFixed(1));
        }
        
        // Fetch approval rate for notes
        const { data: notasData, error: notasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' });
        
        if (notasError) throw notasError;
        const totalNotas = notasData?.[0]?.count || 0;
        
        const { data: notasAprovadasData, error: notasAprovadasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'aprovada');
        
        if (notasAprovadasError) throw notasAprovadasError;
        const notasAprovadas = notasAprovadasData?.[0]?.count || 0;
        
        const taxaAprovacao = totalNotas > 0 ? Math.round((notasAprovadas / totalNotas) * 100) : 0;
        
        // Update the stats state
        setStats({
          totalDemandas,
          demandasVariacao: 12, // We don't have historical data for variation, so using a fixed value
          aguardandoRespostas,
          aguardandoVariacao: 4, // Fixed value for demo
          tempoMedioResposta,
          tempoRespostaVariacao: -15, // Fixed value for demo
          taxaAprovacao,
          aprovacaoVariacao: 5, // Fixed value for demo
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching communication stats:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
    
    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return stats;
};
