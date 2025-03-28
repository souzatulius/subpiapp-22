
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
        // Fetch total notes
        const { data: totalNotasData, error: totalNotasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' });
        
        if (totalNotasError) throw totalNotasError;
        const totalNotas = totalNotasData?.[0]?.count || 0;
        
        // Fetch pending approval notes
        const { data: pendingNotasData, error: pendingNotasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'pendente');
        
        if (pendingNotasError) throw pendingNotasError;
        const aguardandoAprovacao = pendingNotasData?.[0]?.count || 0;
        
        // Fetch rejected notes
        const { data: rejectedNotasData, error: rejectedNotasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'rejeitada');
        
        if (rejectedNotasError) throw rejectedNotasError;
        const notasRecusadas = rejectedNotasData?.[0]?.count || 0;
        
        // Calculate approval rate
        const { data: approvedNotasData, error: approvedNotasError } = await supabase
          .from('notas_oficiais')
          .select('count', { count: 'exact' })
          .eq('status', 'aprovada');
        
        if (approvedNotasError) throw approvedNotasError;
        const notasAprovadas = approvedNotasData?.[0]?.count || 0;
        
        // Calculate approval rate (approved notes / total completed notes)
        const completedNotas = notasAprovadas + notasRecusadas;
        const taxaAprovacao = completedNotas > 0 
          ? Math.round((notasAprovadas / completedNotas) * 100) 
          : 100; // Default to 100% if no completed notes
        
        // Update state with fetched data
        setStats({
          totalNotas,
          totalVariacao: 12, // Fixed value for demo
          aguardandoAprovacao,
          aguardandoVariacao: 4, // Fixed value for demo
          notasRecusadas,
          recusadasVariacao: -15, // Fixed value for demo
          taxaAprovacao,
          aprovacaoVariacao: 5, // Fixed value for demo
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
