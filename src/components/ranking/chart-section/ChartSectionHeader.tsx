
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ChartSectionHeaderProps {
  onSimulateIdealRanking: () => void;
  isSimulationActive: boolean;
}

const ChartSectionHeader: React.FC<ChartSectionHeaderProps> = ({
  onSimulateIdealRanking,
  isSimulationActive
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-orange-700">
        Análise de Desempenho
      </h2>
      
      <Button 
        variant="outline" 
        className={`flex items-center gap-2 border ${isSimulationActive ? 'bg-orange-100 text-orange-700 border-orange-300' : 'text-gray-600'}`}
        onClick={onSimulateIdealRanking}
      >
        <RefreshCw className="h-4 w-4" />
        {isSimulationActive ? 'Desativar Simulação' : 'Simular Ranking Ideal'}
      </Button>
    </div>
  );
};

export default ChartSectionHeader;
