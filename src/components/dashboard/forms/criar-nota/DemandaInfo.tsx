
import React from 'react';
import { Demand, ResponseQA } from './types';
import { Separator } from '@/components/ui/separator';
import DemandaMetadataSection from '../responder-demanda/components/sections/DemandaMetadataSection';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({ 
  selectedDemanda, 
  formattedResponses 
}) => {
  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Detalhes da Demanda</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">{selectedDemanda.titulo}</h3>
        
        <DemandaMetadataSection selectedDemanda={selectedDemanda} />
      </div>
      
      <Separator className="my-4" />
      
      {/* Resumo da demanda */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Resumo da Demanda</h3>
        <div className="bg-gray-50 p-4 rounded-md border">
          {selectedDemanda.resumo_situacao 
            ? selectedDemanda.resumo_situacao 
            : selectedDemanda.detalhes_solicitacao || "Sem detalhes fornecidos"}
        </div>
      </div>
      
      {/* Perguntas e Respostas */}
      {formattedResponses && formattedResponses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Respostas da Área Técnica</h3>
          <div className="space-y-4">
            {formattedResponses.map((qa, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md border">
                <p className="font-medium text-gray-700 mb-2">Pergunta: {qa.question}</p>
                <p className="text-gray-800">{qa.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Comentários adicionais */}
      {selectedDemanda.comentarios && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Comentários Adicionais</h3>
          <div className="bg-gray-50 p-4 rounded-md border">
            {selectedDemanda.comentarios}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandaInfo;
