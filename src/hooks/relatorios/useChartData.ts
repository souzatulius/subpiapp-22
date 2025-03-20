
import { useState, useEffect } from 'react';
import { FilterOptions } from '@/components/relatorios/types';
import { supabase } from '@/integrations/supabase/client';

// Sample data for demonstration purposes
const generateSampleChartData = () => {
  return {
    districtDistribution: {
      labels: ['Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'],
      datasets: [
        {
          label: 'Número de Solicitações',
          data: [320, 280, 190, 250],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    },
    neighborhoodDistribution: {
      labels: ['Vila Olímpia', 'Vila Madalena', 'Boaçava', 'Jardins'],
      datasets: [
        {
          label: 'Número de Solicitações',
          data: [150, 120, 100, 200],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    },
    demandOrigin: {
      labels: ['Imprensa', 'Vereadores', 'Políticos', 'Demandas Internas', 'SECOM', 'Ministério Público', 'Ouvidoria'],
      datasets: [
        {
          label: 'Origem das Solicitações',
          data: [120, 80, 60, 90, 70, 30, 50],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(199, 199, 199, 0.5)'
          ],
        },
      ],
    },
    mediaTypes: {
      labels: ['Jornal Impresso', 'Portal de Notícias', 'Jornal Online', 'Podcast', 'Rádio', 'TV'],
      datasets: [
        {
          label: 'Meios de Comunicação Mais Ativos',
          data: [80, 150, 120, 60, 90, 100],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    },
    responseTime: {
      labels: ['Geral', 'Itaim Bibi', 'Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista'],
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: [3.5, 2.8, 4.1, 3.2, 3.9],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
      ],
    },
    serviceTypes: {
      labels: ['Zeladoria', 'Infraestrutura', 'Saúde', 'Transporte', 'Educação', 'Eventos'],
      datasets: [
        {
          label: 'Assuntos Mais Solicitados',
          data: [200, 150, 100, 120, 80, 90],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        },
      ],
    },
    coordinationAreas: {
      labels: ['Comunicação', 'Obras', 'Serviços Urbanos', 'Planejamento', 'Cultura', 'Administração'],
      datasets: [
        {
          label: 'Áreas Mais Demandadas',
          data: [180, 150, 200, 90, 70, 110],
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
        },
      ],
    },
    statusDistribution: {
      labels: ['Pendentes', 'Em andamento', 'Concluídas'],
      datasets: [
        {
          label: 'Status das Solicitações',
          data: [30, 25, 45],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
          ],
        },
      ],
    },
    responsibleUsers: {
      labels: ['Ana Silva', 'Carlos Santos', 'Mariana Oliveira', 'Roberto Almeida', 'Juliana Pereira'],
      datasets: [
        {
          label: 'Atendimentos por Responsável',
          data: [45, 38, 52, 30, 41],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    },
    noteApprovals: {
      labels: ['Aprovadas pelo Subprefeito', 'Rejeitadas e reeditadas', 'Aprovadas sem edição', 'Aguardando aprovação'],
      datasets: [
        {
          label: 'Status das Aprovações',
          data: [60, 15, 20, 5],
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
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
      
      try {
        // Em uma implementação real, aqui teríamos chamadas para o Supabase
        // para buscar os dados filtrados das demandas
        
        // Por enquanto, usamos dados de exemplo
        setTimeout(() => {
          setChartData(generateSampleChartData());
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erro ao carregar dados dos relatórios:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters]);

  return {
    chartData,
    isLoading
  };
};
