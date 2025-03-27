
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
  console.log('RespostaFormHeader - selectedDemanda:', selectedDemanda);
  
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
      
      {selectedDemanda?.autor?.nome_completo && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Autor:</span>{' '}
          {selectedDemanda.autor.nome_completo}
        </div>
      )}
    </div>
  );
};

export default RespostaFormHeader;
