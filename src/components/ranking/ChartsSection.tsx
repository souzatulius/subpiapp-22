
import React, { useState, useCallback } from 'react';
import { ChartVisibility } from './types';
import NoDataMessage from './charts/NoDataMessage';
import StatusDistributionChart from './charts/StatusDistributionChart';
import ResolutionTimeChart from './charts/ResolutionTimeChart';
import TopCompaniesChart from './charts/TopCompaniesChart';
import NeighborhoodsChart from './charts/NeighborhoodsChart';
import ServiceTypesChart from './charts/ServiceTypesChart';
import ServicesByDistrictChart from './charts/ServicesByDistrictChart';
import TimeComparisonChart from './charts/TimeComparisonChart';
import EfficiencyImpactChart from './charts/EfficiencyImpactChart';
import DailyDemandsChart from './charts/DailyDemandsChart';
import NeighborhoodComparisonChart from './charts/NeighborhoodComparisonChart';
import DistrictEfficiencyRadarChart from './charts/DistrictEfficiencyRadarChart';
import StatusTransitionChart from './charts/StatusTransitionChart';
import CriticalStatusChart from './charts/CriticalStatusChart';
import ExternalDistrictsChart from './charts/ExternalDistrictsChart';
import ServiceDiversityChart from './charts/ServiceDiversityChart';
import ClosureTimeChart from './charts/ClosureTimeChart';
import ChartAnalysis from './charts/ChartAnalysis';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Eye, EyeOff, X, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

// Import chart registration
import './charts/ChartRegistration';

// Define the structure for a sortable chart item
interface ChartItem {
  id: string;
  component: React.ReactNode;
  isVisible: boolean;
  title: string;
  analysis: string;
}

// Create a SortableChartCard component
const SortableChartCard = ({ id, isVisible, component, title, analysis, onToggleVisibility, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="col-span-1 md:col-span-1 lg:col-span-1 h-full transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="relative h-full group">
        <div className="absolute top-0 right-0 p-1.5 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onToggleVisibility}
            className="p-1 rounded-full bg-white text-gray-600 hover:text-orange-600 shadow-sm hover:shadow transition-all"
            title={isVisible ? "Ocultar gráfico" : "Mostrar gráfico"}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={onRemove}
            className="p-1 rounded-full bg-white text-gray-600 hover:text-red-600 shadow-sm hover:shadow transition-all"
            title="Remover temporariamente"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="absolute top-1/2 left-0 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
          {...attributes}
          {...listeners}
        >
          <div className="p-1 rounded-full bg-white text-gray-400 shadow-sm">
            <GripVertical size={16} />
          </div>
        </div>
        
        <div className="h-full">
          {component}
        </div>
        
        {/* Analysis text */}
        <ChartAnalysis title={title} analysis={analysis} />
      </div>
    </motion.div>
  );
};

