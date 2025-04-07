
import React, { useState } from 'react';
import { Demand, ResponseQA } from './types';
import { ChevronDown, ChevronUp, FileText, MessageCircle } from 'lucide-react';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({ 
  selectedDemanda, 
  formattedResponses 
}) => {
  const [isResponsesOpen, setIsResponsesOpen] = useState(true);
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);

  const toggleResponses = () => {
    setIsResponsesOpen(!isResponsesOpen);
  };

  const toggleComments = () => {
    setIsCommentsOpen(!isCommentsOpen);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {selectedDemanda.titulo}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Coordenação: </span>
            <span>{selectedDemanda.area_coordenacao?.descricao || 'Não informada'}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Status: </span>
            <span>{selectedDemanda.status}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Prioridade: </span>
            <span>{selectedDemanda.prioridade}</span>
          </div>
          
          {selectedDemanda.origem && (
            <div>
              <span className="font-medium text-gray-700">Origem: </span>
              <span>{selectedDemanda.origem.descricao}</span>
            </div>
          )}
          
          {selectedDemanda.detalhes_solicitacao && (
            <div className="col-span-2">
              <p className="font-medium text-gray-700 mb-1">Detalhes:</p>
              <p className="text-gray-600 whitespace-pre-wrap">{selectedDemanda.detalhes_solicitacao}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Responses Accordion */}
      {formattedResponses.length > 0 && (
        <div className="border rounded-md">
          <button
            onClick={toggleResponses}
            className="w-full flex items-center justify-between p-3 text-left font-medium bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Respostas</span>
            </div>
            {isResponsesOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          
          {isResponsesOpen && (
            <div className="p-4">
              <div className="space-y-4">
                {formattedResponses.map((item, index) => (
                  <div key={index} className="rounded border">
                    <div className="bg-gray-50 font-medium p-2 border-b">
                      {item.question}
                    </div>
                    <div className="p-3 whitespace-pre-wrap text-gray-600">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Comments Accordion */}
      {selectedDemanda.comentarios && selectedDemanda.comentarios.length > 0 && (
        <div className="border rounded-md">
          <button
            onClick={toggleComments}
            className="w-full flex items-center justify-between p-3 text-left font-medium bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>Comentários</span>
            </div>
            {isCommentsOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          
          {isCommentsOpen && (
            <div className="p-4">
              <div className="space-y-4">
                {selectedDemanda.comentarios.map((comentario, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <p className="whitespace-pre-wrap">{comentario.texto}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {comentario.autor} - {comentario.data}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DemandaInfo;
