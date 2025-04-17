
import React, { useEffect, useState } from 'react';
import { Demand, ResponseQA } from './types';
import { Separator } from '@/components/ui/separator';
import DemandaMetadataSection from '../responder-demanda/components/sections/DemandaMetadataSection';
import { fetchDemandResponse } from '@/hooks/dashboard/forms/criar-nota/api/fetchDemandResponse';
import { PrioridadeBadge } from '@/components/ui/badges/prioridade-badge';
import { TemaBadge } from '@/components/ui/status-badge';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({ 
  selectedDemanda, 
  formattedResponses 
}) => {
  // Convert Demand to Demanda for compatibility with DemandaMetadataSection
  const demandaForMetadata = {
    ...selectedDemanda,
    prioridade: selectedDemanda.prioridade || 'media', // Default value for required field
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">{selectedDemanda.titulo}</h2>
        <div className="flex gap-2">
          {selectedDemanda.problema?.descricao && (
            <TemaBadge texto={selectedDemanda.problema.descricao} />
          )}
          <PrioridadeBadge prioridade={selectedDemanda.prioridade || 'media'} />
        </div>
      </div>
      
      <DemandaMetadataSection selectedDemanda={demandaForMetadata as any} />
      
      <Separator className="my-4" />
      
      {/* Resumo da demanda */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Resumo da Demanda</h3>
        <div className="bg-gray-50 p-4 rounded-md border">
          {selectedDemanda.resumo_situacao || 
           (selectedDemanda.detalhes_solicitacao && 
            selectedDemanda.detalhes_solicitacao
           ) || 
           "Sem detalhes fornecidos"}
        </div>
      </div>
      
      {/* Perguntas e Respostas */}
      {formattedResponses && formattedResponses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Respostas da Área Técnica</h3>
          <div className="space-y-4">
            {formattedResponses.map((qa, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md border">
                <p className="font-medium text-gray-700 mb-2">{qa.question}</p>
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
