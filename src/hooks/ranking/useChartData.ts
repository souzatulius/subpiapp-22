
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
        resolutionTime: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
          datasets: [{
            label: 'Tempo Médio (dias)',
            data: [15, 12, 18, 10, 8],
            borderColor: 'rgba(245, 124, 53, 1)',
            backgroundColor: 'rgba(245, 124, 53, 0.2)',
            fill: true
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
        neighborhoods: {
          labels: ['Pinheiros', 'Jardim Paulista', 'Itaim Bibi', 'Alto de Pinheiros'],
          datasets: [{
            label: 'Bairros',
            data: [40, 30, 20, 10],
            backgroundColor: [
              'rgba(245, 124, 53, 0.8)',
              'rgba(235, 110, 45, 0.8)',
              'rgba(225, 95, 35, 0.8)',
              'rgba(215, 80, 25, 0.8)'
            ]
          }]
        },
        frequentServices: {
          labels: ['Tapa Buraco', 'Poda', 'Limpeza', 'Manutenção', 'Outros'],
          datasets: [{
            label: 'Serviços Frequentes',
            data: [35, 25, 22, 18, 15],
            backgroundColor: 'rgba(245, 124, 53, 0.7)'
          }]
        },
        statusDistribution: {
          labels: ['Novo', 'Em Andamento', 'Concluído', 'Fechado'],
          datasets: [{
            label: 'Status',
            data: [15, 30, 35, 20],
            backgroundColor: [
              'rgba(245, 124, 53, 0.8)',
              'rgba(235, 110, 45, 0.8)',
              'rgba(225, 95, 35, 0.8)',
              'rgba(215, 80, 25, 0.8)'
            ]
          }]
        },
        statusTimeline: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
          datasets: [
            {
              label: 'Novo',
              data: [30, 25, 20, 15, 10],
              backgroundColor: 'rgba(245, 124, 53, 0.5)',
              borderColor: 'rgba(245, 124, 53, 1)',
              fill: true
            },
            {
              label: 'Em Andamento',
              data: [20, 25, 30, 35, 40],
              backgroundColor: 'rgba(225, 95, 35, 0.5)',
              borderColor: 'rgba(225, 95, 35, 1)',
              fill: true
            },
            {
              label: 'Concluído',
              data: [10, 15, 20, 25, 30],
              backgroundColor: 'rgba(215, 80, 25, 0.5)',
              borderColor: 'rgba(215, 80, 25, 1)',
              fill: true
            }
          ]
        }
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
