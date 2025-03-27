
import React from 'react';

interface RespostaFormHeaderProps { 
  selectedDemanda: any;
}

const RespostaFormHeader: React.FC<RespostaFormHeaderProps> = ({ 
  selectedDemanda 
}) => {
  return (
    <div className="flex items-center justify-between">
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
