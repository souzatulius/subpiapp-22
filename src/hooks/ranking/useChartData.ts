
import { useState, useEffect } from 'react';
import { FilterOptions } from '@/components/ranking/types';
import { supabase } from '@/integrations/supabase/client';

type SGZOrdemServico = {
  id: string;
  ordem_servico: string;
  sgz_status: string;
  sgz_departamento_tecnico: "STM" | "STLP";
  sgz_bairro: string;
  sgz_distrito: string;
  sgz_tipo_servico: string;
  sgz_empresa: string;
  sgz_criado_em: string;
  sgz_modificado_em: string;
  sgz_dias_ate_status_atual?: number;
}

// Sample data for testing the implementation
const sampleSGZData: SGZOrdemServico[] = [
  {
    id: '1',
    ordem_servico: 'OS-1001',
    sgz_departamento_tecnico: 'STM',
    sgz_status: 'Concluído',
    sgz_distrito: 'Pinheiros',
    sgz_bairro: 'Cerqueira César',
    sgz_criado_em: '2025-03-01T00:00:00Z',
    sgz_modificado_em: '2025-03-05T00:00:00Z',
    sgz_empresa: 'Zelar Serviços',
    sgz_tipo_servico: 'Tapa-buraco',
    sgz_dias_ate_status_atual: 4
  },
  {
    id: '2',
    ordem_servico: 'OS-1002',
    sgz_departamento_tecnico: 'STLP',
    sgz_status: 'PREPLAN',
    sgz_distrito: 'Itaim Bibi',
    sgz_bairro: 'Vila Olímpia',
    sgz_criado_em: '2025-03-02T00:00:00Z',
    sgz_modificado_em: '2025-03-06T00:00:00Z',
    sgz_empresa: 'Urbano Engenharia',
    sgz_tipo_servico: 'Poda de árvore',
    sgz_dias_ate_status_atual: 4
  },
  {
    id: '3',
    ordem_servico: 'OS-1003',
    sgz_departamento_tecnico: 'STM',
    sgz_status: 'Aprovado',
    sgz_distrito: 'Jardim Paulista',
    sgz_bairro: 'Jardins',
    sgz_criado_em: '2025-03-03T00:00:00Z',
    sgz_modificado_em: '2025-03-07T00:00:00Z',
    sgz_empresa: 'Infra SP',
    sgz_tipo_servico: 'Recapeamento',
    sgz_dias_ate_status_atual: 4
  },
  {
    id: '4',
    ordem_servico: 'OS-1004',
    sgz_departamento_tecnico: 'STLP',
    sgz_status: 'PRECANC',
    sgz_distrito: 'Alto de Pinheiros',
    sgz_bairro: 'Alto da Lapa',
    sgz_criado_em: '2025-03-04T00:00:00Z',
    sgz_modificado_em: '2025-03-08T00:00:00Z',
    sgz_empresa: 'Zelar Serviços',
    sgz_tipo_servico: 'Limpeza de boca de lobo',
    sgz_dias_ate_status_atual: 4
  },
  {
    id: '5',
    ordem_servico: 'OS-1005',
    sgz_departamento_tecnico: 'STM',
    sgz_status: 'Em Andamento',
    sgz_distrito: 'Pinheiros',
    sgz_bairro: 'Pinheiros',
    sgz_criado_em: '2025-03-05T00:00:00Z',
    sgz_modificado_em: '2025-03-09T00:00:00Z',
    sgz_empresa: 'Urbano Engenharia',
    sgz_tipo_servico: 'Manutenção de calçada',
    sgz_dias_ate_status_atual: 4
  }
];

