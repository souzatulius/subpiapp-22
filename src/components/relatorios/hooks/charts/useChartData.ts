
import { useMemo } from 'react';

import { ChartData } from './types';

export const useChartData = () => {
  // Basic chart data
  const pieChartData = useMemo<ChartData[]>(() => [
    { name: 'Pendentes', value: 30 },
    { name: 'Em Andamento', value: 50 },
    { name: 'Concluídas', value: 100 },
    { name: 'Canceladas', value: 20 },
  ], []);
  
  const lineChartData = useMemo<ChartData[]>(() => [
    { name: 'Jan', Demandas: 12 },
    { name: 'Fev', Demandas: 19 },
    { name: 'Mar', Demandas: 3 },
    { name: 'Abr', Demandas: 5 },
    { name: 'Mai', Demandas: 2 },
    { name: 'Jun', Demandas: 3 },
  ], []);
  
  const barChartData = useMemo<ChartData[]>(() => [
    { name: 'Tema 1', Quantidade: 12 },
    { name: 'Tema 2', Quantidade: 19 },
    { name: 'Tema 3', Quantidade: 3 },
    { name: 'Tema 4', Quantidade: 5 },
    { name: 'Tema 5', Quantidade: 2 },
  ], []);
  
  const areaChartData = useMemo<ChartData[]>(() => [
    { name: 'Jan', Notas: 12 },
    { name: 'Fev', Notas: 19 },
    { name: 'Mar', Notas: 3 },
    { name: 'Abr', Notas: 5 },
    { name: 'Mai', Notas: 2 },
    { name: 'Jun', Notas: 3 },
  ], []);

  // Additional chart data
  const timelineChartData = useMemo<ChartData[]>(() => [
    { name: 'Jan', Respostas: 8 },
    { name: 'Fev', Respostas: 12 },
    { name: 'Mar', Respostas: 15 },
    { name: 'Abr', Respostas: 10 },
    { name: 'Mai', Respostas: 16 },
    { name: 'Jun', Respostas: 18 },
  ], []);

  const impactChartData = useMemo<ChartData[]>(() => [
    { name: 'Baixo', value: 45 },
    { name: 'Médio', value: 35 },
    { name: 'Alto', value: 20 },
  ], []);

  const originChartData = useMemo<ChartData[]>(() => [
    { name: 'Imprensa', Solicitações: 25 },
    { name: 'Órgãos', Solicitações: 18 },
    { name: 'Cidadãos', Solicitações: 32 },
    { name: 'Interno', Solicitações: 15 },
  ], []);

  const satisfactionChartData = useMemo<ChartData[]>(() => [
    { name: 'Jan', Satisfação: 7.5 },
    { name: 'Fev', Satisfação: 7.8 },
    { name: 'Mar', Satisfação: 8.2 },
    { name: 'Abr', Satisfação: 8.0 },
    { name: 'Mai', Satisfação: 8.5 },
    { name: 'Jun', Satisfação: 8.7 },
  ], []);

  // Ranking chart data
  const serviceDiversityData = useMemo<ChartData[]>(() => [
    { name: 'PAVIMENTAÇÃO', Quantidade: 12 },
    { name: 'ÁREAS VERDES', Quantidade: 8 },
    { name: 'ILUMINAÇÃO', Quantidade: 15 },
    { name: 'ZELADORIA', Quantidade: 10 },
    { name: 'LIMPEZA', Quantidade: 7 },
  ], []);
  
  const servicesByDistrictData = useMemo<ChartData[]>(() => [
    { name: 'ALTO DE PINHEIROS', Quantidade: 18 },
    { name: 'JARDIM PAULISTA', Quantidade: 12 },
    { name: 'ITAIM BIBI', Quantidade: 15 },
    { name: 'PINHEIROS', Quantidade: 22 },
    { name: 'PERDIZES', Quantidade: 14 },
  ], []);
  
  const serviceTypesData = useMemo<ChartData[]>(() => [
    { name: 'TAPA-BURACO', Quantidade: 35 },
    { name: 'PODA DE ÁRVORE', Quantidade: 28 },
    { name: 'LIMPEZA', Quantidade: 22 },
    { name: 'MANUTENÇÃO', Quantidade: 18 },
    { name: 'INSTALAÇÃO', Quantidade: 12 },
  ], []);
  
  const statusDistributionData = useMemo<ChartData[]>(() => [
    { name: 'ABERTO', Quantidade: 45 },
    { name: 'EM ANDAMENTO', Quantidade: 30 },
    { name: 'CONCLUÍDO', Quantidade: 65 },
    { name: 'CANCELADO', Quantidade: 12 },
  ], []);
  
  const timeComparisonData = useMemo<ChartData[]>(() => [
    { name: 'Média Geral', Dias: 18 },
    { name: 'Tapa-buraco', Dias: 12 },
    { name: 'Poda de Árvore', Dias: 25 },
    { name: 'Limpeza', Dias: 14 },
  ], []);
  
  const topCompaniesData = useMemo<ChartData[]>(() => [
    { name: 'Empresa A', Concluídas: 48 },
    { name: 'Empresa B', Concluídas: 42 },
    { name: 'Empresa C', Concluídas: 38 },
    { name: 'Empresa D', Concluídas: 32 },
    { name: 'Empresa E', Concluídas: 28 },
  ], []);
  
  const statusTransitionData = useMemo<ChartData[]>(() => [
    { name: 'Janeiro', Aberto: 45, EmAndamento: 30, Concluído: 25 },
    { name: 'Fevereiro', Aberto: 39, EmAndamento: 38, Concluído: 32 },
    { name: 'Março', Aberto: 28, EmAndamento: 42, Concluído: 38 },
    { name: 'Abril', Aberto: 35, EmAndamento: 32, Concluído: 42 },
    { name: 'Maio', Aberto: 42, EmAndamento: 28, Concluído: 48 },
    { name: 'Junho', Aberto: 38, EmAndamento: 35, Concluído: 55 },
  ], []);

  return {
    // Basic chart data
    pieChartData,
    lineChartData,
    barChartData,
    areaChartData,
    
    // Additional chart data
    timelineChartData,
    impactChartData,
    originChartData,
    satisfactionChartData,
    
    // Ranking chart data
    serviceDiversityData,
    servicesByDistrictData,
    serviceTypesData,
    statusDistributionData,
    timeComparisonData,
    topCompaniesData,
    statusTransitionData
  };
};
