
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, User } from 'lucide-react';
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
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
      <Button 
        onClick={onBack} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1 w-fit"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Voltar</span>
      </Button>
      
      <div className="flex flex-wrap gap-3">
        {(selectedDemanda?.autor?.nome_completo || selectedDemanda?.autor?.id) && (
          <div className="text-sm text-gray-600 flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
            <User className="h-3.5 w-3.5 text-gray-500" />
            <span className="font-medium">Autor:</span>{' '}
            {selectedDemanda.autor.nome_completo || 'ID: ' + selectedDemanda.autor.id}
          </div>
        )}
        
        {selectedDemanda?.horario_publicacao && (
          <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
            <span className="font-medium">Publicação:</span>{' '}
            {format(new Date(selectedDemanda.horario_publicacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RespostaFormHeader;
