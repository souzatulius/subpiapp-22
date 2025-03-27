
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Calendar, Clock, BookOpen, MessageSquare } from 'lucide-react';

interface DemandaMetadataSectionProps {
  selectedDemanda: any;
  currentProblem: any;
}

const DemandaMetadataSection: React.FC<DemandaMetadataSectionProps> = ({
  selectedDemanda,
  currentProblem
}) => {
  const formattedDateTime = selectedDemanda.prazo_resposta ? 
    new Date(selectedDemanda.prazo_resposta).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Não definido';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {currentProblem && (
          <Badge className="px-3 py-1.5 bg-blue-50 text-subpi-blue border border-blue-100">
            {currentProblem.descricao}
          </Badge>
        )}
        
        <Badge 
          className={`px-3 py-1.5 ${
            selectedDemanda.prioridade === 'alta' ? 'bg-red-50 text-red-700 border border-red-200' : 
            selectedDemanda.prioridade === 'media' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
            'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          Prioridade: {
            selectedDemanda.prioridade === 'alta' ? 'Alta' : 
            selectedDemanda.prioridade === 'media' ? 'Média' : 'Baixa'
          }
        </Badge>
        
        {selectedDemanda.status && (
          <Badge className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5">
            Status: {selectedDemanda.status}
          </Badge>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-subpi-blue">{selectedDemanda.titulo || 'Sem título definido'}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {selectedDemanda.endereco && (
            <div className="flex items-start gap-2 text-gray-700">
              <MapPin className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <span>{selectedDemanda.endereco}</span>
            </div>
          )}
          
          {selectedDemanda.autor?.nome_completo && (
            <div className="flex items-start gap-2 text-gray-700">
              <User className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-gray-500">Autor:</span>
                <p className="font-medium">{selectedDemanda.autor.nome_completo}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-gray-700">
            <Calendar className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-sm text-gray-500">Criado em:</span>
              <p className="font-medium">{new Date(selectedDemanda.horario_publicacao).toLocaleDateString('pt-BR')} às {new Date(selectedDemanda.horario_publicacao).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
          
          {selectedDemanda.prazo_resposta && (
            <div className="flex items-start gap-2 text-gray-700">
              <Clock className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-gray-500">Prazo para resposta:</span>
                <p className="font-medium">{formattedDateTime}</p>
              </div>
            </div>
          )}
          
          {selectedDemanda.origem && (
            <div className="flex items-start gap-2 text-gray-700">
              <BookOpen className="h-5 w-5 text-subpi-blue flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-gray-500">Origem:</span>
                <p className="font-medium">{selectedDemanda.origem.descricao || 'Não informado'}</p>
              </div>
            </div>
          )}
          
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
    </div>
  );
};

export default DemandaMetadataSection;
