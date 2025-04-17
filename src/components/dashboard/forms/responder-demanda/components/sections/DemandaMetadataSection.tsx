
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Calendar, Clock, BookOpen, MessageSquare, FileText, Briefcase, Building, Map } from 'lucide-react';
import { renderIcon } from '@/components/settings/problems/renderIcon';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demanda } from '../../types';

interface DemandaMetadataSectionProps {
  selectedDemanda: Demanda;
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
      {/* Campos de metadados em grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
        
        {/* Coordenação */}
        {selectedDemanda.coordenacao && (
          <div className="flex items-start gap-2 text-gray-700">
            <Building className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Coordenação:</span>
              <p className="font-medium">{selectedDemanda.coordenacao.descricao || 'Não informada'}</p>
            </div>
          </div>
        )}
        
        {/* Serviço */}
        {selectedDemanda.servico && (
          <div className="flex items-start gap-2 text-gray-700">
            <Briefcase className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Serviço:</span>
              <p className="font-medium">{selectedDemanda.servico.descricao || 'Não informado'}</p>
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
            <Map className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Distrito:</span>
              <p className="font-medium">{selectedDemanda.distrito.nome || 'Não informado'}</p>
            </div>
          </div>
        )}
        
        {/* Prazo para Resposta */}
        <div className="flex items-start gap-2 text-gray-700">
          <Clock className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-sm text-gray-500">Prazo para resposta:</span>
            <p className="font-medium">{selectedDemanda.prazo_resposta ? formatDateTime(selectedDemanda.prazo_resposta) : 'Não definido'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandaMetadataSection;
