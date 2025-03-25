
import React from 'react';
import { SGZChartVisibility } from '../types';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import NoDataMessage from '../charts/NoDataMessage';
import SGZChart from './SGZChart';

interface SGZChartsSectionProps {
  chartData: any;
  isLoading: boolean;
  chartVisibility: SGZChartVisibility;
}

const SGZChartsSection: React.FC<SGZChartsSectionProps> = ({
  chartData,
  isLoading,
  chartVisibility
}) => {
  // State para a ordem dos gráficos
  const [chartOrder, setChartOrder] = React.useState([
    'distribuicao_status',
    'tempo_medio',
    'empresas_concluidas',
    'ordens_por_area',
    'servicos_mais_realizados',
    'servicos_por_distrito',
    'comparativo_tempo',
    'impacto_eficiencia',
    'volume_diario',
    'comparativo_bairros',
    'radar_eficiencia',
    'transicao_status',
    'status_criticos',
    'ordens_externas',
    'diversidade_servicos',
    'tempo_fechamento'
  ]);

  // Lidar com o evento de arrastar e soltar
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Filtra os gráficos visíveis
  const visibleCharts = chartOrder.filter(chartKey => 
    chartVisibility[chartKey as keyof SGZChartVisibility]
  );

  if (!chartData && !isLoading) {
    return <NoDataMessage />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Gráficos de Análise</h2>
      
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={visibleCharts} strategy={rectSortingStrategy}>
          <div className="charts-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCharts.map((chartKey) => (
              <SGZChart
                key={chartKey}
                id={chartKey}
                title={getChartTitle(chartKey)}
                type={getChartType(chartKey)}
                data={chartData ? chartData[getChartDataKey(chartKey)] : null}
                isLoading={isLoading}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {visibleCharts.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>Todos os gráficos estão ocultos. Ative a visibilidade nos filtros acima.</p>
        </div>
      )}
    </div>
  );
};

// Funções auxiliares para obter informações dos gráficos
function getChartTitle(chartKey: string): string {
  const titles: Record<string, string> = {
    distribuicao_status: "Distribuição por Status",
    tempo_medio: "Tempo Médio entre Criação e Status Atual",
    empresas_concluidas: "Empresas com mais Ordens Concluídas",
    ordens_por_area: "Ordens por Área da Subprefeitura",
    servicos_mais_realizados: "Serviços mais Realizados (STM/STLP)",
    servicos_por_distrito: "Serviços por Distrito",
    comparativo_tempo: "Comparativo de Tempo Médio (Concluído vs Fechado)",
    impacto_eficiencia: "Impacto na Eficiência (excl. terceiros)",
    volume_diario: "Volume Diário de Novas Demandas",
    comparativo_bairros: "Comparativo por Bairros",
    radar_eficiencia: "Radar de Eficiência por Distrito",
    transicao_status: "Transição de Status ao Longo dos Dias",
    status_criticos: "Status Críticos em Destaque",
    ordens_externas: "Ordens de Distritos Externos",
    diversidade_servicos: "Diversidade de Serviços por Área Técnica",
    tempo_fechamento: "Tempo Médio até Fechamento Total"
  };
  
  return titles[chartKey] || "Gráfico";
}

function getChartType(chartKey: string): 'bar' | 'line' | 'pie' | 'radar' | 'doughnut' {
  const types: Record<string, 'bar' | 'line' | 'pie' | 'radar' | 'doughnut'> = {
    distribuicao_status: "pie",
    tempo_medio: "bar",
    empresas_concluidas: "bar",
    ordens_por_area: "doughnut",
    servicos_mais_realizados: "bar",
    servicos_por_distrito: "bar",
    comparativo_tempo: "bar",
    impacto_eficiencia: "line",
    volume_diario: "line",
    comparativo_bairros: "bar",
    radar_eficiencia: "radar",
    transicao_status: "line",
    status_criticos: "pie",
    ordens_externas: "bar",
    diversidade_servicos: "radar",
    tempo_fechamento: "bar"
  };
  
  return types[chartKey] || "bar";
}

function getChartDataKey(chartKey: string): string {
  const dataKeys: Record<string, string> = {
    distribuicao_status: "statusDistribution",
    tempo_medio: "resolutionTime",
    empresas_concluidas: "companiesCompleted",
    ordens_por_area: "areaDistribution",
    servicos_mais_realizados: "servicesDistribution",
    servicos_por_distrito: "districtServices",
    // ... Outros mapeamentos
  };
  
  return dataKeys[chartKey] || chartKey;
}

export default SGZChartsSection;
