import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DemandaHeader from './DemandaHeader';

interface RespostaFormHeaderProps {
  selectedDemanda: any;
  onBack: () => void;
}

const RespostaFormHeader: React.FC<RespostaFormHeaderProps> = ({ 
  selectedDemanda, 
  onBack 
}) => {
  const dataFormatada = selectedDemanda.horario_publicacao
    ? format(new Date(selectedDemanda.horario_publicacao), 'dd/MM/yyyy às HH:mm', { locale: ptBR })
    : 'Data não disponível';

  return (
    <>
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
        
        <div className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-xl shadow-sm">
          <span className="font-medium">Autor:</span> {selectedDemanda.autor?.nome_completo || 'Não informado'} · 
          <span className="ml-2 font-medium">Criado em:</span> {dataFormatada}
        </div>
      </div>
      
      <DemandaHeader demanda={selectedDemanda} />
    </>
  );
};

export default RespostaFormHeader;
