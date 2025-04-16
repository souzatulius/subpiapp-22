
import React, { useEffect, useState } from 'react';
import { Demand, ResponseQA } from './types';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, FileText, MapPin, MessageSquare, Tag } from 'lucide-react';
import { DemandaStatusBadge, PrioridadeBadge, TemaBadge } from '@/components/ui/status-badge';
import { fetchDemandResponse } from '@/hooks/dashboard/forms/criar-nota/api/fetchDemandResponse';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({ 
  selectedDemanda, 
  formattedResponses 
}) => {
  const [comments, setComments] = useState<string | null>(null);

  useEffect(() => {
    // Fetch response comments when a demand is selected
    const getResponseComments = async () => {
      if (selectedDemanda?.id) {
        const { comments } = await fetchDemandResponse(selectedDemanda.id);
        setComments(comments);
      }
    };
    
    getResponseComments();
  }, [selectedDemanda?.id]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definida';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };
  
  // Get coordenação sigla
  const getCoordSigla = () => {
    return selectedDemanda.tema?.coordenacao?.sigla || 
           selectedDemanda.problema?.coordenacao?.sigla || 
           selectedDemanda.area_coordenacao?.descricao || 'Não informada';
  };
  
  // Get tema description
  const getTema = () => {
    return selectedDemanda.tema?.descricao || 'Não informado';
  };
  
  // Get serviço description
  const getServico = () => {
    return selectedDemanda.servico?.descricao || 'Não informado';
  };

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Detalhes da Demanda</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">{selectedDemanda.titulo}</h3>
        
        <div className="text-sm font-medium text-gray-500 mb-3">
          {getCoordSigla()}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {getTema() !== 'Não informado' && <TemaBadge texto={getTema()} />}
          <PrioridadeBadge prioridade={selectedDemanda.prioridade || 'media'} />
          <DemandaStatusBadge status={selectedDemanda.status} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-xs">Data de Criação</span>
            </div>
            <span className="text-sm font-medium">
              {formatDate(selectedDemanda.horario_publicacao)}
            </span>
          </div>
          
          {getServico() !== 'Não informado' && (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-600">
                <Tag className="w-4 h-4 mr-1" />
                <span className="text-xs">Serviço</span>
              </div>
              <span className="text-sm font-medium">{getServico()}</span>
            </div>
          )}
          
          {selectedDemanda.protocolo && (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-600">
                <FileText className="w-4 h-4 mr-1" />
                <span className="text-xs">Protocolo 156</span>
              </div>
              <span className="text-sm font-medium">{selectedDemanda.protocolo}</span>
            </div>
          )}
          
          {selectedDemanda.prazo_resposta && (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-xs">Prazo para Resposta</span>
              </div>
              <span className="text-sm font-medium">
                {formatDate(selectedDemanda.prazo_resposta)}
              </span>
            </div>
          )}
          
          {selectedDemanda.endereco && (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-xs">Endereço</span>
              </div>
              <span className="text-sm font-medium">{selectedDemanda.endereco}</span>
            </div>
          )}
        </div>
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
      
      {/* Comentários da Área Técnica */}
      {comments && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Comentários da Área Técnica</h3>
          <div className="bg-gray-50 p-4 rounded-md border">
            <p className="whitespace-pre-line">{comments}</p>
          </div>
        </div>
      )}
      
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
      
      {/* Comentários adicionais - mostrar apenas um campo */}
      {selectedDemanda.comentarios && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            Comentários Adicionais
          </h3>
          <div className="bg-gray-50 p-4 rounded-md border">
            {selectedDemanda.comentarios}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandaInfo;
