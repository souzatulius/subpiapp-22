
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock } from 'lucide-react';
import { formatDate, formatDateWithTime } from '@/lib/dateUtils';
import classNames from 'classnames';
import { Demanda } from '../../types';

interface DemandaMetadataSectionProps {
  selectedDemanda: Demanda;
}

const DemandaMetadataSection: React.FC<DemandaMetadataSectionProps> = ({ selectedDemanda }) => {
  const isPastDeadline = selectedDemanda.prazo_resposta 
    ? new Date(selectedDemanda.prazo_resposta) < new Date() 
    : false;

  const renderPrioridadeBadge = (prioridade: string) => {
    const badgeClasses = classNames("text-xs py-1", {
      "bg-red-100 text-red-800 hover:bg-red-200": prioridade === 'alta',
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200": prioridade === 'media',
      "bg-green-100 text-green-800 hover:bg-green-200": prioridade === 'baixa'
    });

    const badgeLabel = {
      'alta': 'Urgente',
      'media': 'Normal',
      'baixa': 'Baixa'
    }[prioridade] || prioridade;

    return (
      <Badge variant="outline" className={badgeClasses}>
        {badgeLabel}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Prioridade</p>
        <div>{renderPrioridadeBadge(selectedDemanda.prioridade)}</div>
      </div>

      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Origem</p>
        <p className="font-medium">
          {selectedDemanda.origens_demandas?.descricao || 'Não especificada'}
        </p>
      </div>

      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Publicado em</p>
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
          <p className="font-medium">
            {selectedDemanda.horario_publicacao 
              ? formatDateWithTime(selectedDemanda.horario_publicacao) 
              : 'Não especificado'}
          </p>
        </div>
      </div>

      <div className={`bg-gray-50 p-3 rounded-md border ${isPastDeadline ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
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

      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Protocolo</p>
        <p className="font-medium">
          {selectedDemanda.protocolo || 'Não possui protocolo'}
        </p>
      </div>

      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Mídia</p>
        <p className="font-medium">
          {selectedDemanda.tipo_midia?.descricao || 'Não especificado'}
        </p>
      </div>

      {selectedDemanda.veiculo_imprensa && (
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Veículo</p>
          <p className="font-medium">{selectedDemanda.veiculo_imprensa}</p>
        </div>
      )}

      {selectedDemanda.nome_solicitante && (
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Solicitante</p>
          <p className="font-medium">{selectedDemanda.nome_solicitante}</p>
        </div>
      )}

      {selectedDemanda.problema && (
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 md:col-span-2">
          <p className="text-sm text-gray-500 mb-1">Tema/Problema</p>
          <p className="font-medium">{selectedDemanda.problema.descricao}</p>
        </div>
      )}

      {selectedDemanda.coordenacao && (
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Coordenação</p>
          <p className="font-medium">
            {selectedDemanda.coordenacao.sigla 
              ? `${selectedDemanda.coordenacao.sigla} - ${selectedDemanda.coordenacao.descricao}`
              : selectedDemanda.coordenacao.descricao}
          </p>
        </div>
      )}

      {selectedDemanda.bairros && (
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Bairro</p>
          <p className="font-medium">{selectedDemanda.bairros.nome}</p>
        </div>
      )}

      {selectedDemanda.distrito && (
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Distrito</p>
          <p className="font-medium">{selectedDemanda.distrito.nome}</p>
        </div>
      )}

      {selectedDemanda.endereco && (
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 md:col-span-2">
          <p className="text-sm text-gray-500 mb-1">Endereço</p>
          <p className="font-medium">{selectedDemanda.endereco}</p>
        </div>
      )}
    </div>
  );
};

export default DemandaMetadataSection;
