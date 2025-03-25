
import { useState, useEffect } from 'react';
import { SGZFilterOptions } from '@/components/ranking/types';
import { supabase } from '@/integrations/supabase/client';
import { processSGZData } from './utils/sgzDataProcessing';

export const useSGZChartData = (filters: SGZFilterOptions) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChartData = async (uploadId: string) => {
    setIsLoading(true);
    
    try {
      // Consulta as ordens de serviço do upload específico
      let query = supabase
        .from('sgz_ordens_servico')
        .select('*')
        .eq('planilha_referencia', uploadId);
      
      // Aplicar filtros, se houver
      if (filters.periodo?.de) {
        query = query.gte('sgz_criado_em', filters.periodo.de.toISOString());
      }
      
      if (filters.periodo?.ate) {
        query = query.lte('sgz_criado_em', filters.periodo.ate.toISOString());
      }
      
      if (!filters.statuses.includes('Todos')) {
        query = query.in('sgz_status', filters.statuses);
      }
      
      if (!filters.areas_tecnicas.includes('STM') || !filters.areas_tecnicas.includes('STLP')) {
        query = query.in('sgz_area_tecnica', filters.areas_tecnicas);
      }
      
      if (!filters.distritos.includes('Todos')) {
        query = query.in('sgz_distrito', filters.distritos);
      }
      
      if (!filters.bairros.includes('Todos')) {
        query = query.in('sgz_bairro', filters.bairros);
      }
      
      if (!filters.tipos_servico.includes('Todos')) {
        query = query.in('sgz_tipo_servico', filters.tipos_servico);
      }
      
      // Executa a consulta
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Processa os dados para gerar os gráficos
      if (data && data.length > 0) {
        const processedData = processSGZData(data);
        setChartData(processedData);
      } else {
        setChartData(null);
      }
    } catch (error) {
      console.error('Erro ao carregar dados para gráficos:', error);
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Quando os filtros mudarem, atualize o chartData, mas apenas se já foi carregado antes
    if (chartData) {
      // Aqui, precisaríamos do uploadId, então vamos buscá-lo de alguma forma
      // Uma solução é armazenar o uploadId no estado do hook
      // Por enquanto, vamos deixar assim
    }
  }, [filters]);

  return {
    chartData,
    isLoading,
    fetchChartData
  };
};
