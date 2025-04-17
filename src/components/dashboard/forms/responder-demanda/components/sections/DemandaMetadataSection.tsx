
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, FileText } from 'lucide-react';
import { formatDate, formatDateWithTime } from '@/lib/dateUtils';
import { cn } from '@/utils/cn';
import { Demanda } from '../../types';

interface DemandaMetadataSectionProps {
  selectedDemanda: Demanda;
}

const DemandaMetadataSection: React.FC<DemandaMetadataSectionProps> = ({ selectedDemanda }) => {
  const isPastDeadline = selectedDemanda.prazo_resposta 
    ? new Date(selectedDemanda.prazo_resposta) < new Date() 
    : false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Data de Criação</p>
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
          <p className="font-medium">
            {selectedDemanda.horario_publicacao 
              ? formatDateWithTime(selectedDemanda.horario_publicacao) 
              : 'Não especificado'}
          </p>
        </div>
      </div>

      <div className={`bg-gray-50 p-3 rounded-xl border ${isPastDeadline ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
        <p className={`text-sm ${isPastDeadline ? 'text-red-500 font-medium' : 'text-gray-500'} mb-1`}>
          Prazo para resposta
        </p>
        <div className="flex items-center">
          <Clock className={`h-4 w-4 mr-2 ${isPastDeadline ? 'text-red-500' : 'text-gray-400'}`} />
          <p className={`font-medium ${isPastDeadline ? 'text-red-600' : ''}`}>
            {selectedDemanda.prazo_resposta 
              ? formatDateWithTime(selectedDemanda.prazo_resposta)
              : 'Não especificado'}
          </p>
        </div>
      </div>

      {selectedDemanda.coordenacao && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Coordenação</p>
          <p className="font-medium">
            {selectedDemanda.coordenacao.sigla 
              ? `${selectedDemanda.coordenacao.sigla} - ${selectedDemanda.coordenacao.descricao}`
              : selectedDemanda.coordenacao.descricao}
          </p>
        </div>
      )}

      {selectedDemanda.servico && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Serviço</p>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-400" />
            <p className="font-medium">{selectedDemanda.servico.descricao}</p>
          </div>
        </div>
      )}

      {selectedDemanda.bairros && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Bairro</p>
          <p className="font-medium">{selectedDemanda.bairros.nome}</p>
        </div>
      )}

      {selectedDemanda.distrito && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Distrito</p>
          <p className="font-medium">{selectedDemanda.distrito.nome}</p>
        </div>
      )}

      {selectedDemanda.endereco && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 md:col-span-2">
          <p className="text-sm text-gray-500 mb-1">Endereço</p>
          <p className="font-medium">{selectedDemanda.endereco}</p>
        </div>
      )}
    </div>
  );
};

export default DemandaMetadataSection;
