import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ResponsibilityChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ResponsibilityChart: React.FC<ResponsibilityChartProps> = ({ 
  data, 
  sgzData, 
  painelData, 
  isLoading, 
  isSimulationActive 
}) => {
  const [chartData, setChartData] = React.useState<any>({
    labels: [],
    datasets: []
  });
  
  const externalKeywords = [
    'ENEL', 'SABESP', 'COMGAS', 'CPFL', 'TELECOM', 'VIVO', 'CLARO', 'TIM',
    'OI', 'NEXTEL', 'GÁS', 'ILUME', 'SPDA'
  ];
  
  React.useEffect(() => {
    if (sgzData && sgzData.length > 0) {
      let internalCount = 0;
      let externalCount = 0;
      let externalDetails: Record<string, number> = {};
      
      sgzData.forEach((order: any) => {
        const serviceType = (order.sgz_tipo_servico || '').toUpperCase();
        
        const isExternal = externalKeywords.some(keyword => 
          serviceType.includes(keyword)
        );
        
        if (isExternal) {
          externalCount++;
          const matchedKeyword = externalKeywords.find(keyword => serviceType.includes(keyword)) || 'OUTRO';
          externalDetails[matchedKeyword] = (externalDetails[matchedKeyword] || 0) + 1;
        } else {
          internalCount++;
        }
      });
      
      if (isSimulationActive) {
        const totalExternal = externalCount;
        externalCount = 0;
        internalCount = sgzData.length - totalExternal;
      }
      
      setChartData({
        labels: ['Subprefeitura', 'Entidades Externas'],
        datasets: [
          {
            data: [internalCount, externalCount],
            backgroundColor: [
              'rgba(249, 115, 22, 0.8)',
              'rgba(156, 163, 175, 0.8)'
            ],
            borderColor: [
              'rgba(249, 115, 22, 1)',
              'rgba(156, 163, 175, 1)'
            ],
            borderWidth: 1,
            hoverOffset: 4
          }
        ]
      });
    }
  }, [sgzData, isSimulationActive]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000
    },
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
          afterLabel: function(context: any) {
            if (context.label === 'Entidades Externas' && !isSimulationActive) {
              return Object.entries({})
                .filter(([_, count]) => typeof count === 'number' && count > 0)
                .map(([entity, count]) => `${entity}: ${count}`);
            }
            return null;
          }
        }
      }
    }
  };
  
  const total = sgzData?.length || 0;
  const internalCount = sgzData?.filter(order => {
    const serviceType = (order.sgz_tipo_servico || '').toUpperCase();
    return !externalKeywords.some(keyword => serviceType.includes(keyword));
  }).length || 0;
  
  const internalPercentage = total > 0 ? ((internalCount / total) * 100).toFixed(1) : 0;
  const simulatedPercentage = isSimulationActive ? "100.0" : internalPercentage;
  
  const cardValue = sgzData 
    ? `${isSimulationActive ? 'Simulação: ' : ''}Subprefeitura: ${simulatedPercentage}%`
    : '';
  
  return (
    <ChartCard
      title="Responsabilidade Real (Sub vs Externo)"
      value={cardValue}
      isLoading={isLoading}
    >
      {chartData.labels.length > 0 && (
        <Doughnut data={chartData} options={chartOptions} />
      )}
    </ChartCard>
  );
};

export default ResponsibilityChart;
