
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartCard from './ChartCard';

interface SgzRankingComparisonChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const SgzRankingComparisonChart: React.FC<SgzRankingComparisonChartProps> = ({ 
  data, 
  sgzData, 
  isLoading,
  isSimulationActive 
}) => {
  // Generate SGZ vs Ranking comparison data
  const generateComparisonData = React.useMemo(() => {
    // Data showing what's counted vs what's not
    const labels = [
      'Contabilizado no Ranking', 
      'Desconsiderado no Ranking',
      'Precisando Reclassificação'
    ];
    
    // Values for the chart
    let values = [60, 30, 10];
    
    if (isSimulationActive) {
      // In simulation, we'd have better classification
      values = [80, 15, 5];
    }
    
    return {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#0066FF', // Counted in ranking (blue)
            '#F97316', // Not counted (orange)
            '#64748B'  // Needs reclassification (gray)
          ],
          borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
          borderWidth: 1,
        },
      ],
    };
  }, [isSimulationActive]);
  
  return (
    <ChartCard
      title="SGZ x Ranking das Subs"
      subtitle="Avaliação de detalhes das OS"
      value="O que não é levado em consideração"
      isLoading={isLoading}
    >
      {!isLoading && (
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <Doughnut 
              data={generateComparisonData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                  legend: {
                    position: 'right' as const,
                    labels: {
                      boxWidth: 12,
                      boxHeight: 12,
                      font: {
                        size: 11
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = Math.round((value * 100) / total);
                        return `${label}: ${percentage}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          
          <div className="mt-4 px-2">
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <span className="w-3 h-3 inline-block bg-blue-600 rounded-full mr-2"></span>
                OS corretamente classificadas e resolvidas
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 inline-block bg-orange-500 rounded-full mr-2"></span>
                OS de outros órgãos ou em distritos externos
              </li>
            </ul>
          </div>
        </div>
      )}
    </ChartCard>
  );
};

export default SgzRankingComparisonChart;
