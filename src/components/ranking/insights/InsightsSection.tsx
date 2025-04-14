
// Creating a new file for the InsightsSection component
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SGZData, PainelData } from '@/types/sgz';

interface InsightsSectionProps {
  sgzData: SGZData[];
  painelData: PainelData[];
  isSimulationActive: boolean;
  isMobile?: boolean;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ 
  sgzData, 
  painelData, 
  isSimulationActive,
  isMobile = false
}) => {
  // Mock insights for demonstration
  const insights = [
    {
      id: 1, 
      title: 'Subprefeitura com melhor ranking', 
      value: 'Pinheiros',
      trend: 'up',
      percentage: '3.2%'
    },
    {
      id: 2, 
      title: 'Principal tipo de serviço', 
      value: 'Tapa-buraco',
      trend: 'neutral',
      count: '2,345'
    },
    {
      id: 3, 
      title: 'Serviço mais atrasado', 
      value: 'Poda de árvore',
      trend: 'down',
      percentage: '24%'
    },
    {
      id: 4, 
      title: 'Tempo médio de atendimento', 
      value: '12 dias',
      trend: 'down',
      percentage: '8.5%'
    }
  ];

  // Adjusted grid columns based on mobile state
  const gridClass = isMobile 
    ? "grid grid-cols-2 gap-4" 
    : "grid grid-cols-4 gap-4";

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Principais Insights</h3>
      <div className={gridClass}>
        {insights.map(insight => (
          <Card key={insight.id} className="p-4 shadow-sm bg-white">
            <div className="text-sm font-medium text-gray-500 mb-1">{insight.title}</div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">{insight.value}</span>
              {insight.trend === 'up' && (
                <div className="flex items-center text-green-500">
                  <ChevronUp className="h-4 w-4 mr-1" />
                  <span className="text-xs">{insight.percentage}</span>
                </div>
              )}
              {insight.trend === 'down' && (
                <div className="flex items-center text-red-500">
                  <ChevronDown className="h-4 w-4 mr-1" />
                  <span className="text-xs">{insight.percentage}</span>
                </div>
              )}
              {insight.count && (
                <span className="text-xs text-gray-500">{insight.count}</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InsightsSection;
