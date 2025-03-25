
import { useState, useEffect, useCallback } from 'react';
import { FilterOptions, SGZOrdemServico } from '@/components/ranking/types';
import { supabase } from '@/integrations/supabase/client';

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
  
  // Filter to only include the 4 official districts
  const validDistricts = ['Pinheiros', 'Itaim Bibi', 'Jardim Paulista', 'Alto de Pinheiros'];
  filteredData = filteredData.filter(item => validDistricts.includes(item.sgz_distrito));
  
  // Generate chart data objects
  return {
    // 1. Status Distribution
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
    
    // 2. Resolution Time
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
    
    // 3. Companies with most completed orders
    topCompanies: {
      labels: Array.from(new Set(filteredData
        .filter(item => item.sgz_status === 'Concluído' || item.sgz_status === 'FECHADO')
        .map(item => item.sgz_empresa)))
        .filter(Boolean),
      datasets: [
        {
          label: 'Ordens Concluídas',
          data: Array.from(new Set(filteredData
            .filter(item => item.sgz_status === 'Concluído' || item.sgz_status === 'FECHADO')
            .map(item => item.sgz_empresa)))
            .filter(Boolean)
            .map(company => filteredData
              .filter(item => (item.sgz_status === 'Concluído' || item.sgz_status === 'FECHADO') && item.sgz_empresa === company)
              .length),
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
        },
      ],
    },
    
    // 4. Distribution by District
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
    
    // 5. Services by Technical Department
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
    
    // 6. Services by District
    servicesByDistrict: {
      labels: Array.from(new Set(filteredData.map(item => item.sgz_distrito))),
      datasets: [
        {
          label: 'Serviços',
          data: Array.from(new Set(filteredData.map(item => item.sgz_distrito)))
            .map(district => {
              const districtServices = new Set(
                filteredData
                  .filter(item => item.sgz_distrito === district)
                  .map(item => item.sgz_tipo_servico)
              );
              return districtServices.size;
            }),
          backgroundColor: [
            'rgba(255, 159, 64, 0.7)',   // orange
            'rgba(255, 206, 86, 0.7)',   // yellow
            'rgba(75, 192, 192, 0.7)',   // teal
            'rgba(54, 162, 235, 0.7)',   // blue
          ],
        },
      ],
    },
    
    // 7. Average time comparison by status
    timeComparison: {
      labels: ['Concluído', 'FECHADO', 'Aprovado', 'Em Andamento', 'PREPLAN', 'PRECANC'],
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: [
            // Concluído
            Math.round(filteredData.filter(item => item.sgz_status === 'Concluído')
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => item.sgz_status === 'Concluído').length || 1)),
            // FECHADO
            Math.round(filteredData.filter(item => item.sgz_status === 'FECHADO')
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => item.sgz_status === 'FECHADO').length || 1)),  
            // Aprovado
            Math.round(filteredData.filter(item => item.sgz_status === 'Aprovado')
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => item.sgz_status === 'Aprovado').length || 1)),
            // Em Andamento
            Math.round(filteredData.filter(item => item.sgz_status === 'Em Andamento')
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => item.sgz_status === 'Em Andamento').length || 1)),
            // PREPLAN
            Math.round(filteredData.filter(item => item.sgz_status === 'PREPLAN')
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => item.sgz_status === 'PREPLAN').length || 1)),
            // PRECANC
            Math.round(filteredData.filter(item => item.sgz_status === 'PRECANC')
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => item.sgz_status === 'PRECANC').length || 1)),
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',   // Concluído - green
            'rgba(50, 168, 168, 0.7)',   // FECHADO - darker green
            'rgba(54, 162, 235, 0.7)',   // Aprovado - blue
            'rgba(153, 102, 255, 0.7)',  // Em Andamento - purple
            'rgba(255, 206, 86, 0.7)',   // PREPLAN - yellow
            'rgba(255, 99, 132, 0.7)',   // PRECANC - red
          ],
        },
      ],
    },
    
    // 8. Efficiency impact (excluding third parties)
    efficiencyImpact: {
      labels: ['Com Terceiros', 'Sem Terceiros'],
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: [
            // With all companies
            Math.round(filteredData
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.length || 1)),
            // Excluding third-party companies
            Math.round(filteredData
              .filter(item => !['Zelar Serviços', 'Urbano Engenharia'].includes(item.sgz_empresa || ''))
              .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
              (filteredData.filter(item => !['Zelar Serviços', 'Urbano Engenharia'].includes(item.sgz_empresa || '')).length || 1)),
          ],
          backgroundColor: [
            'rgba(255, 159, 64, 0.7)',  // orange
            'rgba(75, 192, 192, 0.7)',   // teal
          ],
        },
      ],
    },
    
    // 9. Daily volume of new demands
    dailyDemands: {
      labels: Array.from(new Set(filteredData.map(item => {
        const date = new Date(item.sgz_criado_em);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      }))).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('/').map(Number);
        const [dayB, monthB, yearB] = b.split('/').map(Number);
        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
      }),
      datasets: [
        {
          label: 'Novas Ordens',
          data: Array.from(new Set(filteredData.map(item => {
            const date = new Date(item.sgz_criado_em);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          }))).sort((a, b) => {
            const [dayA, monthA, yearA] = a.split('/').map(Number);
            const [dayB, monthB, yearB] = b.split('/').map(Number);
            return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
          }).map(date => 
            filteredData.filter(item => {
              const itemDate = new Date(item.sgz_criado_em);
              return `${itemDate.getDate()}/${itemDate.getMonth() + 1}/${itemDate.getFullYear()}` === date;
            }).length
          ),
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.1,
          fill: true,
        },
      ],
    },
    
    // 10. Neighborhood comparison
    neighborhoodComparison: {
      labels: Array.from(new Set(filteredData.map(item => item.sgz_bairro))).filter(Boolean),
      datasets: [
        {
          label: 'Ordens de Serviço',
          data: Array.from(new Set(filteredData.map(item => item.sgz_bairro)))
            .filter(Boolean)
            .map(neighborhood => filteredData.filter(item => item.sgz_bairro === neighborhood).length),
          backgroundColor: [
            'rgba(255, 159, 64, 0.7)',   // orange
            'rgba(255, 206, 86, 0.7)',   // yellow
            'rgba(75, 192, 192, 0.7)',   // teal
            'rgba(54, 162, 235, 0.7)',   // blue
            'rgba(153, 102, 255, 0.7)',  // purple
          ],
        },
      ],
    },
    
    // 11. Efficiency radar by district
    districtEfficiencyRadar: {
      labels: ['Total de Ordens', 'Tempo Médio (inv)', 'Ordens Concluídas', 'Diversidade de Serviços', 'Empresas Ativas'],
      datasets: Array.from(new Set(filteredData.map(item => item.sgz_distrito)))
        .map(district => {
          const districtData = filteredData.filter(item => item.sgz_distrito === district);
          const avgTime = districtData.reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / (districtData.length || 1);
          // Invert time so lower is better (better visualization for radar chart)
          const invertedTime = 10 - Math.min(avgTime, 10);
          
          return {
            label: district,
            data: [
              districtData.length, // Total orders
              invertedTime, // Inverted avg time (lower time is better)
              districtData.filter(item => item.sgz_status === 'Concluído' || item.sgz_status === 'FECHADO').length, // Completed orders
              new Set(districtData.map(item => item.sgz_tipo_servico)).size, // Service variety
              new Set(districtData.map(item => item.sgz_empresa)).size, // Active companies
            ],
            backgroundColor: district === 'Pinheiros' ? 'rgba(255, 159, 64, 0.2)' :
                           district === 'Itaim Bibi' ? 'rgba(75, 192, 192, 0.2)' :
                           district === 'Alto de Pinheiros' ? 'rgba(54, 162, 235, 0.2)' :
                           'rgba(153, 102, 255, 0.2)',
            borderColor: district === 'Pinheiros' ? 'rgb(255, 159, 64)' :
                       district === 'Itaim Bibi' ? 'rgb(75, 192, 192)' :
                       district === 'Alto de Pinheiros' ? 'rgb(54, 162, 235)' :
                       'rgb(153, 102, 255)',
            borderWidth: 2,
          };
        }),
    },
    
    // 12. Status transition over days (this will be populated from history table in the future)
    statusTransition: {
      labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5'],
      datasets: [
        {
          label: 'PREPLAN',
          data: [0, 1, 1, 1, 1],
          borderColor: 'rgb(255, 206, 86)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          fill: true,
        },
        {
          label: 'PRECANC',
          data: [0, 0, 0, 1, 1],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        },
        {
          label: 'Em Andamento',
          data: [0, 0, 0, 0, 1],
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
        },
        {
          label: 'Aprovado',
          data: [0, 0, 1, 1, 1],
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
        {
          label: 'Concluído',
          data: [1, 1, 1, 1, 1],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
        {
          label: 'FECHADO',
          data: [0, 0, 0, 0, 1],
          borderColor: 'rgb(50, 168, 168)',
          backgroundColor: 'rgba(50, 168, 168, 0.2)',
          fill: true,
        },
      ],
    },
    
    // 13. Critical status analysis
    criticalStatus: {
      labels: ['PREPLAN', 'PRECANC', 'Concluído', 'FECHADO'],
      datasets: [
        {
          label: 'Quantidade',
          data: [
            filteredData.filter(item => item.sgz_status === 'PREPLAN').length,
            filteredData.filter(item => item.sgz_status === 'PRECANC').length,
            filteredData.filter(item => item.sgz_status === 'Concluído').length,
            filteredData.filter(item => item.sgz_status === 'FECHADO').length,
          ],
          backgroundColor: [
            'rgba(255, 206, 86, 0.7)',   // yellow (warning)
            'rgba(255, 99, 132, 0.7)',   // red (danger)
            'rgba(75, 192, 192, 0.7)',   // green (success)
            'rgba(50, 168, 168, 0.7)',   // darker green (final success)
          ],
        },
      ],
    },
    
    // 14. Orders from external districts
    externalDistricts: {
      labels: ['Pinheiros', 'Itaim Bibi', 'Alto de Pinheiros', 'Jardim Paulista', 'Outros'],
      datasets: [
        {
          label: 'Ordens de Serviço',
          data: [
            filteredData.filter(item => item.sgz_distrito === 'Pinheiros').length,
            filteredData.filter(item => item.sgz_distrito === 'Itaim Bibi').length,
            filteredData.filter(item => item.sgz_distrito === 'Alto de Pinheiros').length,
            filteredData.filter(item => item.sgz_distrito === 'Jardim Paulista').length,
            data.filter(item => 
              !['Pinheiros', 'Itaim Bibi', 'Alto de Pinheiros', 'Jardim Paulista'].includes(item.sgz_distrito)
            ).length,
          ],
          backgroundColor: [
            'rgba(255, 159, 64, 0.7)',  // orange (Pinheiros)
            'rgba(75, 192, 192, 0.7)',  // teal (Itaim Bibi)
            'rgba(54, 162, 235, 0.7)',  // blue (Alto de Pinheiros)
            'rgba(153, 102, 255, 0.7)', // purple (Jardim Paulista)
            'rgba(201, 203, 207, 0.7)', // gray (Others)
          ],
          borderWidth: 1,
        },
      ],
    },
    
    // 15. Service diversity by department
    serviceDiversity: {
      labels: ['STM', 'STLP'],
      datasets: [
        {
          label: 'Tipos de Serviço',
          data: [
            new Set(filteredData.filter(item => item.sgz_departamento_tecnico === 'STM')
              .map(item => item.sgz_tipo_servico)).size,
            new Set(filteredData.filter(item => item.sgz_departamento_tecnico === 'STLP')
              .map(item => item.sgz_tipo_servico)).size,
          ],
          backgroundColor: [
            'rgba(255, 159, 64, 0.7)',  // orange (STM)
            'rgba(153, 102, 255, 0.7)', // purple (STLP)
          ],
        },
      ],
    },
    
    // 16. Average time to complete closure
    closureTime: {
      labels: Array.from(new Set(filteredData.map(item => item.sgz_distrito))),
      datasets: [
        {
          label: 'Tempo até fechamento (dias)',
          data: Array.from(new Set(filteredData.map(item => item.sgz_distrito)))
            .map(district => {
              const districtItems = filteredData.filter(item => item.sgz_distrito === district);
              // Compare CONC and FECHADO times
              const avgCompletionTime = districtItems
                .filter(item => item.sgz_status === 'Concluído')
                .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
                (districtItems.filter(item => item.sgz_status === 'Concluído').length || 1);
                
              const avgClosureTime = districtItems
                .filter(item => item.sgz_status === 'FECHADO')
                .reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0) / 
                (districtItems.filter(item => item.sgz_status === 'FECHADO').length || 1);
                
              // Use FECHADO time if available, otherwise estimate from CONC time
              return Math.round(avgClosureTime > 0 ? avgClosureTime : avgCompletionTime * 1.2);
            }),
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
        },
      ],
    },
  };
};

export const useChartData = (filters: FilterOptions) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [ordensData, setOrdensData] = useState<SGZOrdemServico[]>([]);

  const fetchSGZData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch all SGZ data
      const { data, error } = await supabase
        .from('sgz_ordens_servico')
        .select('*')
        .order('sgz_criado_em', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching SGZ data:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch data from Supabase
      const data = await fetchSGZData();
      setOrdensData(data);
      
      // Generate chart data with the fetched data
      const generatedChartData = generateChartData(data, filters);
      setChartData(generatedChartData);
      
      // Set last update time
      setLastUpdate(new Date().toLocaleString('pt-BR'));
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, fetchSGZData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update charts whenever filters change
  useEffect(() => {
    if (ordensData.length > 0) {
      const generatedChartData = generateChartData(ordensData, filters);
      setChartData(generatedChartData);
    }
  }, [filters, ordensData]);

  return {
    chartData,
    isLoading,
    lastUpdate,
    refreshData: loadData
  };
};
