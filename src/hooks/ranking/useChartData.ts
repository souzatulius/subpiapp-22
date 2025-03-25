
import { useState, useEffect } from 'react';
import { FilterOptions } from '@/components/ranking/types';

// Sample data for demonstration purposes
const generateSampleChartData = () => {
  return {
    occurrences: {
      labels: ['Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'],
      datasets: [
        {
          label: 'Número de Ocorrências',
          data: [320, 280, 190, 250],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    },
    serviceTypes: {
      labels: ['Tapa Buraco', 'Poda', 'Limpeza', 'Manutenção'],
      datasets: [
        {
          label: 'Pinheiros',
          data: [150, 120, 200, 80],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Outros Distritos',
          data: [200, 150, 300, 120],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    },
    resolutionTime: {
      labels: ['Geral', 'Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'],
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: [12, 10, 15, 8, 14],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
      ],
    },
    neighborhoods: {
      labels: ['Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'],
      datasets: [
        {
          label: 'Ocorrências',
          data: [320, 280, 190, 250],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
          ],
          borderWidth: 1,
        },
      ],
    },
    frequentServices: {
      labels: ['Tapa Buraco', 'Poda', 'Limpeza', 'Manutenção', 'Iluminação'],
      datasets: [
        {
          label: 'Itaim Bibi',
          data: [65, 45, 30, 25, 20],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Pinheiros',
          data: [55, 50, 40, 30, 15],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Alto de Pinheiros',
          data: [40, 30, 35, 20, 10],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        },
        {
          label: 'Jardim Paulista',
          data: [60, 40, 25, 35, 25],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    },
    statusDistribution: {
      labels: ['Planejar', 'Novo', 'Aprovado', 'Em execução', 'Concluído'],
      datasets: [
        {
          label: 'Geral',
          data: [15, 25, 20, 10, 30],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Pinheiros',
          data: [10, 20, 25, 15, 30],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    },
  };
};

export const useChartData = (filters: FilterOptions) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data based on filters
    const loadData = async () => {
      setIsLoading(true);
      
      // In a real application, this would be an API call with the filters
      // For now, we'll just use the sample data
      setTimeout(() => {
        setChartData(generateSampleChartData());
        setIsLoading(false);
      }, 300);
    };

    loadData();
  }, [filters]);

  return {
    chartData,
    isLoading
  };
};
