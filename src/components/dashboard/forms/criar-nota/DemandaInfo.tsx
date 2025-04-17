
import React from 'react';
import { Demand, ResponseQA } from './types';
import { Separator } from '@/components/ui/separator';
import { PrioridadeBadge } from '@/components/ui/badges/prioridade-badge';
import { TemaBadge } from '@/components/ui/badges/tema-badge';
import { formatDateWithTime } from '@/lib/dateUtils';
import { Clock, FileText, MapPin, Building, Newspaper } from 'lucide-react';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({ 
  selectedDemanda, 
  formattedResponses 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-xl font-semibold">{selectedDemanda.titulo}</h2>
        <div className="flex gap-2">
          {selectedDemanda.problema?.descricao && (
            <TemaBadge texto={selectedDemanda.problema.descricao} />
          )}
          <PrioridadeBadge prioridade={selectedDemanda.prioridade || 'media'} />
        </div>
      </div>
      
      {/* Data de criação com autor */}
      <div className="text-sm text-gray-500 mb-1">
        Criado por {selectedDemanda.autor?.nome_completo || 'Usuário'} em {formatDateWithTime(selectedDemanda.horario_publicacao)}
      </div>
      
      {/* Coordenação como subtítulo */}
      {selectedDemanda.coordenacao && (
        <h3 className="text-sm font-medium text-gray-600 mb-4">
          {selectedDemanda.coordenacao.sigla || selectedDemanda.coordenacao.descricao || 'Coordenação não informada'}
        </h3>
      )}
      
      {/* Custom metadata section with only the requested fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
        {selectedDemanda.prazo_resposta && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-orange-500" />
            <span className="text-gray-600 mr-2">Prazo:</span>
            <span className="font-medium text-orange-600">{formatDateWithTime(selectedDemanda.prazo_resposta)}</span>
          </div>
        )}
        
        {selectedDemanda.servico?.descricao && (
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-600 mr-2">Serviço:</span>
            <span className="font-medium">{selectedDemanda.servico.descricao}</span>
          </div>
        )}
        
        {selectedDemanda.endereco && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-600 mr-2">Endereço:</span>
            <span className="font-medium">{selectedDemanda.endereco}</span>
          </div>
        )}
        
        {selectedDemanda.bairros?.nome && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-600 mr-2">Bairro:</span>
            <span className="font-medium">{selectedDemanda.bairros.nome}</span>
          </div>
        )}
        
        {selectedDemanda.bairros?.distritos?.nome && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-600 mr-2">Distrito:</span>
            <span className="font-medium">{selectedDemanda.bairros.distritos.nome}</span>
          </div>
        )}
        
        {selectedDemanda.veiculo_imprensa && (
          <div className="flex items-center">
            <Newspaper className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-600 mr-2">Veículo de Comunicação:</span>
            <span className="font-medium">{selectedDemanda.veiculo_imprensa}</span>
          </div>
        )}
      </div>
      
      <Separator className="my-4" />
      
      {/* Resumo da demanda */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Resumo da Demanda</h3>
        <div className="bg-gray-50 p-4 rounded-xl border">
          {selectedDemanda.resumo_situacao || 
           selectedDemanda.detalhes_solicitacao || 
           "Sem detalhes fornecidos"}
        </div>
      </div>
      
      {/* Perguntas e Respostas */}
      {formattedResponses && formattedResponses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Respostas da Área Técnica</h3>
          <div className="space-y-4">
            {formattedResponses.map((qa, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl border">
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
          <div className="bg-gray-50 p-4 rounded-xl border">
            {selectedDemanda.comentarios}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandaInfo;
