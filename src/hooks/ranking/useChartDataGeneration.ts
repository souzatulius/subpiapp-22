import { useState } from 'react';
import { OS156Item, OS156ChartData } from '@/components/ranking/types';

export const useChartDataGeneration = () => {
  const [chartData, setChartData] = useState<OS156ChartData | null>(null);

  const generateChartData = (data: OS156Item[]) => {
    if (!data || data.length === 0) {
      setChartData(null);
      return;
    }

    // Generate chart data based on the OS data
    
    // Status Distribution
    const statusCounts: Record<string, number> = {};
    data.forEach(item => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });

    const statusLabels = Object.keys(statusCounts);
    const statusData = statusLabels.map(label => statusCounts[label]);
    
    // Highlight critical statuses (CONC, PREPLAN, PRECANC)
    const criticalStatuses = ['CONC', 'PREPLAN', 'PRECANC'];
    const backgroundColors = statusLabels.map(label => 
      criticalStatuses.includes(label) 
        ? 'rgba(245, 124, 53, 0.9)'  // Bright orange for critical
        : `rgba(${245 - statusLabels.indexOf(label) * 15}, ${124 - statusLabels.indexOf(label) * 10}, 53, 0.8)`  // Varying orange shades
    );
    
    const statusDistribution = {
      labels: statusLabels,
      datasets: [
        {
          label: 'Distribuição por Status',
          data: statusData,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }
      ]
    };

    // Average Time by Status
    const statusTimes: Record<string, number[]> = {};
    data.forEach(item => {
      if (!statusTimes[item.status]) statusTimes[item.status] = [];
      statusTimes[item.status].push(item.tempo_aberto);
    });

    const avgTimeByStatus = Object.keys(statusTimes).map(status => ({
      status,
      avg: statusTimes[status].reduce((sum, time) => sum + time, 0) / statusTimes[status].length
    })).sort((a, b) => b.avg - a.avg); // Sort by highest average time

    const averageTimeByStatus = {
      labels: avgTimeByStatus.map(item => item.status),
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: avgTimeByStatus.map(item => item.avg),
          backgroundColor: avgTimeByStatus.map((item, index) => 
            criticalStatuses.includes(item.status)
              ? 'rgba(245, 124, 53, 0.9)'
              : `rgba(${245 - index * 20}, ${124 - index * 15}, 53, 0.8)`
          ),
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };

    // Companies with most completed (but not closed) orders
    const companies: Record<string, { total: number, completed: number }> = {};
    data.forEach(item => {
      if (!item.empresa) return;
      
      if (!companies[item.empresa]) {
        companies[item.empresa] = { total: 0, completed: 0 };
      }
      
      companies[item.empresa].total += 1;
      if (item.status === 'CONC') {
        companies[item.empresa].completed += 1;
      }
    });

    const companiesData = Object.entries(companies)
      .map(([name, stats]) => ({ name, completed: stats.completed }))
      .filter(item => item.completed > 0)
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 10);

    const companiesPerformance = {
      labels: companiesData.map(item => item.name),
      datasets: [
        {
          label: 'Obras Concluídas (Não Fechadas)',
          data: companiesData.map(item => item.completed),
          backgroundColor: 'rgba(245, 124, 53, 0.8)',
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };

    // Services by technical area (STM vs STLP)
    const areaServices: Record<string, Record<string, number>> = {
      STM: {},
      STLP: {}
    };

    data.forEach(item => {
      if (item.area_tecnica) {
        if (!areaServices[item.area_tecnica][item.tipo_servico]) {
          areaServices[item.area_tecnica][item.tipo_servico] = 0;
        }
        areaServices[item.area_tecnica][item.tipo_servico] += 1;
      }
    });

    const stmServices = Object.entries(areaServices.STM)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stlpServices = Object.entries(areaServices.STLP)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Combine services from both areas, keeping unique services
    const allServices = [...new Set([...stmServices.map(s => s.service), ...stlpServices.map(s => s.service)])];

    const servicesByTechnicalArea = {
      labels: allServices,
      datasets: [
        {
          label: 'STM',
          data: allServices.map(service => {
            const found = stmServices.find(s => s.service === service);
            return found ? found.count : 0;
          }),
          backgroundColor: 'rgba(100, 149, 237, 0.8)',  // Blue for STM
          borderColor: 'rgba(100, 149, 237, 1)',
          borderWidth: 1
        },
        {
          label: 'STLP',
          data: allServices.map(service => {
            const found = stlpServices.find(s => s.service === service);
            return found ? found.count : 0;
          }),
          backgroundColor: 'rgba(245, 124, 53, 0.8)',  // Orange for STLP
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };

    // Services by district
    const validDistricts = ['PINHEIROS', 'ALTO DE PINHEIROS', 'JARDIM PAULISTA', 'ITAIM BIBI'];
    const districtServices: Record<string, number> = {};
    
    data.forEach(item => {
      let district = item.distrito;
      
      // Group non-valid districts as "EXTERNO"
      if (!validDistricts.includes(district)) {
        district = 'EXTERNO';
      }
      
      districtServices[district] = (districtServices[district] || 0) + 1;
    });

    const servicesByDistrict = {
      labels: Object.keys(districtServices),
      datasets: [
        {
          label: 'Serviços por Distrito',
          data: Object.values(districtServices),
          backgroundColor: [
            'rgba(245, 124, 53, 0.8)',  // Pinheiros - Orange
            'rgba(100, 149, 237, 0.8)',  // Alto de Pinheiros - Blue
            'rgba(60, 179, 113, 0.8)',   // Jardim Paulista - Green
            'rgba(147, 112, 219, 0.8)',  // Itaim Bibi - Purple
            'rgba(128, 128, 128, 0.8)'   // External - Gray
          ],
          borderWidth: 1
        }
      ]
    };

    // Time to Completion vs Time to Close
    // This is a simulation since we don't have real "FECHADO" data
    // We'll estimate based on average time orders spend in "CONC" status before disappearing
    const avgTimeToCompletion = data
      .filter(item => item.status === 'CONC')
      .reduce((sum, item) => sum + item.tempo_aberto, 0) / 
      (data.filter(item => item.status === 'CONC').length || 1);
    
    // Estimate time to close (usually 10-15 days longer than completion)
    // This is a simulation - in a real scenario, we'd track orders that disappear
    const estimatedTimeToClose = avgTimeToCompletion + 12; // 12 days added as simulation
    
    const timeToCompletion = {
      labels: ['Até Concluído', 'Até Fechado (estimado)'],
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: [avgTimeToCompletion, estimatedTimeToClose],
          backgroundColor: [
            'rgba(245, 124, 53, 0.8)',
            'rgba(128, 128, 128, 0.8)'
          ],
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };
    
    // Efficiency score
    // Calculate basic efficiency metrics
    const validServices = data.filter(item => validDistricts.includes(item.distrito));
    const externalServices = data.filter(item => !validDistricts.includes(item.distrito));
    
    const validCompletionRate = validServices.filter(item => item.status === 'CONC').length / validServices.length;
    const allCompletionRate = data.filter(item => item.status === 'CONC').length / data.length;
    
    const efficiencyScore = {
      labels: ['Apenas Distritos Válidos', 'Todos os Serviços'],
      datasets: [
        {
          label: 'Pontuação de Eficiência',
          data: [validCompletionRate * 100, allCompletionRate * 100],
          backgroundColor: [
            'rgba(245, 124, 53, 0.8)',
            'rgba(128, 128, 128, 0.8)'
          ],
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };
    
    // Daily new orders - simulate from data
    // Group by date to see daily volumes
    const ordersByDate: Record<string, number> = {};
    data.forEach(item => {
      if (!item.data_criacao) return;
      
      const date = new Date(item.data_criacao).toISOString().split('T')[0];
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    });
    
    const sortedDates = Object.keys(ordersByDate).sort();
    
    const dailyNewOrders = {
      labels: sortedDates,
      datasets: [
        {
          label: 'Novas Ordens',
          data: sortedDates.map(date => ordersByDate[date]),
          backgroundColor: 'rgba(245, 124, 53, 0.2)',
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
    
    // Services diversity by district
    const serviceTypesByDistrict: Record<string, Set<string>> = {};
    validDistricts.forEach(district => {
      serviceTypesByDistrict[district] = new Set();
    });
    serviceTypesByDistrict['EXTERNO'] = new Set();
    
    data.forEach(item => {
      let district = item.distrito;
      if (!validDistricts.includes(district)) {
        district = 'EXTERNO';
      }
      
      if (item.tipo_servico) {
        serviceTypesByDistrict[district].add(item.tipo_servico);
      }
    });
    
    const servicesDiversity = {
      labels: Object.keys(serviceTypesByDistrict),
      datasets: [
        {
          label: 'Quantidade de Serviços',
          data: Object.keys(serviceTypesByDistrict).map(district => 
            districtServices[district] || 0
          ),
          backgroundColor: 'rgba(245, 124, 53, 0.8)',
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Diversidade de Serviços',
          data: Object.values(serviceTypesByDistrict).map(set => set.size),
          backgroundColor: 'rgba(128, 128, 128, 0.8)',
          borderColor: 'rgba(128, 128, 128, 1)',
          borderWidth: 1,
          type: 'line',
          yAxisID: 'y1'
        }
      ]
    };
    
    // Status Timeline - simulate status changes over time
    // This would ideally use historical data, but we'll simulate
    const statusDates = sortedDates.slice(0, Math.min(sortedDates.length, 7)); // Use up to 7 days
    const statusTimeline = {
      labels: statusDates,
      datasets: [
        {
          label: 'NOVO',
          data: statusDates.map(() => Math.floor(Math.random() * 30 + 5)),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: true,
          stack: 'stack1'
        },
        {
          label: 'AB',
          data: statusDates.map(() => Math.floor(Math.random() * 20 + 10)),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: true,
          stack: 'stack1'
        },
        {
          label: 'PE',
          data: statusDates.map(() => Math.floor(Math.random() * 15 + 5)),
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
          borderColor: 'rgba(255, 206, 86, 1)',
          fill: true,
          stack: 'stack1'
        },
        {
          label: 'CONC',
          data: statusDates.map(() => Math.floor(Math.random() * 25 + 15)),
          backgroundColor: 'rgba(245, 124, 53, 0.8)',
          borderColor: 'rgba(245, 124, 53, 1)',
          fill: true,
          stack: 'stack1'
        },
        {
          label: 'PREPLAN',
          data: statusDates.map(() => Math.floor(Math.random() * 8 + 2)),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: true,
          stack: 'stack1'
        }
      ]
    };
    
    // Status Transition (Sankey-like visualization)
    // This would be a specialized visualization, for mock data:
    const statusTransition = {
      nodes: [
        { id: 'NOVO', name: 'NOVO' },
        { id: 'AB', name: 'AB' },
        { id: 'PE', name: 'PE' },
        { id: 'CONC', name: 'CONC' },
        { id: 'PREPLAN', name: 'PREPLAN' },
        { id: 'PRECANC', name: 'PRECANC' },
        { id: 'FECHADO', name: 'FECHADO' }
      ],
      links: [
        { source: 'NOVO', target: 'AB', value: 80 },
        { source: 'NOVO', target: 'PREPLAN', value: 20 },
        { source: 'AB', target: 'PE', value: 60 },
        { source: 'AB', target: 'PRECANC', value: 10 },
        { source: 'PE', target: 'CONC', value: 55 },
        { source: 'CONC', target: 'FECHADO', value: 40 },
        { source: 'PREPLAN', target: 'AB', value: 15 },
        { source: 'PRECANC', target: 'FECHADO', value: 5 }
      ]
    };
    
    // Efficiency Radar by Technical Area
    const efficiencyRadar = {
      labels: ['Tempo Médio', 'Volume Atendido', 'Taxa de Finalização', 'Diversidade', 'Sem Problemas'],
      datasets: [
        {
          label: 'STM',
          data: [
            // Normalized scores from 0-100 for each metric
            Math.min(100, 100 - (avgTimeByArea('STM') / 30) * 100), // Lower is better for time
            Math.min(100, (countByArea('STM') / data.length) * 200),
            Math.min(100, (completionRateByArea('STM') * 100)),
            Math.min(100, (serviceTypesByArea('STM').size / 10) * 100),
            Math.min(100, 100 - (problemRateByArea('STM') * 100))
          ],
          fill: true,
          backgroundColor: 'rgba(100, 149, 237, 0.2)',
          borderColor: 'rgba(100, 149, 237, 0.8)',
          pointBackgroundColor: 'rgba(100, 149, 237, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(100, 149, 237, 1)'
        },
        {
          label: 'STLP',
          data: [
            Math.min(100, 100 - (avgTimeByArea('STLP') / 30) * 100),
            Math.min(100, (countByArea('STLP') / data.length) * 200),
            Math.min(100, (completionRateByArea('STLP') * 100)),
            Math.min(100, (serviceTypesByArea('STLP').size / 10) * 100),
            Math.min(100, 100 - (problemRateByArea('STLP') * 100))
          ],
          fill: true,
          backgroundColor: 'rgba(245, 124, 53, 0.2)',
          borderColor: 'rgba(245, 124, 53, 0.8)',
          pointBackgroundColor: 'rgba(245, 124, 53, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(245, 124, 53, 1)'
        }
      ]
    };
    
    // Helper functions for radar chart
    function avgTimeByArea(area: string): number {
      const orders = data.filter(item => item.area_tecnica === area);
      return orders.reduce((sum, item) => sum + item.tempo_aberto, 0) / (orders.length || 1);
    }
    
    function countByArea(area: string): number {
      return data.filter(item => item.area_tecnica === area).length;
    }
    
    function completionRateByArea(area: string): number {
      const orders = data.filter(item => item.area_tecnica === area);
      return orders.filter(item => item.status === 'CONC').length / (orders.length || 1);
    }
    
    function serviceTypesByArea(area: string): Set<string> {
      const types = new Set<string>();
      data.filter(item => item.area_tecnica === area)
          .forEach(item => types.add(item.tipo_servico));
      return types;
    }
    
    function problemRateByArea(area: string): number {
      const orders = data.filter(item => item.area_tecnica === area);
      return orders.filter(item => ['PREPLAN', 'PRECANC'].includes(item.status)).length / (orders.length || 1);
    }
    
    // Critical Status Analysis (PREPLAN and PRECANC)
    const criticalStatusAnalysis = {
      labels: ['PREPLAN', 'PRECANC'],
      datasets: [
        {
          label: 'Quantidade',
          data: [
            data.filter(item => item.status === 'PREPLAN').length,
            data.filter(item => item.status === 'PRECANC').length
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        },
        {
          label: 'Tempo Médio Parado (dias)',
          data: [
            data.filter(item => item.status === 'PREPLAN')
                .reduce((sum, item) => sum + item.tempo_aberto, 0) / 
                (data.filter(item => item.status === 'PREPLAN').length || 1),
            data.filter(item => item.status === 'PRECANC')
                .reduce((sum, item) => sum + item.tempo_aberto, 0) / 
                (data.filter(item => item.status === 'PRECANC').length || 1)
          ],
          backgroundColor: [
            'rgba(128, 128, 128, 0.8)',
            'rgba(128, 128, 128, 0.8)'
          ],
          borderColor: [
            'rgba(128, 128, 128, 1)',
            'rgba(128, 128, 128, 1)'
          ],
          borderWidth: 1,
          type: 'line',
          yAxisID: 'y1'
        }
      ]
    };
    
    // External Districts Analysis
    const externalOrders = data.filter(item => !validDistricts.includes(item.distrito));
    const externalStatusCounts: Record<string, number> = {};
    
    externalOrders.forEach(item => {
      externalStatusCounts[item.status] = (externalStatusCounts[item.status] || 0) + 1;
    });
    
    const externalStatusLabels = Object.keys(externalStatusCounts);
    
    const externalDistrictsAnalysis = {
      labels: externalStatusLabels,
      datasets: [
        {
          label: 'Ordens de Distritos Externos',
          data: externalStatusLabels.map(status => externalStatusCounts[status]),
          backgroundColor: externalStatusLabels.map(status => 
            criticalStatuses.includes(status) 
              ? 'rgba(245, 124, 53, 0.9)'
              : 'rgba(128, 128, 128, 0.8)'
          ),
          borderWidth: 1
        }
      ]
    };
    
    // Time to Close Analysis
    const timeToClose = {
      labels: ['Em andamento', 'Concluído mas não fechado', 'Fechado (estimado)'],
      datasets: [
        {
          label: 'Quantidade',
          data: [
            data.filter(item => !['CONC', 'FECHADO'].includes(item.status)).length,
            data.filter(item => item.status === 'CONC').length,
            Math.round(data.length * 0.3) // Estimated closed orders (simulation)
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(245, 124, 53, 0.8)',
            'rgba(128, 128, 128, 0.8)'
          ],
          borderWidth: 1
        }
      ]
    };

    // Build complete chart data object
    setChartData({
      statusDistribution,
      averageTimeByStatus,
      companiesPerformance,
      servicesByTechnicalArea,
      servicesByDistrict,
      timeToCompletion,
      efficiencyScore,
      dailyNewOrders,
      servicesDiversity,
      statusTimeline,
      statusTransition,
      efficiencyRadar,
      criticalStatusAnalysis,
      externalDistrictsAnalysis,
      timeToClose
    });
  };

  return {
    chartData,
    generateChartData
  };
};

