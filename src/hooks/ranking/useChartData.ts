
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOfflineStorage } from '../useOfflineStorage';
import { FilterOptions } from '@/components/ranking/types';

export const useChartData = (filters: FilterOptions) => {
  const [chartData, setChartData] = useState<any>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [chartLoadingProgress, setChartLoadingProgress] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [ordensCount, setOrdensCount] = useState(0);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      setChartLoadingProgress(10);

      console.log('Fetching chart data with filters:', filters);
      
      // Construir a consulta básica
      let query = supabase
        .from('sgz_ordens_servico')
        .select('*');
      
      // Aplicar filtros
      if (filters.dataInicio && filters.dataFim) {
        const startDate = new Date(filters.dataInicio);
        const endDate = new Date(filters.dataFim);
        
        // Ajustar a data final para incluir todo o dia
        endDate.setHours(23, 59, 59, 999);
        
        query = query
          .gte('sgz_criado_em', startDate.toISOString())
          .lte('sgz_criado_em', endDate.toISOString());
      }
      
      if (filters.distritos && filters.distritos.length > 0) {
        query = query.in('sgz_distrito', filters.distritos);
      }
      
      if (filters.tiposServico && filters.tiposServico.length > 0) {
        query = query.in('sgz_tipo_servico', filters.tiposServico);
      }
      
      if (filters.status && filters.status.length > 0) {
        query = query.in('sgz_status', filters.status);
      }
      
      // Executar a consulta
      setChartLoadingProgress(30);
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        // Create empty chart data structure with empty arrays to prevent "map of undefined" errors
        const emptyChartData = {
          occurrences: {
            labels: [],
            datasets: [{
              label: 'Ordens de Serviço por Distrito',
              data: [],
              backgroundColor: []
            }]
          },
          status: {
            labels: [],
            datasets: [{
              label: 'Distribuição por Status',
              data: [],
              backgroundColor: []
            }]
          },
          services: {
            labels: [],
            datasets: [{
              label: 'Tipos de Serviço',
              data: [],
              backgroundColor: '#36A2EB'
            }]
          },
          resolutionTime: {
            labels: [],
            datasets: [{
              label: 'Tempo Médio de Resolução (dias)',
              data: [],
              backgroundColor: '#FFCE56'
            }]
          }
        };
        
        setChartData(emptyChartData);
        setRawData([]);
        setIsLoading(false);
        setLastUpdate(new Date());
        setChartLoadingProgress(0);
        setOrdensCount(0);
        return;
      }
      
      setRawData(data);
      setOrdensCount(data.length);
      setChartLoadingProgress(50);
      
      console.log(`Fetched ${data.length} orders for chart data`);
      
      // Processar dados para os gráficos
      const processedData = processChartData(data);
      setChartLoadingProgress(80);
      
      setChartData({
        ...processedData,
        rawData: data
      });
      
      setLastUpdate(new Date());
    } catch (error: any) {
      console.error('Error fetching chart data:', error);
      setFetchError(error.message || 'Erro ao carregar dados dos gráficos');
      
      // Create empty chart data structure with empty arrays to prevent "map of undefined" errors
      const emptyChartData = {
        occurrences: {
          labels: [],
          datasets: [{
            label: 'Ordens de Serviço por Distrito',
            data: [],
            backgroundColor: []
          }]
        },
        status: {
          labels: [],
          datasets: [{
            label: 'Distribuição por Status',
            data: [],
            backgroundColor: []
          }]
        },
        services: {
          labels: [],
          datasets: [{
            label: 'Tipos de Serviço',
            data: [],
            backgroundColor: '#36A2EB'
          }]
        },
        resolutionTime: {
          labels: [],
          datasets: [{
            label: 'Tempo Médio de Resolução (dias)',
            data: [],
            backgroundColor: '#FFCE56'
          }]
        }
      };
      
      setChartData(emptyChartData);
      setRawData([]);
    } finally {
      setIsLoading(false);
      setChartLoadingProgress(100);
      // Resetar a barra de progresso depois de um momento
      setTimeout(() => setChartLoadingProgress(0), 500);
    }
  }, [filters]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    chartData,
    rawData,
    isLoading,
    lastUpdate,
    chartLoadingProgress,
    fetchError,
    refreshData,
    ordensCount
  };
};

// Função auxiliar para processar os dados para os gráficos
function processChartData(data: any[]) {
  // Aqui você implementaria a lógica para preparar os dados para todos os gráficos
  // Vamos criar um exemplo simples
  
  // Contar ocorrências por distrito
  const districtCounts = {};
  const statusCounts = {};
  const serviceCounts = {};
  const timeByDistrict = {};
  const districtCount = {};
  
  data.forEach(item => {
    const district = item.sgz_distrito || 'Não informado';
    const status = item.sgz_status || 'Não informado';
    const service = item.sgz_tipo_servico || 'Não informado';
    const resolTime = item.sgz_dias_ate_status_atual || 0;
    
    // Para ocorrências por distrito
    districtCounts[district] = (districtCounts[district] || 0) + 1;
    
    // Para distribuição de status
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    
    // Para tipos de serviço
    serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    
    // Para tempo médio por distrito
    if (!timeByDistrict[district]) {
      timeByDistrict[district] = 0;
      districtCount[district] = 0;
    }
    timeByDistrict[district] += resolTime;
    districtCount[district]++;
  });
  
  // Calcular média de tempo por distrito
  const avgTimeByDistrict = {};
  Object.keys(timeByDistrict).forEach(district => {
    avgTimeByDistrict[district] = timeByDistrict[district] / districtCount[district];
  });
  
  // Formatar dados para Chart.js
  return {
    occurrences: {
      labels: Object.keys(districtCounts),
      datasets: [{
        label: 'Ordens de Serviço por Distrito',
        data: Object.values(districtCounts),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#C9CBCF', '#7BC225', '#F87979', '#5D8AA8', '#E32636', '#89CFF0'
        ]
      }]
    },
    status: {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'Distribuição por Status',
        data: Object.values(statusCounts),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ]
      }]
    },
    services: {
      labels: Object.keys(serviceCounts).slice(0, 10), // Limitar a 10 tipos
      datasets: [{
        label: 'Tipos de Serviço',
        data: Object.values(serviceCounts).slice(0, 10),
        backgroundColor: '#36A2EB'
      }]
    },
    resolutionTime: {
      labels: Object.keys(avgTimeByDistrict),
      datasets: [{
        label: 'Tempo Médio de Resolução (dias)',
        data: Object.values(avgTimeByDistrict),
        backgroundColor: '#FFCE56'
      }]
    }
  };
}
