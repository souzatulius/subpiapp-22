import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Calendar, Clock, BookOpen, MessageSquare } from 'lucide-react';
import { renderIcon } from '@/components/settings/problems/renderIcon';
interface DemandaMetadataSectionProps {
  selectedDemanda: any;
}
const DemandaMetadataSection: React.FC<DemandaMetadataSectionProps> = ({
  selectedDemanda
}) => {
  const formattedDateTime = selectedDemanda.prazo_resposta ? new Date(selectedDemanda.prazo_resposta).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Não definido';
  return <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {selectedDemanda.tema && <Badge className="px-3 py-1.5 flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
            <span className="flex-shrink-0">
              {renderIcon(selectedDemanda.tema.icone)}
            </span>
            {selectedDemanda.tema.descricao || 'Tema não definido'}
          </Badge>}
        
        {selectedDemanda.problema && <Badge className="px-3 py-1.5 flex items-center gap-2 bg-blue-50 text-subpi-blue border border-blue-100 rounded-full">
            <span className="flex-shrink-0">
              {renderIcon(selectedDemanda.problema.icone)}
            </span>
            {selectedDemanda.problema.descricao || selectedDemanda.problema}
          </Badge>}
        
        <Badge className={`px-3 py-1.5 rounded-full ${selectedDemanda.prioridade === 'alta' ? 'bg-red-50 text-red-700 border border-red-200' : selectedDemanda.prioridade === 'media' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          Prioridade: {selectedDemanda.prioridade === 'alta' ? 'Alta' : selectedDemanda.prioridade === 'media' ? 'Média' : 'Baixa'}
        </Badge>
        
        {selectedDemanda.status && <Badge className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full">
            Status: {selectedDemanda.status}
          </Badge>}
      </div>
      
      <h3 className="text-xl font-semibold text-subpi-blue py-[18px]">{selectedDemanda.titulo || 'Sem título definido'}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {selectedDemanda.endereco && <div className="flex items-start gap-2 text-gray-700">
              <MapPin className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <span className="font-medium">{selectedDemanda.endereco}</span>
            </div>}
          
          {selectedDemanda.bairro && <div className="flex items-start gap-2 text-gray-700">
              <MapPin className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-gray-500">Bairro:</span>
                <p className="font-medium">{selectedDemanda.bairro.nome || selectedDemanda.bairro}</p>
              </div>
            </div>}
          
          {selectedDemanda.distrito && <div className="flex items-start gap-2 text-gray-700">
              <MapPin className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-gray-500">Distrito:</span>
                <p className="font-medium">{selectedDemanda.distrito.nome || selectedDemanda.distrito}</p>
              </div>
            </div>}
          
          {selectedDemanda.protocolo && <div className="flex items-start gap-2 text-gray-700">
              <MapPin className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-gray-500">Protocolo:</span>
                <p className="font-medium">{selectedDemanda.protocolo}</p>
              </div>
            </div>}
          
          {selectedDemanda.autor?.nome_completo && <div className="flex items-start gap-2 text-gray-700">
              <User className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-gray-500">Autor:</span>
                <p className="font-medium">{selectedDemanda.autor.nome_completo}</p>
              </div>
            </div>}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-gray-700">
            <Calendar className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Criado em:</span>
              <p className="font-medium">{new Date(selectedDemanda.horario_publicacao).toLocaleDateString('pt-BR')} às {new Date(selectedDemanda.horario_publicacao).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
          
          {selectedDemanda.prazo_resposta && <div className="flex items-start gap-2 text-gray-700">
              <Clock className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-gray-500">Prazo para resposta:</span>
                <p className="font-medium">{formattedDateTime}</p>
              </div>
            </div>}
          
          {selectedDemanda.origem && <div className="flex items-start gap-2 text-gray-700">
              <BookOpen className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-gray-500">Origem:</span>
                <p className="font-medium">{selectedDemanda.origem.descricao || 'Não informado'}</p>
              </div>
            </div>}
          
          {selectedDemanda.veiculo_imprensa && <div className="flex items-start gap-2 text-gray-700">
              <MessageSquare className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-gray-500">Veículo:</span>
                <p className="font-medium">{selectedDemanda.veiculo_imprensa}</p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default DemandaMetadataSection;