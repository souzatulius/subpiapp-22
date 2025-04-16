
import React from 'react';
import EnhancedChartCard from './EnhancedChartCard';
import { Radar } from 'react-chartjs-2';
import { barChartColors, getColorWithOpacity } from '../utils/chartColors';

interface DistrictEfficiencyRadarChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const DistrictEfficiencyRadarChart: React.FC<DistrictEfficiencyRadarChartProps> = ({
  data,
  sgzData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const chartData = React.useMemo(() => {
    // Make sure sgzData is an array before proceeding
    if (!sgzData || !Array.isArray(sgzData) || sgzData.length === 0) return null;
    
    // Group by districts and calculate metrics for each one
    const districtMetrics: Record<string, { 
      total: number, 
      completed: number, 
      inProgress: number, 
      pending: number,
      averageResponseTime: number
    }> = {};
    
    // Process each record to group by district
    if (Array.isArray(sgzData)) {
      sgzData.map(item => {
        const district = item.sgz_distrito || 'Desconhecido';
        const status = item.sgz_status || 'Desconhecido';
        
        if (!districtMetrics[district]) {
          districtMetrics[district] = { 
            total: 0, 
            completed: 0, 
            inProgress: 0, 
            pending: 0,
            averageResponseTime: 0
          };
        }
        
        districtMetrics[district].total += 1;
        
        if (status.toLowerCase().includes('conclu')) {
          districtMetrics[district].completed += 1;
        } else if (status.toLowerCase().includes('andamento') || status.toLowerCase().includes('execu')) {
          districtMetrics[district].inProgress += 1;
        } else {
          districtMetrics[district].pending += 1;
        }
        
        // Use the days to current status as a proxy for response time
        if (item.sgz_dias_ate_status_atual) {
          districtMetrics[district].averageResponseTime += item.sgz_dias_ate_status_atual;
        }
      });
    }
    
    // Calculate average response time and efficiency metrics
    Object.keys(districtMetrics).forEach(district => {
      const metrics = districtMetrics[district];
      metrics.averageResponseTime = metrics.total > 0 ? 
        metrics.averageResponseTime / metrics.total : 0;
    });
    
    // Select top 5 districts by total orders or all if less than 5
    const topDistricts = Object.keys(districtMetrics)
      .sort((a, b) => districtMetrics[b].total - districtMetrics[a].total)
      .slice(0, 5);
    
    // If using simulated data, use these fixed districts instead
    const simulatedDistricts = [
      'Pinheiros', 'Lapa', 'Sé', 'Mooca', 'Vila Mariana'
    ];
    
    // Generate radar chart data
    const districtsToUse = isSimulationActive ? simulatedDistricts : topDistricts;
    
    if (districtsToUse.length === 0) {
      return null;
    }
    
    // Calculate metrics (normalized to 0-100 scale)
    const completionRates = districtsToUse.map(district => {
      const metrics = districtMetrics[district] || { total: 0, completed: 0 };
      return metrics.total > 0 ? (metrics.completed / metrics.total) * 100 : 0;
    });
    
    const responseTimeScores = districtsToUse.map(district => {
      const metrics = districtMetrics[district] || { averageResponseTime: 0 };
      // Lower is better, so we invert the scale (max 30 days)
      return Math.max(0, 100 - (metrics.averageResponseTime * 3.33));
    });
    
    const pendingRates = districtsToUse.map(district => {
      const metrics = districtMetrics[district] || { total: 0, pending: 0 };
      // Lower is better, so we invert the scale
      return metrics.total > 0 ? 100 - ((metrics.pending / metrics.total) * 100) : 0;
    });
    
    // If simulation is active, override with ideal scores
    if (isSimulationActive) {
      return {
        labels: simulatedDistricts,
        datasets: [
          {
            label: 'Taxa de Conclusão',
            data: [85, 78, 90, 82, 88],
            backgroundColor: getColorWithOpacity(barChartColors[0], 0.2),
            borderColor: barChartColors[0],
            borderWidth: 2,
            pointBackgroundColor: barChartColors[0],
            pointRadius: 4
          },
          {
            label: 'Velocidade de Resposta',
            data: [90, 80, 85, 75, 92],
            backgroundColor: getColorWithOpacity(barChartColors[1], 0.2),
            borderColor: barChartColors[1],
            borderWidth: 2,
            pointBackgroundColor: barChartColors[1],
            pointRadius: 4
          },
          {
            label: 'Gestão de Pendências',
            data: [88, 75, 80, 85, 90],
            backgroundColor: getColorWithOpacity(barChartColors[2], 0.2),
            borderColor: barChartColors[2],
            borderWidth: 2,
            pointBackgroundColor: barChartColors[2],
            pointRadius: 4
          }
        ]
      };
    }
    
    return {
      labels: districtsToUse,
      datasets: [
        {
          label: 'Taxa de Conclusão',
          data: completionRates,
          backgroundColor: getColorWithOpacity(barChartColors[0], 0.2),
          borderColor: barChartColors[0],
          borderWidth: 2,
          pointBackgroundColor: barChartColors[0],
          pointRadius: 4
        },
        {
          label: 'Velocidade de Resposta',
          data: responseTimeScores,
          backgroundColor: getColorWithOpacity(barChartColors[1], 0.2),
          borderColor: barChartColors[1],
          borderWidth: 2,
          pointBackgroundColor: barChartColors[1],
          pointRadius: 4
        },
        {
          label: 'Gestão de Pendências',
          data: pendingRates,
          backgroundColor: getColorWithOpacity(barChartColors[2], 0.2),
          borderColor: barChartColors[2],
          borderWidth: 2,
          pointBackgroundColor: barChartColors[2],
          pointRadius: 4
        }
      ]
    };
  }, [sgzData, isSimulationActive]);

  const displayValue = React.useMemo(() => {
    if (!sgzData || !Array.isArray(sgzData) || sgzData.length === 0) {
      return "Sem dados";
    }
    
    return "Eficiência por Distrito";
  }, [sgzData]);

  return (
    <EnhancedChartCard
      title="Eficiência por Distrito (Radar)"
      subtitle="Comparativo multidimensional de eficiência entre distritos"
      value={displayValue}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      dataSource="SGZ"
      analysis="Compare o desempenho entre distritos em diferentes métricas: velocidade de atendimento, taxa de conclusão e gestão de pendências. Identifique quais distritos podem se tornar referências de boas práticas."
    >
      {!isLoading && (!chartData ? (
        <div className="flex items-center justify-center h-full flex-col">
          <div className="text-sm text-gray-600 text-center mb-4">
            Dados insuficientes para análise de eficiência por distrito
          </div>
          <div className="text-xs text-gray-500">
            É necessário ter dados de múltiplos distritos para gerar este gráfico
          </div>
        </div>
      ) : (
        <div className="h-80">
          <Radar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  min: 0,
                  max: 100,
                  beginAtZero: true,
                  ticks: {
                    stepSize: 20,
                    showLabelBackdrop: false
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'bottom'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      // Add type safety by casting context.raw to number
                      const value = Number(context.raw);
                      return `${context.dataset.label}: ${value.toFixed(1)}%`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      ))}
    </EnhancedChartCard>
  );
};

export default DistrictEfficiencyRadarChart;
