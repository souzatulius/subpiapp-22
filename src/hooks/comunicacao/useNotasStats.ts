
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NotasStats {
  totalNotas: number;
  totalVariacao: number;
  aguardandoAprovacao: number;
  aguardandoVariacao: number;
  notasRecusadas: number;
  recusadasVariacao: number;
  taxaAprovacao: number;
  aprovacaoVariacao: number;
  isLoading: boolean;
}

export const useNotasStats = () => {
  const [stats, setStats] = useState<NotasStats>({
    totalNotas: 0,
    totalVariacao: 0,
    aguardandoAprovacao: 0,
    aguardandoVariacao: 0,
    notasRecusadas: 0,
    recusadasVariacao: 0,
    taxaAprovacao: 0,
    aprovacaoVariacao: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get current month start
        const today = new Date();
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Get previous month start/end
        const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        
        // Fetch total notas
        const { data: totalNotasData, error: totalNotasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' });
        
        if (totalNotasError) throw totalNotasError;
        const totalNotas = totalNotasData?.[0]?.count || 0;
        
        // Fetch total notas from previous month for variation
        const { data: prevMonthNotasData, error: prevMonthNotasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .gte('created_at', prevMonthStart.toISOString())
          .lte('created_at', prevMonthEnd.toISOString());
        
        if (prevMonthNotasError) throw prevMonthNotasError;
        const prevMonthNotas = prevMonthNotasData?.[0]?.count || 0;
        
        // Calculate variation percentage
        const totalVariacao = prevMonthNotas > 0 
          ? Math.round(((totalNotas - prevMonthNotas) / prevMonthNotas) * 100) 
          : 0;
        
        // Fetch aguardando aprovação
        const { data: aguardandoData, error: aguardandoError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'pendente');
        
        if (aguardandoError) throw aguardandoError;
        const aguardandoAprovacao = aguardandoData?.[0]?.count || 0;
        
        // Fetch aguardando aprovação previous month
        const { data: prevAguardandoData, error: prevAguardandoError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'pendente')
          .gte('created_at', prevMonthStart.toISOString())
          .lte('created_at', prevMonthEnd.toISOString());
        
        if (prevAguardandoError) throw prevAguardandoError;
        const prevAguardando = prevAguardandoData?.[0]?.count || 0;
        
        // Calculate aguardando variation
        const aguardandoVariacao = prevAguardando > 0 
          ? Math.round(((aguardandoAprovacao - prevAguardando) / prevAguardando) * 100) 
          : 0;
        
        // Fetch notas recusadas
        const { data: recusadasData, error: recusadasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'rejeitada');
        
        if (recusadasError) throw recusadasError;
        const notasRecusadas = recusadasData?.[0]?.count || 0;
        
        // Fetch recusadas previous month
        const { data: prevRecusadasData, error: prevRecusadasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'rejeitada')
          .gte('created_at', prevMonthStart.toISOString())
          .lte('created_at', prevMonthEnd.toISOString());
        
        if (prevRecusadasError) throw prevRecusadasError;
        const prevRecusadas = prevRecusadasData?.[0]?.count || 0;
        
        // Calculate recusadas variation
        const recusadasVariacao = prevRecusadas > 0 
          ? Math.round(((notasRecusadas - prevRecusadas) / prevRecusadas) * 100) 
          : 0;
        
        // Calculate taxa de aprovação
        const { data: notasAprovadasData, error: notasAprovadasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'aprovada');
        
        if (notasAprovadasError) throw notasAprovadasError;
        const notasAprovadas = notasAprovadasData?.[0]?.count || 0;
        
        const taxaAprovacao = totalNotas > 0 
          ? Math.round((notasAprovadas / totalNotas) * 100) 
          : 0;
        
        // Fetch previous month approval rate
        const { data: prevNotasAprovadasData, error: prevNotasAprovadasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'aprovada')
          .gte('created_at', prevMonthStart.toISOString())
          .lte('created_at', prevMonthEnd.toISOString());
        
        if (prevNotasAprovadasError) throw prevNotasAprovadasError;
        const prevNotasAprovadas = prevNotasAprovadasData?.[0]?.count || 0;
        
        const prevTaxaAprovacao = prevMonthNotas > 0 
          ? Math.round((prevNotasAprovadas / prevMonthNotas) * 100) 
          : 0;
        
        // Calculate approval rate variation
        const aprovacaoVariacao = prevTaxaAprovacao > 0 
          ? taxaAprovacao - prevTaxaAprovacao 
          : 0;
        
        // Update stats
        setStats({
          totalNotas,
          totalVariacao,
          aguardandoAprovacao,
          aguardandoVariacao,
          notasRecusadas,
          recusadasVariacao,
          taxaAprovacao,
          aprovacaoVariacao,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching notas stats:', error);
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
