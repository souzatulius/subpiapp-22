
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
        // Get today's date at 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get yesterday's date at 00:00:00
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Fetch demandas created today
        const { data: totalDemandasHojeData, error: totalDemandasHojeError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' })
          .gte('horario_publicacao', today.toISOString());
        
        if (totalDemandasHojeError) throw totalDemandasHojeError;
        const totalDemandasHoje = totalDemandasHojeData?.[0]?.count || 0;
        
        // Fetch demandas created yesterday
        const { data: totalDemandasOntemData, error: totalDemandasOntemError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' })
          .gte('horario_publicacao', yesterday.toISOString())
          .lt('horario_publicacao', today.toISOString());
        
        if (totalDemandasOntemError) throw totalDemandasOntemError;
        const totalDemandasOntem = totalDemandasOntemData?.[0]?.count || 0;
        
        // Calculate variation
        const demandasVariacao = totalDemandasOntem > 0 
          ? Math.round(((totalDemandasHoje - totalDemandasOntem) / totalDemandasOntem) * 100)
          : 0;
        
        // Fetch pending responses
        const { data: aguardandoRespostasData, error: aguardandoRespostasError } = await supabase
          .from('demandas')
          .select('count', { count: 'exact' })
          .eq('status', 'pendente');
        
        if (aguardandoRespostasError) throw aguardandoRespostasError;
        const aguardandoRespostas = aguardandoRespostasData?.[0]?.count || 0;
        
        // For variation in pending responses, we'll need historical data
        // For now, we'll use a fixed sample value
        const aguardandoVariacao = 4;
        
        // Fetch response time (using horario_publicacao and atualizado_em)
        const { data: respostaTimeData, error: respostaTimeError } = await supabase
          .from('demandas')
          .select('horario_publicacao, atualizado_em')
          .eq('status', 'respondido')
          .order('horario_publicacao', { ascending: false })
          .limit(50);
        
        let tempoMedioResposta = 0;
        if (!respostaTimeError && respostaTimeData && respostaTimeData.length > 0) {
          const totalHoras = respostaTimeData.reduce((acc, item) => {
            const criado = new Date(item.horario_publicacao);
            const atualizado = new Date(item.atualizado_em);
            const horas = (atualizado.getTime() - criado.getTime()) / (1000 * 3600);
            return acc + horas;
          }, 0);
          tempoMedioResposta = parseFloat((totalHoras / respostaTimeData.length).toFixed(1));
        }
        
        // For variation in response time, we'll need historical data
        // For now, we'll use a fixed sample value
        const tempoRespostaVariacao = -15;
        
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
        
        // For variation in approval rate, we'll need historical data
        // For now, we'll use a fixed sample value
        const aprovacaoVariacao = 5;
        
        // Update the stats state
        setStats({
          totalDemandas: totalDemandasHoje,
          demandasVariacao,
          aguardandoRespostas,
          aguardandoVariacao,
          tempoMedioResposta,
          tempoRespostaVariacao,
          taxaAprovacao,
          aprovacaoVariacao,
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
