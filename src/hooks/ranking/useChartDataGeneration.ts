
import { useState } from 'react';
import { OS156Item, OS156ChartData } from '@/components/ranking/types';

export const useChartDataGeneration = () => {
  const [chartData, setChartData] = useState<OS156ChartData | null>(null);

  const generateChartData = (data: OS156Item[]) => {
    // Generate chart data based on the OS data
    // This is where we would implement the logic for each chart

    // Sample implementation for statusDistribution
    const statusCounts: Record<string, number> = {};
    data.forEach(item => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });

    // Convert to Chart.js format
    const statusLabels = Object.keys(statusCounts);
    const statusData = statusLabels.map(label => statusCounts[label]);
    
    const statusDistribution = {
      labels: statusLabels,
      datasets: [
        {
          label: 'Distribuição por Status',
          data: statusData,
          backgroundColor: [
            'rgba(245, 124, 53, 0.8)',  // Orange
            'rgba(54, 162, 235, 0.8)',  // Blue
            'rgba(255, 206, 86, 0.8)',  // Yellow
            'rgba(75, 192, 192, 0.8)',  // Green
            'rgba(153, 102, 255, 0.8)', // Purple
            'rgba(255, 159, 64, 0.8)',  // Orange
            'rgba(199, 199, 199, 0.8)', // Grey
          ],
          borderWidth: 1
        }
      ]
    };

    // Calculate average time by status
    const statusTimes: Record<string, number[]> = {};
    data.forEach(item => {
      if (!statusTimes[item.status]) statusTimes[item.status] = [];
      statusTimes[item.status].push(item.tempo_aberto);
    });

    const avgTimeByStatus = Object.keys(statusTimes).map(status => ({
      status,
      avg: statusTimes[status].reduce((sum, time) => sum + time, 0) / statusTimes[status].length
    }));

    const averageTimeByStatus = {
      labels: avgTimeByStatus.map(item => item.status),
      datasets: [
        {
          label: 'Tempo Médio (dias)',
          data: avgTimeByStatus.map(item => item.avg),
          backgroundColor: 'rgba(245, 124, 53, 0.8)',
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };

    // Companies performance
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
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 10);

    const companiesPerformance = {
      labels: companiesData.map(item => item.name),
      datasets: [
        {
          label: 'Obras Concluídas',
          data: companiesData.map(item => item.completed),
          backgroundColor: 'rgba(245, 124, 53, 0.8)',
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };

    // Services by technical area
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

    const servicesByTechnicalArea = {
      labels: [...new Set([...stmServices.map(s => s.service), ...stlpServices.map(s => s.service)])],
      datasets: [
        {
          label: 'STM',
          data: stmServices.map(s => s.count),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'STLP',
          data: stlpServices.map(s => s.count),
          backgroundColor: 'rgba(245, 124, 53, 0.8)',
          borderColor: 'rgba(245, 124, 53, 1)',
          borderWidth: 1
        }
      ]
    };

    // Services by district
    const districtServices: Record<string, number> = {};
    data.forEach(item => {
      if (item.distrito) {
        districtServices[item.distrito] = (districtServices[item.distrito] || 0) + 1;
      }
    });

    const servicesByDistrict = {
      labels: Object.keys(districtServices),
      datasets: [
        {
          label: 'Serviços por Distrito',
          data: Object.values(districtServices),
          backgroundColor: [
            'rgba(245, 124, 53, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'
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
      timeToCompletion: {}, // Placeholder
      efficiencyScore: {}, // Placeholder
      dailyNewOrders: {}, // Placeholder
      servicesDiversity: {} // Placeholder
    });
  };

  return {
    chartData,
    generateChartData
  };
};
