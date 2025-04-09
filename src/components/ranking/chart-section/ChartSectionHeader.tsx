
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ChartSectionHeaderProps {
  onSimulateIdealRanking: () => void;
  isSimulationActive: boolean;
}

const ChartSectionHeader: React.FC<ChartSectionHeaderProps> = ({
  onSimulateIdealRanking,
  isSimulationActive
}) => {
  return (
    <div className="flex justify-end mb-4">
      <Button 
        onClick={onSimulateIdealRanking}
        className={`gap-2 ${isSimulationActive 
          ? 'bg-gray-600 hover:bg-gray-700' 
          : 'bg-orange-500 hover:bg-orange-600'} text-white transition-colors`}
      >
        <Sparkles className="h-4 w-4" />
        {isSimulationActive ? 'Voltar ao Ranking Real' : 'Simular Ranking Ideal'}
      </Button>
    </div>
  );
};

export default ChartSectionHeader;
