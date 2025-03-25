
import React from 'react';
import { Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Demand, ResponseQA } from '@/types/demand';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({ 
  selectedDemanda,
  formattedResponses
}) => {
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="font-medium text-lg">Informações da Demanda</h3>
          <p className="text-sm text-gray-500">
            {selectedDemanda.supervisao_tecnica?.descricao || 'Área não especificada'}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-medium">Título da Demanda</h4>
        <p>{selectedDemanda.titulo}</p>
      </div>

      {selectedDemanda.detalhes_solicitacao && (
        <div>
          <h4 className="font-medium">Detalhes da Solicitação</h4>
          <p className="whitespace-pre-line">{selectedDemanda.detalhes_solicitacao}</p>
        </div>
      )}
      
      {selectedDemanda.perguntas && Object.keys(selectedDemanda.perguntas).length > 0 && (
        <div>
          <h4 className="font-medium">Perguntas</h4>
          <div className="space-y-2 mt-2">
            {Object.entries(selectedDemanda.perguntas).map(([key, question]) => (
              <div key={key} className="bg-white p-3 rounded border">
                <p className="font-medium">{question}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {formattedResponses.length > 0 && (
        <div>
          <h4 className="font-medium">Respostas</h4>
          <div className="space-y-3 mt-2">
            {formattedResponses.map((resp, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <p className="font-medium">{resp.question}</p>
                <Separator className="my-2" />
                <p className="text-gray-700">{resp.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandaInfo;
