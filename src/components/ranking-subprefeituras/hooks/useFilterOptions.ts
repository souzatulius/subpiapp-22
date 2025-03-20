
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch and manage filter options from the database
 */
export const useFilterOptions = () => {
  const [distritos, setDistritos] = useState<string[]>([]);
  const [bairros, setBairros] = useState<string[]>([]);
  const [classificacoes, setClassificacoes] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoading(true);
      try {
        // Fetch unique districts
        const { data: distritosData } = await supabase
          .from('ordens_servico')
          .select('distrito')
          .not('distrito', 'is', null)
          .order('distrito');
          
        if (distritosData) {
          const uniqueDistritos = [...new Set(distritosData.map(d => d.distrito))];
          setDistritos(uniqueDistritos.filter(Boolean) as string[]);
        }
        
        // Fetch unique neighborhoods
        const { data: bairrosData } = await supabase
          .from('ordens_servico')
          .select('bairro')
          .not('bairro', 'is', null)
          .order('bairro');
          
        if (bairrosData) {
          const uniqueBairros = [...new Set(bairrosData.map(b => b.bairro))];
          setBairros(uniqueBairros.filter(Boolean) as string[]);
        }
        
        // Fetch unique classifications
        const { data: classificacoesData } = await supabase
          .from('ordens_servico')
          .select('classificacao')
          .not('classificacao', 'is', null)
          .order('classificacao');
          
        if (classificacoesData) {
          const uniqueClassificacoes = [...new Set(classificacoesData.map(c => c.classificacao))];
          setClassificacoes(uniqueClassificacoes.filter(Boolean) as string[]);
        }
        
        // Fetch unique statuses
        const { data: statusData } = await supabase
          .from('ordens_servico')
          .select('status')
          .not('status', 'is', null)
          .order('status');
          
        if (statusData) {
          const uniqueStatus = [...new Set(statusData.map(s => s.status))];
          setStatusOptions(uniqueStatus.filter(Boolean) as string[]);
        }
      } catch (error) {
        console.error('Erro ao carregar opções de filtro:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  return {
    distritos,
    bairros,
    classificacoes,
    statusOptions,
    loading
  };
};
