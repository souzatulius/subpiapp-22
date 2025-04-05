
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Calendar, Clock, BookOpen, MessageSquare, FileText } from 'lucide-react';
import { renderIcon } from '@/components/settings/problems/renderIcon';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DemandaMetadataSectionProps {
  selectedDemanda: any;
}

const DemandaMetadataSection: React.FC<DemandaMetadataSectionProps> = ({
  selectedDemanda
}) => {
  // Format date for better display
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Não definido';
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {selectedDemanda.tema && <Badge className="px-3 py-1.5 flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
            <span className="flex-shrink-0">
              {renderIcon(selectedDemanda.tema.icone)}
            </span>
            {selectedDemanda.tema.descricao || 'Tema não definido'}
          </Badge>}
        
        <Badge className={`px-3 py-1.5 rounded-full ${selectedDemanda.prioridade === 'alta' ? 'bg-orange-50 text-orange-700 border border-orange-200' : selectedDemanda.prioridade === 'media' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          Prioridade: {selectedDemanda.prioridade === 'alta' ? 'Alta' : selectedDemanda.prioridade === 'media' ? 'Média' : 'Baixa'}
        </Badge>
        
        {selectedDemanda.status && <Badge className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full">
            Status: {selectedDemanda.status}
          </Badge>}
      </div>
      
      <h3 className="text-xl font-semibold text-subpi-blue py-[18px]">{selectedDemanda.titulo || 'Sem título definido'}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Autor */}
        {selectedDemanda.autor?.nome_completo && (
          <div className="flex items-start gap-2 text-gray-700">
            <User className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Autor:</span>
              <p className="font-medium">{selectedDemanda.autor.nome_completo}</p>
            </div>
          </div>
        )}
        
        {/* Endereço */}
        {selectedDemanda.endereco && (
          <div className="flex items-start gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Endereço:</span>
              <p className="font-medium">{selectedDemanda.endereco}</p>
            </div>
          </div>
        )}
        
        {/* Bairro */}
        {selectedDemanda.bairros && (
          <div className="flex items-start gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Bairro:</span>
              <p className="font-medium">{selectedDemanda.bairros.nome || 'Não informado'}</p>
            </div>
          </div>
        )}
        
        {/* Distrito */}
        {selectedDemanda.distrito && (
          <div className="flex items-start gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Distrito:</span>
              <p className="font-medium">{selectedDemanda.distrito.nome || 'Não informado'}</p>
            </div>
          </div>
        )}
        
        {/* Data de Criação */}
        <div className="flex items-start gap-2 text-gray-700">
          <Calendar className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-sm text-gray-500">Criado em:</span>
            <p className="font-medium">{formatDateTime(selectedDemanda.horario_publicacao)}</p>
          </div>
        </div>
        
        {/* Prazo para Resposta */}
        <div className="flex items-start gap-2 text-gray-700">
          <Clock className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-sm text-gray-500">Prazo para resposta:</span>
            <p className="font-medium">{selectedDemanda.prazo_resposta ? formatDateTime(selectedDemanda.prazo_resposta) : 'Não definido'}</p>
          </div>
        </div>
        
        {/* Protocolo 156 */}
        <div className="flex items-start gap-2 text-gray-700">
          <FileText className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-sm text-gray-500">Protocolo 156:</span>
            <p className="font-medium">{selectedDemanda.protocolo || 'Não há protocolo'}</p>
          </div>
        </div>
        
        {/* Origem */}
        {selectedDemanda.origens_demandas && (
          <div className="flex items-start gap-2 text-gray-700">
            <BookOpen className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Origem:</span>
              <p className="font-medium">{selectedDemanda.origens_demandas.descricao || 'Não informado'}</p>
            </div>
          </div>
        )}
        
        {/* Veículo de Imprensa */}
        {selectedDemanda.veiculo_imprensa && (
          <div className="flex items-start gap-2 text-gray-700">
            <MessageSquare className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Veículo:</span>
              <p className="font-medium">{selectedDemanda.veiculo_imprensa}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandaMetadataSection;
