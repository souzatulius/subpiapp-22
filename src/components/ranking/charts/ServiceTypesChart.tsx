
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface ServiceTypesChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({ 
  data, 
  sgzData, 
  isLoading, 
  isSimulationActive 
}) => {
  const [chartData, setChartData] = React.useState<any>({
    labels: [],
    datasets: []
  });
  
  React.useEffect(() => {
    if (sgzData && sgzData.length > 0) {
      // Group data by service type
      const serviceTypeCounts: Record<string, number> = {};
      
      sgzData.forEach((order: any) => {
        const serviceType = order.sgz_tipo_servico || 'Não informado';
        
        // Skip if we're in simulation mode and this is an external service
        if (isSimulationActive && 
           (serviceType.toUpperCase().includes('ENEL') || 
            serviceType.toUpperCase().includes('SABESP') || 
            serviceType.toUpperCase().includes('COMGAS'))) {
          return;
        }
        
        if (!serviceTypeCounts[serviceType]) {
          serviceTypeCounts[serviceType] = 0;
        }
        serviceTypeCounts[serviceType] += 1;
      });
      
      // Sort service types by count in descending order
      const sortedServiceTypes = Object.entries(serviceTypeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Take top 10
      
      setChartData({
        labels: sortedServiceTypes.map(([type]) => type.length > 25 ? type.substring(0, 22) + '...' : type),
        datasets: [
          {
            label: 'Quantidade de OS',
            data: sortedServiceTypes.map(([, count]) => count),
            backgroundColor: [
              'rgba(249, 115, 22, 0.8)', // orange-500
              'rgba(249, 115, 22, 0.7)',
              'rgba(249, 115, 22, 0.6)',
              'rgba(251, 146, 60, 0.8)', // orange-400
              'rgba(251, 146, 60, 0.7)',
              'rgba(251, 146, 60, 0.6)',
              'rgba(254, 215, 170, 0.8)', // orange-200
              'rgba(254, 215, 170, 0.7)',
              'rgba(254, 215, 170, 0.6)',
              'rgba(255, 237, 213, 0.8)', // orange-100
            ],
            borderColor: [
              'rgba(249, 115, 22, 1)', // orange-500
              'rgba(249, 115, 22, 0.9)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(251, 146, 60, 1)', // orange-400
              'rgba(251, 146, 60, 0.9)',
              'rgba(251, 146, 60, 0.8)',
              'rgba(254, 215, 170, 1)', // orange-200
              'rgba(254, 215, 170, 0.9)',
              'rgba(254, 215, 170, 0.8)',
              'rgba(255, 237, 213, 1)', // orange-100
            ],
            borderWidth: 1
          }
        ]
      });
    }
  }, [sgzData, isSimulationActive]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          title: function(tooltipItems: any) {
            // Get the full service type name from original data
            const index = tooltipItems[0].dataIndex;
            const originalLabels = Object.keys(sgzData?.reduce((acc: any, order: any) => {
              acc[order.sgz_tipo_servico || 'Não informado'] = true;
              return acc;
            }, {}) || {});
            
            const sortedLabels = originalLabels.sort((a, b) => {
              const countA = sgzData?.filter(o => o.sgz_tipo_servico === a).length || 0;
              const countB = sgzData?.filter(o => o.sgz_tipo_servico === b).length || 0;
              return countB - countA;
            }).slice(0, 10);
            
            return sortedLabels[index] || tooltipItems[0].label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 10 }
        },
        beginAtZero: true
      }
    }
  };
  
  const cardValue = sgzData 
    ? `${isSimulationActive ? 'Simulação: ' : ''}Total: ${chartData.datasets[0]?.data.reduce((a: number, b: number) => a + b, 0) || 0} OS`
    : '';
  
  return (
    <ChartCard
      title="Distribuição por Tipo de Serviço"
      value={cardValue}
      isLoading={isLoading}
    >
      {chartData.labels.length > 0 && (
        <Bar data={chartData} options={chartOptions} />
      )}
    </ChartCard>
  );
};

export default ServiceTypesChart;
