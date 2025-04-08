
import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart } from '@/components/relatorios/charts/PieChart';

interface ChartPreviewProps {
  chartId: string;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({ chartId }) => {
  // Sample data for the charts - using the same data as in RelatoriosGraphCards
  const origemDemandas = [
    { name: 'Imprensa', value: 42 },
    { name: 'SMSUB', value: 28 },
    { name: 'Secom', value: 16 },
    { name: 'Outras', value: 14 }
  ];

  // Render the appropriate chart based on the chartId
  if (chartId === 'origemDemandas') {
    return (
      <div className="w-full">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-white">Origem das Demandas</h3>
          <p className="text-xs text-white/80">Imprensa e SMSUB são 70%</p>
        </div>
        <div className="h-[160px] w-full">
          <PieChart 
            data={origemDemandas} 
            colorSet="orange" 
            showOnlyPercentage={true} 
            showLabels={false} 
            legendPosition="none" 
            largePercentage={true}
          />
        </div>
      </div>
    );
  }
  
  return <div className="text-white text-sm">Gráfico não disponível</div>;
};

export default ChartPreview;
