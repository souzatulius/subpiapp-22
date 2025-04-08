
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface RankingSimulationChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const RankingSimulationChart: React.FC<RankingSimulationChartProps> = ({ 
  data, 
  sgzData, 
  isLoading,
  isSimulationActive 
}) => {
  // Generate ranking simulation chart data
  const generateRankingSimulationData = React.useMemo(() => {
    const subprefeituras = [
      'Santo Amaro',
      'Pinheiros',
      'Mooca',
      'Lapa',
      'Vila Mariana'
    ];
    
    // Current rank scores - lower is better
    let currentScores = [7.8, 8.6, 8.2, 7.9, 8.1];
    
    // Ideal scenario scores - with external issues resolved
    let idealScores = [7.8, 6.4, 8.2, 7.9, 8.1];
    
    if (isSimulationActive) {
      // Show even more improvement in simulation
      idealScores = idealScores.map(score => Math.max(score - 0.8, 5.0));
    }
    
    return {
      labels: subprefeituras,
      datasets: [
        {
          label: 'Ranking Atual',
          data: currentScores,
          backgroundColor: '#64748B',
          barPercentage: 0.6,
          categoryPercentage: 0.7
        },
        {
          label: 'Ranking Ideal (sem interferências)',
          data: idealScores,
          backgroundColor: '#0066FF',
          barPercentage: 0.6,
          categoryPercentage: 0.7
        }
      ]
    };
  }, [isSimulationActive]);
  
  return (
    <ChartCard
      title="Como estaria nosso ranking"
      subtitle="Classificação sem interferências e com OS fechadas"
      value="Subprefeitura de Pinheiros em 2º lugar"
      isLoading={isLoading}
    >
      {!isLoading && (
        <Bar
          data={generateRankingSimulationData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  boxWidth: 12,
                  boxHeight: 12
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    // Lower score is better in ranking
                    return `${context.dataset.label}: ${context.parsed.y} (${context.dataIndex + 1}º lugar)`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                reverse: false, // Lower score is better but keeping the visual intuitive
                title: {
                  display: true,
                  text: 'Pontuação (menor é melhor)'
                }
              }
            }
          }}
        />
      )}
    </ChartCard>
  );
};

export default RankingSimulationChart;
