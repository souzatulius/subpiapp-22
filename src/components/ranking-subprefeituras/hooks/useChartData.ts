
import { useState, useEffect, useCallback } from 'react';
import { ChartData, OrdensStats, OrdemServico } from '../types';
import { defaultChartData } from './constants/chartDefaults';
import { generateColors } from './utils/chartUtils';

/**
 * Hook for managing chart data based on orders and statistics
 */
export const useChartData = (ordens: OrdemServico[], stats: OrdensStats | null) => {
  const [chartData, setChartData] = useState<ChartData[]>(defaultChartData);

  const updateChartData = useCallback(() => {
    if (!stats) return;

    setChartData(prevChartData => {
      const newChartData = [...prevChartData];

      // Tempo Médio de Resolução
      const tempoMedioResolucaoChart = newChartData.find(chart => chart.id === 'tempo-medio-resolucao');
      if (tempoMedioResolucaoChart && stats) {
        tempoMedioResolucaoChart.data = {
          total: stats.tempoMedioResolucao.toFixed(1),
          details: [
            { label: 'Média', value: stats.tempoMedioResolucao.toFixed(1) },
            { label: 'Mediana', value: '0' }
          ]
        };
      }

      // Ordens por Distrito (Horizontal Bar)
      const ordensPorDistritoChart = newChartData.find(chart => chart.id === 'ordens-por-distrito');
      if (ordensPorDistritoChart && stats) {
        const labels = Object.keys(stats.totalPorDistrito);
        const data = Object.values(stats.totalPorDistrito);
        const backgroundColor = generateColors(labels.length);

        ordensPorDistritoChart.data = {
          datasets: labels.map((label, index) => ({
            label: label,
            data: [data[index]],
            backgroundColor: [backgroundColor[index]],
          }))
        };
      }

      // Ordens por Bairro (Bar)
      const ordensPorBairroChart = newChartData.find(chart => chart.id === 'ordens-por-bairro');
      if (ordensPorBairroChart && stats) {
        const labels = Object.keys(stats.totalPorBairro);
        const data = Object.values(stats.totalPorBairro);
        const backgroundColor = generateColors(labels.length);

        ordensPorBairroChart.data = {
          labels: labels,
          datasets: [{
            label: 'Total',
            data: data,
            backgroundColor: backgroundColor,
          }]
        };
      }

      // Ordens por Classificação (Pie)
      const ordensPorClassificacaoChart = newChartData.find(chart => chart.id === 'ordens-por-classificacao');
      if (ordensPorClassificacaoChart && stats) {
        const labels = Object.keys(stats.totalPorClassificacao);
        const data = Object.values(stats.totalPorClassificacao);
        const backgroundColor = generateColors(labels.length);

        ordensPorClassificacaoChart.data = {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColor,
          }]
        };
      }

      // Ordens por Status (Pie)
      const ordensPorStatusChart = newChartData.find(chart => chart.id === 'ordens-por-status');
      if (ordensPorStatusChart && stats) {
        const labels = Object.keys(stats.totalPorStatus);
        const data = Object.values(stats.totalPorStatus);
        const backgroundColor = generateColors(labels.length);

        ordensPorStatusChart.data = {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColor,
          }]
        };
      }

      // Ordens Criadas por Mês (Line)
      const ordensCriadasPorMesChart = newChartData.find(chart => chart.id === 'ordens-criadas-por-mes');
      if (ordensCriadasPorMesChart) {
        // Agrupar ordens por mês
        const ordensPorMes = ordens.reduce((acc: Record<string, number>, ordem) => {
          if (ordem.criado_em) {
            const mes = new Date(ordem.criado_em).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            acc[mes] = (acc[mes] || 0) + 1;
          }
          return acc;
        }, {});

        const labels = Object.keys(ordensPorMes).sort();
        const data = labels.map(mes => ordensPorMes[mes]);
        const borderColor = '#4f46e5';
        const backgroundColor = '#c7d2fe';

        ordensCriadasPorMesChart.data = {
          labels: labels,
          datasets: [{
            label: 'Ordens Criadas',
            data: data,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
          }]
        };
      }

      return newChartData;
    });
  }, [stats, ordens]);

  useEffect(() => {
    if (stats) {
      updateChartData();
    }
  }, [stats, updateChartData]);

  return {
    chartData,
    setChartData,
    updateChartData
  };
};
