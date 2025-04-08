
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demand, ResponseQA } from './types';
import { DemandaStatusBadge } from '@/components/ui/status-badge';
import { formatPriority } from '@/utils/priorityUtils';
import { 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Newspaper, 
  FileText, 
  Tag,
  MessageSquare,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Data não informada';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  } catch (e) {
    return 'Data inválida';
  }
};

const DemandaInfo: React.FC<DemandaInfoProps> = ({ selectedDemanda, formattedResponses }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-semibold">{selectedDemanda.titulo}</h2>
        <div className="flex items-center gap-2">
          <DemandaStatusBadge status={selectedDemanda.status} />
          
          {selectedDemanda.prioridade && (
            <Badge 
              variant="outline" 
              className={`font-medium ${
                selectedDemanda.prioridade === 'alta' ? 'bg-red-50 text-red-700 border-red-200' : 
                selectedDemanda.prioridade === 'media' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                'bg-green-50 text-green-700 border-green-200'
              }`}
            >
              Prioridade: {formatPriority(selectedDemanda.prioridade)}
            </Badge>
          )}
        </div>
      </div>

      {/* Informações Gerais */}
      <Card className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tema/Problema e Serviço */}
          <div className="flex items-start gap-2">
            <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-700">Tema/Problema</h4>
              <p className="text-sm text-gray-600">
                {selectedDemanda.problema?.descricao || selectedDemanda.area_coordenacao?.descricao || 'Não informado'}
              </p>
            </div>
          </div>
          
          {selectedDemanda.servico && (
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-700">Serviço</h4>
                <p className="text-sm text-gray-600">{selectedDemanda.servico.descricao}</p>
              </div>
            </div>
          )}
          
          {/* Protocolo e Prazo */}
          {selectedDemanda.protocolo && (
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-700">Protocolo</h4>
                <p className="text-sm text-gray-600">{selectedDemanda.protocolo}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-700">Prazo para Resposta</h4>
              <p className="text-sm text-gray-600 font-medium">
                {formatDate(selectedDemanda.prazo_resposta)}
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Tipo de Mídia e Veículo */}
      {(selectedDemanda.tipo_midia || selectedDemanda.veiculo_imprensa) && (
        <Card className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-amber-600" /> Informações de Mídia
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDemanda.tipo_midia && (
              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-700">Tipo de Mídia</h4>
                  <p className="text-sm text-gray-600">{selectedDemanda.tipo_midia.descricao}</p>
                </div>
              </div>
            )}
            {selectedDemanda.veiculo_imprensa && (
              <div className="flex items-start gap-2">
                <Newspaper className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-700">Veículo de Imprensa</h4>
                  <p className="text-sm text-gray-600">{selectedDemanda.veiculo_imprensa}</p>
                </div>
              </div>
            )}
            {selectedDemanda.origem && (
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-700">Origem</h4>
                  <p className="text-sm text-gray-600">{selectedDemanda.origem.descricao}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-700">Status</h4>
                <p className="text-sm text-gray-600">
                  {selectedDemanda.status === 'respondida' ? 'Respondida' : 
                   selectedDemanda.status === 'aguardando_nota' ? 'Aguardando Nota' : 
                   selectedDemanda.status}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Localização */}
      {(selectedDemanda.endereco || selectedDemanda.bairro) && (
        <Card className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" /> Localização
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDemanda.endereco && (
              <div>
                <p className="text-sm text-gray-500">Endereço: {selectedDemanda.endereco}</p>
              </div>
            )}
            {selectedDemanda.bairro && (
              <div>
                <p className="text-sm text-gray-500">Bairro: {selectedDemanda.bairro.nome}</p>
              </div>
            )}
            {selectedDemanda.bairro?.distritos && (
              <div>
                <p className="text-sm text-gray-500">Distrito: {selectedDemanda.bairro.distritos.nome}</p>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Informações do Solicitante */}
      {(selectedDemanda.nome_solicitante || selectedDemanda.email_solicitante || selectedDemanda.telefone_solicitante || selectedDemanda.veiculo_imprensa) && (
        <Card className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" /> Informações do Solicitante
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDemanda.nome_solicitante && (
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-gray-500 mt-0.5" />
                <p className="text-sm text-gray-600">{selectedDemanda.nome_solicitante}</p>
              </div>
            )}
            {selectedDemanda.email_solicitante && (
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                <p className="text-sm text-gray-600">{selectedDemanda.email_solicitante}</p>
              </div>
            )}
            {selectedDemanda.telefone_solicitante && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                <p className="text-sm text-gray-600">{selectedDemanda.telefone_solicitante}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Detalhes da Solicitação */}
      {selectedDemanda.detalhes_solicitacao && (
        <Card className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="font-medium mb-2">Detalhes da Solicitação</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedDemanda.detalhes_solicitacao}</p>
        </Card>
      )}
      
      {/* Perguntas e Respostas */}
      {formattedResponses.length > 0 && (
        <Card className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" /> Perguntas e Respostas
          </h4>
          <div className="space-y-3">
            {formattedResponses.map((item, index) => (
              <div key={index} className="space-y-1">
                <p className="font-medium text-blue-800">{item.question}</p>
                <p className="text-gray-700 bg-white p-3 rounded-lg border border-blue-100 ml-4">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DemandaInfo;
