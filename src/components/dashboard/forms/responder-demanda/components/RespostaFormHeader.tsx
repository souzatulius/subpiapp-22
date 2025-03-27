
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
    <div className="flex items-center gap-4 mb-4">
      <Button 
        onClick={onBack} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Voltar</span>
      </Button>
    </div>
  );
};

export default RespostaFormHeader;
