
import { useState } from 'react';
import { SGZFilterOptions, SGZChartVisibility } from '@/components/ranking/types';

export const useSGZFilterManagement = () => {
  // State for filters
  const [filters, setFilters] = useState<SGZFilterOptions>({
    periodo: undefined,
    statuses: ['Todos'],
    areas_tecnicas: ['STM', 'STLP'],
    distritos: ['Todos'],
    bairros: ['Todos'],
    tipos_servico: ['Todos']
  });

  // State for chart visibility
  const [chartVisibility, setChartVisibility] = useState<SGZChartVisibility>({
    distribuicao_status: true,
    tempo_medio: true,
    empresas_concluidas: true,
    ordens_por_area: true,
    servicos_mais_realizados: true,
    servicos_por_distrito: true,
    comparativo_tempo: true,
    impacto_eficiencia: true,
    volume_diario: true,
    comparativo_bairros: true,
    radar_eficiencia: true,
    transicao_status: true,
    status_criticos: true,
    ordens_externas: true,
    diversidade_servicos: true,
    tempo_fechamento: true
  });

  const handleFiltersChange = (newFilters: Partial<SGZFilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleChartVisibilityChange = (newVisibility: Partial<SGZChartVisibility>) => {
    setChartVisibility(prev => ({ ...prev, ...newVisibility }));
  };

  return {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange
  };
};
