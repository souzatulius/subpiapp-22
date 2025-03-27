
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RespostaFormHeaderProps {
  selectedDemanda: any;
  onBack: () => void;
}

const RespostaFormHeader: React.FC<RespostaFormHeaderProps> = ({ 
  selectedDemanda, 
  onBack 
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={onBack} 
          aria-label="Voltar para lista de demandas"
          className="mr-4 hover:bg-gray-100 transition-colors duration-300"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>
        <h2 className="text-xl font-semibold text-subpi-blue">Responder Demanda</h2>
      </div>
    </div>
  );
};

export default RespostaFormHeader;
