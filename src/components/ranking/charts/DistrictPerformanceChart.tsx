
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface DistrictPerformanceChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const DistrictPerformanceChart: React.FC<DistrictPerformanceChartProps> = ({ 
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
      // Group data by district
      const districtData: Record<string, { total: number, closed: number, pending: number }> = {};
      
      sgzData.forEach((order: any) => {
        const district = order.sgz_distrito || 'Não informado';
        
        if (!districtData[district]) {
          districtData[district] = { total: 0, closed: 0, pending: 0 };
        }
        
        districtData[district].total += 1;
        
        const status = order.sgz_status?.toLowerCase();
        if (status?.includes('fecha') || status?.includes('conclu')) {
          districtData[district].closed += 1;
        } else if (!(status?.includes('cancel'))) {
          districtData[district].pending += 1;
        }
      });
      
      // Calculate resolution rates and sort
      const districtPerformance = Object.entries(districtData)
        .map(([district, { total, closed }]) => ({
          district,
          resolutionRate: total > 0 ? (closed / total) * 100 : 0,
          total
        }))
        .filter(item => item.total > 10) // Filter out districts with too few orders
        .sort((a, b) => b.resolutionRate - a.resolutionRate);
      
      // Apply simulation if active
      const simulatedData = isSimulationActive
        ? districtPerformance.map(item => ({
            ...item,
            resolutionRate: Math.min(item.resolutionRate + 15, 100) // Increase by 15% in simulation, max 100%
          }))
        : districtPerformance;
      
      setChartData({
        labels: simulatedData.map(item => item.district),
        datasets: [
          {
            label: 'Taxa de Resolução (%)',
            data: simulatedData.map(item => item.resolutionRate.toFixed(1)),
            backgroundColor: simulatedData.map(item => 
              item.resolutionRate >= 80 ? 'rgba(34, 197, 94, 0.8)' : // Green for high performance
              item.resolutionRate >= 60 ? 'rgba(249, 115, 22, 0.8)' : // Orange for medium
              'rgba(239, 68, 68, 0.8)' // Red for low
            ),
            borderColor: simulatedData.map(item => 
              item.resolutionRate >= 80 ? 'rgba(34, 197, 94, 1)' : 
              item.resolutionRate >= 60 ? 'rgba(249, 115, 22, 1)' : 
              'rgba(239, 68, 68, 1)'
            ),
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
      duration: 1000
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
          label: function(context: any) {
            return `Taxa de Resolução: ${context.parsed.y}%`;
          },
          afterLabel: function(context: any) {
            const districtName = context.label;
            const districtOrders = sgzData?.filter(o => o.sgz_distrito === districtName) || [];
            return `Total OS: ${districtOrders.length}`;
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
          font: { size: 10 },
          callback: function(value: any) {
            return value + '%';
          }
        },
        beginAtZero: true,
        max: 100
      }
    }
  };
  
  // Calculate average resolution rate across all districts
  const averageResolutionRate = sgzData && sgzData.length > 0
    ? (sgzData.filter(order => {
        const status = order.sgz_status?.toLowerCase();
        return status?.includes('fecha') || status?.includes('conclu');
      }).length / sgzData.length) * 100
    : 0;
  
  // Apply simulation to the average if active
  const displayedAverage = isSimulationActive 
    ? Math.min(averageResolutionRate + 15, 100) 
    : averageResolutionRate;
  
  const cardValue = sgzData 
    ? `${isSimulationActive ? 'Simulação: ' : ''}Média Geral: ${displayedAverage.toFixed(1)}%`
    : '';
  
  return (
    <ChartCard
      title="Performance por Distrito"
      value={cardValue}
      isLoading={isLoading}
    >
      {chartData.labels.length > 0 && (
        <Bar data={chartData} options={chartOptions} />
      )}
    </ChartCard>
  );
};

export default DistrictPerformanceChart;