// Helper functions for chart data generation
const generateChartData = (data: SGZOrdemServico[], filters: FilterOptions) => {
  // Filter data based on filters
  let filteredData = [...data];
  
  // Apply date range filter if set
  if (filters.dateRange?.from && filters.dateRange?.to) {
    const fromDate = new Date(filters.dateRange.from);
    const toDate = new Date(filters.dateRange.to);
    filteredData = filteredData.filter(item => {
      const itemDate = new Date(item.sgz_criado_em);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }
  
  // Apply status filters if not "Todos"
  if (!filters.statuses.includes('Todos')) {
    filteredData = filteredData.filter(item => 
      filters.statuses.includes(item.sgz_status as any)
    );
  }
  
  // Apply district filters if not "Todos"
  if (!filters.districts.includes('Todos')) {
    filteredData = filteredData.filter(item => 
      filters.districts.includes(item.sgz_distrito as any)
    );
  }
  
  // Apply service type filters if not "Todos"
  if (!filters.serviceTypes.includes('Todos')) {
    filteredData = filteredData.filter(item => 
      filters.serviceTypes.some(type => item.sgz_tipo_servico.includes(type))
    );
  }
  
  // Generate chart data objects
  return {
    // Chart 1: Status Distribution
    statusDistribution: {
      labels: Array.from(new Set(filteredData.map(item => item.sgz_status))),
      datasets: [
        {
          label: 'Status',
          data: Array.from(new Set(filteredData.map(item => item.sgz_status)))
            .map(status => filteredData.filter(item => item.sgz_status === status).length),
          backgroundColor: [
            'rgba(255, 159, 64, 0.7)',   // orange
            'rgba(255, 206, 86, 0.7)',   // yellow
            'rgba(75, 192, 192, 0.7)',   // teal
            'rgba(54, 162, 235, 0.7)',   // blue
            'rgba(153, 102, 255, 0.7)',  // purple
          ],
          borderWidth: 1,
        },
      ],
    },
    
    // Chart 2: Resolution Time
    resolutionTime: {
      labels: ['Geral', 'Pinheiros', 'Itaim Bibi', 'Alto de Pinheiros', 'Jardim Paulista'],
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: [
            // Average time for all districts
            Math.round(filteredData.reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.length || 1)),
            // Average time for Pinheiros
            Math.round(filteredData.filter(item => item.sgz_distrito === 'Pinheiros')
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => item.sgz_distrito === 'Pinheiros').length || 1)),
            // Average time for Itaim Bibi
            Math.round(filteredData.filter(item => item.sgz_distrito === 'Itaim Bibi')
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => item.sgz_distrito === 'Itaim Bibi').length || 1)),
            // Average time for Alto de Pinheiros
            Math.round(filteredData.filter(item => item.sgz_distrito === 'Alto de Pinheiros')
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => item.sgz_distrito === 'Alto de Pinheiros').length || 1)),
            // Average time for Jardim Paulista
            Math.round(filteredData.filter(item => item.sgz_distrito === 'Jardim Paulista')
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => item.sgz_distrito === 'Jardim Paulista').length || 1)),
          ],
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.1
        },
      ],
    },
    
    // Chart 3: Companies with most completed orders
    topCompanies: {
      labels: Array.from(new Set(filteredData
        .filter(item => item.sgz_status === 'Concluído')
        .map(item => item.sgz_empresa)))
        .filter(Boolean),
      datasets: [
        {
          label: 'Ordens Concluídas',
          data: Array.from(new Set(filteredData
            .filter(item => item.sgz_status === 'Concluído')
            .map(item => item.sgz_empresa)))
            .filter(Boolean)
            .map(company => filteredData
              .filter(item => item.sgz_status === 'Concluído' && item.sgz_empresa === company)
              .length),
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
        },
      ],
    },
    
    // Chart 4: Distribution by District
    districtDistribution: {
      labels: Array.from(new Set(filteredData.map(item => item.sgz_distrito))),
      datasets: [
        {
          label: 'Ordens de Serviço',
          data: Array.from(new Set(filteredData.map(item => item.sgz_distrito)))
            .map(district => filteredData.filter(item => item.sgz_distrito === district).length),
          backgroundColor: [
            'rgba(255, 159, 64, 0.7)',   // orange
            'rgba(255, 206, 86, 0.7)',   // yellow
            'rgba(75, 192, 192, 0.7)',   // teal
            'rgba(54, 162, 235, 0.7)',   // blue
          ],
        },
      ],
    },
    
    // Chart 5: Services by Technical Department
    servicesByDepartment: {
      labels: Array.from(new Set(filteredData.map(item => item.sgz_tipo_servico))),
      datasets: [
        {
          label: 'STM',
          data: Array.from(new Set(filteredData.map(item => item.sgz_tipo_servico)))
            .map(service => filteredData.filter(item => 
              item.sgz_tipo_servico === service && item.sgz_departamento_tecnico === 'STM'
            ).length),
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
        },
        {
          label: 'STLP',
          data: Array.from(new Set(filteredData.map(item => item.sgz_tipo_servico)))
            .map(service => filteredData.filter(item => 
              item.sgz_tipo_servico === service && item.sgz_departamento_tecnico === 'STLP'
            ).length),
          backgroundColor: 'rgba(153, 102, 255, 0.7)',
        },
      ],
    },
    
    // Chart 6: Critical Status Analysis
    criticalStatus: {
      labels: ['PREPLAN', 'PRECANC', 'Concluído'],
      datasets: [
        {
          label: 'Quantidade',
          data: [
            filteredData.filter(item => item.sgz_status === 'PREPLAN').length,
            filteredData.filter(item => item.sgz_status === 'PRECANC').length,
            filteredData.filter(item => item.sgz_status === 'Concluído').length,
          ],
          backgroundColor: [
            'rgba(255, 206, 86, 0.7)',   // yellow (warning)
            'rgba(255, 99, 132, 0.7)',   // red (danger)
            'rgba(75, 192, 192, 0.7)',   // green (success)
          ],
        },
      ],
    },
  };
};

export const useChartData = (filters: FilterOptions) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading data based on filters
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // In a production environment, this would fetch data from Supabase
        // For now, we'll use the sample data
        
        // Simulate a delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use the sample data to generate chart data
        const data = generateChartData(sampleSGZData, filters);
        setChartData(data);
        
        // Set last update time
        setLastUpdate(new Date().toLocaleString('pt-BR'));
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters]);

  return {
    chartData,
    isLoading,
    lastUpdate
  };
};
