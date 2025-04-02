
import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChartDataItem } from '../reports/types';

export interface ChartItem {
  name: string;
  [key: string]: any;
}

// Generates mockup data for testing
const generateMockData = (): ChartItem[] => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  return months.map(month => ({
    name: month,
    Demandas: Math.floor(Math.random() * 10) + 5,
    Notas: Math.floor(Math.random() * 8) + 3,
    Respostas: Math.floor(Math.random() * 15) + 8,
    Solicitações: Math.floor(Math.random() * 12) + 10,
    Satisfação: Math.floor(Math.random() * 3) + 7,
  }));
};

export const useChartData = () => {
  // Gerar dados mocados para os componentes
  const mockLineData = useMemo(() => generateMockData(), []);
  const mockBarData = useMemo(() => {
    const categories = ['Tema 1', 'Tema 2', 'Tema 3', 'Tema 4', 'Tema 5'];
    return categories.map(cat => ({
      name: cat,
      Quantidade: Math.floor(Math.random() * 50) + 10,
    }));
  }, []);
  const mockAreaData = useMemo(() => generateMockData(), []);
  const mockPieData = useMemo(() => {
    const categories = ['Concluídas', 'Em andamento', 'Pendentes', 'Canceladas'];
    return categories.map(cat => ({
      name: cat,
      value: Math.floor(Math.random() * 30) + 5,
    }));
  }, []);
  const mockTimelineData = useMemo(() => generateMockData(), []);
  const mockImpactData = useMemo(() => {
    const impacts = ['Alto', 'Médio', 'Baixo'];
    return impacts.map(impact => ({
      name: impact,
      value: Math.floor(Math.random() * 40) + 10,
    }));
  }, []);
  const mockOriginData = useMemo(() => {
    const origins = ['Cidadão', 'Imprensa', 'Órgão público', 'Interno'];
    return origins.map(origin => ({
      name: origin,
      Solicitações: Math.floor(Math.random() * 20) + 10,
    }));
  }, []);
  const mockSatisfactionData = useMemo(() => generateMockData(), []);

  // Dados para gráficos de ranking
  const mockServiceDiversityData = useMemo(() => {
    const types = ['PAVIMENTAÇÃO', 'ÁREAS VERDES', 'ILUMINAÇÃO', 'ZELADORIA', 'LIMPEZA'];
    return types.map(type => ({
      name: type,
      Quantidade: Math.floor(Math.random() * 15) + 5,
    }));
  }, []);

  const mockServicesByDistrictData = useMemo(() => {
    const districts = ['ALTO DE PINHEIROS', 'JARDIM PAULISTA', 'ITAIM BIBI', 'PINHEIROS', 'PERDIZES'];
    return districts.map(district => ({
      name: district,
      Quantidade: Math.floor(Math.random() * 25) + 10,
    }));
  }, []);

  const mockServiceTypesData = useMemo(() => {
    const services = ['TAPA-BURACO', 'PODA DE ÁRVORE', 'LIMPEZA', 'MANUTENÇÃO', 'INSTALAÇÃO'];
    return services.map(service => ({
      name: service,
      Quantidade: Math.floor(Math.random() * 35) + 10,
    }));
  }, []);

  const mockStatusDistributionData = useMemo(() => {
    const statuses = ['ABERTO', 'EM ANDAMENTO', 'CONCLUÍDO', 'CANCELADO'];
    return statuses.map(status => ({
      name: status,
      Quantidade: Math.floor(Math.random() * 65) + 10,
    }));
  }, []);

  const mockStatusTransitionData = useMemo(() => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
    return months.map(month => ({
      name: month,
      Aberto: Math.floor(Math.random() * 20) + 25,
      EmAndamento: Math.floor(Math.random() * 20) + 25,
      Concluído: Math.floor(Math.random() * 20) + 25,
    }));
  }, []);

  const mockTimeComparisonData = useMemo(() => {
    const categories = ['Média Geral', 'Tapa-buraco', 'Poda de Árvore', 'Limpeza'];
    return categories.map(category => ({
      name: category,
      Dias: Math.floor(Math.random() * 15) + 10,
    }));
  }, []);

  const mockTopCompaniesData = useMemo(() => {
    const companies = ['Empresa A', 'Empresa B', 'Empresa C', 'Empresa D', 'Empresa E'];
    return companies.map(company => ({
      name: company,
      Concluídas: Math.floor(Math.random() * 25) + 25,
    }));
  }, []);

  // Exports all data for charts
  return {
    // Chart data for general components
    pieChartData: mockPieData,
    lineChartData: mockLineData,
    barChartData: mockBarData,
    areaChartData: mockAreaData,
    timelineChartData: mockTimelineData,
    impactChartData: mockImpactData,
    originChartData: mockOriginData,
    satisfactionChartData: mockSatisfactionData,

    // Chart data for ranking components
    serviceDiversityData: mockServiceDiversityData,
    servicesByDistrictData: mockServicesByDistrictData,
    serviceTypesData: mockServiceTypesData, 
    statusDistributionData: mockStatusDistributionData,
    statusTransitionData: mockStatusTransitionData,
    timeComparisonData: mockTimeComparisonData,
    topCompaniesData: mockTopCompaniesData,
  };
};
