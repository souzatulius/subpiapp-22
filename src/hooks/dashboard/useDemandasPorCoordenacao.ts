
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';

export interface ChartDataItem {
  name: string;
  valor: number;
  color: string;
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', 
  '#14B8A6', '#6366F1', '#D946EF', '#F97316'
];

export const useDemandasPorCoordenacao = () => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch the origins data with demand counts
      const { data, error: fetchError } = await supabase
        .from('origens_demandas')
        .select(`
          id,
          descricao,
          demandas:demandas!origem_id(count)
        `)
        .order('descricao', { ascending: true });
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (data && data.length > 0) {
        // Transform the data for chart display
        const transformedData = data.map((item, index) => ({
          name: item.descricao,
          valor: item.demandas?.length || 0,
          color: COLORS[index % COLORS.length]
        }));
        
        setChartData(transformedData);
      } else {
        // No data, use fallback
        setChartData([
          { name: 'Imprensa', valor: 45, color: '#3B82F6' },
          { name: 'Atendimento', valor: 32, color: '#10B981' },
          { name: 'Portal', valor: 27, color: '#F59E0B' },
          { name: 'e-SIC', valor: 18, color: '#EF4444' },
          { name: 'Telefone', valor: 12, color: '#8B5CF6' }
        ]);
      }
    } catch (err: any) {
      console.error('Error fetching demandas por coordenacao:', err);
      setError(err.message || 'Erro ao carregar dados');
      
      // Set fallback data
      setChartData([
        { name: 'Imprensa', valor: 45, color: '#3B82F6' },
        { name: 'Atendimento', valor: 32, color: '#10B981' },
        { name: 'Portal', valor: 27, color: '#F59E0B' },
        { name: 'e-SIC', valor: 18, color: '#EF4444' },
        { name: 'Telefone', valor: 12, color: '#8B5CF6' }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchData]);
  
  // Function to manually refresh the data
  const refresh = () => {
    fetchData();
  };
  
  return {
    chartData,
    isLoading,
    error,
    refresh
  };
};
