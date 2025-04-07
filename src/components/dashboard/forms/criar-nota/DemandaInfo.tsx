
import React from 'react';
import { Info, FileText, MapPin, Calendar, User, Phone, Mail, Clock, Tag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Demand, ResponseQA } from '@/types/demand';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({ 
  selectedDemanda,
  formattedResponses
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 text-[#003570] mt-0.5" />
        <div>
          <h3 className="font-medium text-lg text-[#003570]">Informações da Demanda</h3>
          <p className="text-sm text-gray-500">
            {selectedDemanda.supervisao_tecnica?.descricao || selectedDemanda.area_coordenacao?.descricao || 'Área não especificada'}
          </p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border border-gray-200">
        {/* Título e área */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <FileText className="h-4 w-4 text-[#003570] mr-2" />
            <h4 className="font-medium text-[#003570]">Título da Demanda</h4>
          </div>
          <p className="ml-6">{selectedDemanda.titulo}</p>
        </div>
        
        {/* Localização */}
        {(selectedDemanda.endereco || selectedDemanda.bairro) && (
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 text-[#003570] mr-2" />
              <h4 className="font-medium text-[#003570]">Localização</h4>
            </div>
            <p className="ml-6">
              {selectedDemanda.endereco && `${selectedDemanda.endereco}, `}
              {selectedDemanda.bairro?.nome}
            </p>
          </div>
        )}
        
        {/* Prazo e status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 text-[#003570] mr-2" />
              <h4 className="font-medium text-[#003570]">Prazo</h4>
            </div>
            <p className="ml-6">{formatDate(selectedDemanda.prazo_resposta)}</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-[#003570] mr-2" />
              <h4 className="font-medium text-[#003570]">Status</h4>
            </div>
            <p className="ml-6 capitalize">{selectedDemanda.status?.replace('_', ' ')}</p>
          </div>
        </div>
        
        {/* Informações do solicitante */}
        {selectedDemanda.nome_solicitante && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center mb-3">
              <User className="h-4 w-4 text-[#003570] mr-2" />
              <h4 className="font-medium text-[#003570]">Informações do Solicitante</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p>{selectedDemanda.nome_solicitante}</p>
              </div>
              {selectedDemanda.telefone_solicitante && (
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <div className="flex items-center">
                    <Phone className="h-3.5 w-3.5 text-gray-400 mr-1" />
                    <p>{selectedDemanda.telefone_solicitante}</p>
                  </div>
                </div>
              )}
              {selectedDemanda.email_solicitante && (
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <div className="flex items-center">
                    <Mail className="h-3.5 w-3.5 text-gray-400 mr-1" />
                    <p>{selectedDemanda.email_solicitante}</p>
                  </div>
                </div>
              )}
              {selectedDemanda.veiculo_imprensa && (
                <div>
                  <p className="text-sm text-gray-500">Veículo de Imprensa</p>
                  <p>{selectedDemanda.veiculo_imprensa}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detalhes da solicitação */}
        {selectedDemanda.detalhes_solicitacao && (
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FileText className="h-4 w-4 text-[#003570] mr-2" />
              <h4 className="font-medium text-[#003570]">Detalhes da Solicitação</h4>
            </div>
            <p className="ml-6 whitespace-pre-line bg-white p-3 rounded-lg border border-gray-200">
              {selectedDemanda.detalhes_solicitacao}
            </p>
          </div>
        )}
        
        {/* Perguntas */}
        {selectedDemanda.perguntas && Object.keys(selectedDemanda.perguntas).length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 text-[#003570] mr-2" />
              <h4 className="font-medium text-[#003570]">Perguntas</h4>
            </div>
            <div className="space-y-2 ml-6">
              {Object.entries(selectedDemanda.perguntas).map(([key, question]) => (
                <div key={key} className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="font-medium">{String(question)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Respostas */}
        {formattedResponses.length > 0 && (
          <div>
            <div className="flex items-center mb-3">
              <FileText className="h-4 w-4 text-[#003570] mr-2" />
              <h4 className="font-medium text-[#003570]">Respostas</h4>
            </div>
            <div className="space-y-3 ml-6">
              {formattedResponses.map((resp, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="font-medium">{resp.question}</p>
                  <Separator className="my-2" />
                  <p className="text-gray-700">{resp.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandaInfo;
