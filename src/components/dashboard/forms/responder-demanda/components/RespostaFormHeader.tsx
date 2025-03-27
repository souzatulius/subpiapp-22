
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface RespostaFormHeaderProps {
  selectedDemanda: any;
  onBack: () => void;
}

const RespostaFormHeader: React.FC<RespostaFormHeaderProps> = ({ 
  selectedDemanda, 
  onBack 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onBack} className="p-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold text-subpi-blue">
          Responder Demanda
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        {selectedDemanda.protocolo && (
          <div className="text-sm bg-blue-50 text-subpi-blue px-2 py-1 rounded-lg">
            Protocolo: <span className="font-semibold">{selectedDemanda.protocolo}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RespostaFormHeader;
