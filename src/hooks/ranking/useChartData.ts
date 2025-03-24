
import { useState, useEffect } from 'react';
import { FilterOptions } from '@/components/ranking/types';
import { toast } from 'sonner';

export const useChartData = (filters: FilterOptions) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to fetch and generate chart data based on filters
  const fetchChartData = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, you would fetch data from your backend
      // For now, we'll just simulate some delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate some placeholder data for charts
      const placeholderData = {
        occurrences: {
          labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
          datasets: [{
            label: 'Ocorrências',
            data: [65, 59, 80, 81, 56],
            backgroundColor: 'rgba(245, 124, 53, 0.6)'
          }]
        },
        serviceTypes: {
          labels: ['Tapa Buraco', 'Poda', 'Limpeza', 'Manutenção'],
          datasets: [{
            label: 'Tipos de Serviço',
            data: [30, 25, 20, 15],
            backgroundColor: [
              'rgba(245, 124, 53, 0.8)',
              'rgba(235, 110, 45, 0.8)',
              'rgba(225, 95, 35, 0.8)',
              'rgba(215, 80, 25, 0.8)'
            ]
          }]
        },
        // Add more placeholder data for other charts
      };
      
      setChartData(placeholderData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      toast.error('Erro ao carregar dados para os gráficos');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh the chart data
  const refreshChartData = () => {
    fetchChartData();
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchChartData();
  }, [filters]);

  return {
    chartData,
    isLoading,
    refreshChartData
  };
};