interface ChartsSectionProps {
  chartData: any;
  isLoading: boolean;
  chartVisibility: ChartVisibility;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  chartData,
  isLoading,
  chartVisibility
}) => {
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  
  // Initialize chart order state
  const [hiddenCharts, setHiddenCharts] = useState<string[]>([]);
  
  // Helper function to prepare chart data
  const prepareChartData = (rawData: any) => {
    // Return empty default data if raw data is missing
    if (!rawData) {
      return { 
        labels: [], 
        datasets: [{ 
          label: 'No Data', 
          data: [],
          backgroundColor: '#ccc' 
        }] 
      };
    }
    return rawData;
  };
  
  // Function to create initial chart items
  const createChartItems = useCallback(() => {
    const items: ChartItem[] = [];
    
    if (chartVisibility.statusDistribution) {
      items.push({
        id: 'statusDistribution',
        component: <StatusDistributionChart 
          data={prepareChartData(chartData?.statusDistribution)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('statusDistribution'),
        title: "Distribuição por Status",
        analysis: "Este gráfico mostra a proporção atual de ordens em cada status, permitindo identificar gargalos operacionais e tendências de conclusão."
      });
    }
    
    if (chartVisibility.resolutionTime) {
      items.push({
        id: 'resolutionTime',
        component: <ResolutionTimeChart 
          data={prepareChartData(chartData?.resolutionTime)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('resolutionTime'),
        title: "Tempo de Resolução",
        analysis: "Análise do tempo médio que leva para resolver ordens de serviço por tipo, permitindo identificar quais serviços são mais eficientes."
      });
    }
    
    if (chartVisibility.topCompanies) {
      items.push({
        id: 'topCompanies',
        component: <TopCompaniesChart 
          data={prepareChartData(chartData?.topCompanies)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('topCompanies'),
        title: "Empresas com Ordens Concluídas",
        analysis: "Ranking das empresas com maior número de ordens concluídas, indicando os principais parceiros em volume de entregas."
      });
    }
    
    if (chartVisibility.districtDistribution) {
      items.push({
        id: 'districtDistribution',
        component: <NeighborhoodsChart 
          data={prepareChartData(chartData?.districtDistribution)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('districtDistribution'),
        title: "Ordens por Subprefeitura",
        analysis: "Distribuição geográfica das ordens de serviço, mostrando quais regiões têm maior demanda de intervenções."
      });
    }
    
    if (chartVisibility.servicesByDepartment) {
      items.push({
        id: 'servicesByDepartment',
        component: <ServiceTypesChart 
          data={prepareChartData(chartData?.servicesByDepartment)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('servicesByDepartment'),
        title: "Serviços por Departamento",
        analysis: "Visualização dos tipos de serviços distribuídos por departamento técnico, indicando áreas de especialização."
      });
    }
    
    if (chartVisibility.servicesByDistrict) {
      items.push({
        id: 'servicesByDistrict',
        component: <ServicesByDistrictChart 
          data={prepareChartData(chartData?.servicesByDistrict)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('servicesByDistrict'),
        title: "Serviços por Distrito",
        analysis: "Análise da diversidade de serviços por distrito, permitindo identificar necessidades específicas de cada região."
      });
    }
    
    if (chartVisibility.timeComparison) {
      items.push({
        id: 'timeComparison',
        component: <TimeComparisonChart 
          data={prepareChartData(chartData?.timeComparison)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('timeComparison'),
        title: "Comparativo de Tempo Médio",
        analysis: "Comparação do tempo médio de resolução entre diferentes períodos ou tipos de serviço, mostrando evolução da eficiência."
      });
    }
    
    if (chartVisibility.efficiencyImpact) {
      items.push({
        id: 'efficiencyImpact',
        component: <EfficiencyImpactChart 
          data={prepareChartData(chartData?.efficiencyImpact)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('efficiencyImpact'),
        title: "Impacto na Eficiência",
        analysis: "Análise do impacto de exclusão de terceiros nos tempos médios de resolução, mostrando potencial interno da equipe."
      });
    }
    
    if (chartVisibility.dailyDemands) {
      items.push({
        id: 'dailyDemands',
        component: <DailyDemandsChart 
          data={prepareChartData(chartData?.dailyDemands)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('dailyDemands'),
        title: "Volume Diário",
        analysis: "Tendência diária de novas demandas, permitindo identificar picos sazonais e planejar recursos adequadamente."
      });
    }
    
    if (chartVisibility.neighborhoodComparison) {
      items.push({
        id: 'neighborhoodComparison',
        component: <NeighborhoodComparisonChart 
          data={prepareChartData(chartData?.neighborhoodComparison)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('neighborhoodComparison'),
        title: "Comparativo por Bairros",
        analysis: "Comparação de volume de ordens entre diferentes bairros, indicando áreas com maior necessidade de manutenção."
      });
    }
    
    if (chartVisibility.districtEfficiencyRadar) {
      items.push({
        id: 'districtEfficiencyRadar',
        component: <DistrictEfficiencyRadarChart 
          data={prepareChartData(chartData?.districtEfficiencyRadar)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('districtEfficiencyRadar'),
        title: "Radar de Eficiência",
        analysis: "Visualização multidimensional da eficiência de cada distrito em diferentes métricas operacionais."
      });
    }
    
    if (chartVisibility.statusTransition) {
      items.push({
        id: 'statusTransition',
        component: <StatusTransitionChart 
          data={prepareChartData(chartData?.statusTransition)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('statusTransition'),
        title: "Transição de Status",
        analysis: "Evolução temporal da transição entre diferentes status, mostrando o fluxo de progresso das ordens."
      });
    }
    
    if (chartVisibility.criticalStatus) {
      items.push({
        id: 'criticalStatus',
        component: <CriticalStatusChart 
          data={prepareChartData(chartData?.criticalStatus)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('criticalStatus'),
        title: "Status Críticos",
        analysis: "Destaque para ordens em status que requerem atenção especial, ajudando a priorizar intervenções urgentes."
      });
    }
    
    if (chartVisibility.externalDistricts) {
      items.push({
        id: 'externalDistricts',
        component: <ExternalDistrictsChart 
          data={prepareChartData(chartData?.externalDistricts)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('externalDistricts'),
        title: "Distritos Externos",
        analysis: "Mapeamento de ordens originadas de distritos externos à jurisdição principal, indicando relações interterritoriais."
      });
    }
    
    if (chartVisibility.serviceDiversity) {
      items.push({
        id: 'serviceDiversity',
        component: <ServiceDiversityChart 
          data={prepareChartData(chartData?.serviceDiversity)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('serviceDiversity'),
        title: "Diversidade de Serviços",
        analysis: "Análise da variedade de serviços executados por cada departamento técnico, mostrando áreas de especialização."
      });
    }
    
    if (chartVisibility.closureTime) {
      items.push({
        id: 'closureTime',
        component: <ClosureTimeChart 
          data={prepareChartData(chartData?.closureTime)} 
          isLoading={isLoading} 
        />,
        isVisible: !hiddenCharts.includes('closureTime'),
        title: "Tempo até Fechamento",
        analysis: "Estimativa do tempo médio até o fechamento completo de diferentes tipos de ordens, ajudando no planejamento de recursos."
      });
    }
    
    return items;
  }, [chartData, isLoading, chartVisibility, hiddenCharts]);
  
  // Initialize charts
  const [chartItems, setChartItems] = useState<ChartItem[]>(createChartItems());
  
  // Update charts when data or visibility changes
  React.useEffect(() => {
    setChartItems(createChartItems());
  }, [chartData, isLoading, chartVisibility, hiddenCharts, createChartItems]);
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setChartItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  // Handle chart visibility toggle
  const handleToggleVisibility = (id: string) => {
    setHiddenCharts(prev => {
      if (prev.includes(id)) {
        return prev.filter(chartId => chartId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle chart removal (same as toggling visibility, but semantically different)
  const handleRemove = (id: string) => {
    handleToggleVisibility(id);
  };
  
  if (!chartData && !isLoading) {
    return <NoDataMessage />;
  }
  
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={chartItems.map(item => item.id)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartItems.map((item) => (
            <SortableChartCard
              key={item.id}
              id={item.id}
              component={item.component}
              isVisible={item.isVisible}
              title={item.title}
              analysis={item.analysis}
              onToggleVisibility={() => handleToggleVisibility(item.id)}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ChartsSection;
