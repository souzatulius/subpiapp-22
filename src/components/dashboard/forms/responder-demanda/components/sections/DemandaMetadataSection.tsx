
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, FileText, MapPin, Building, User, Mail, Phone } from 'lucide-react';
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
      {selectedDemanda.horario_publicacao && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Data de Criação</p>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <p className="font-medium">
              {formatDateWithTime(selectedDemanda.horario_publicacao)}
            </p>
          </div>
        </div>
      )}

      {selectedDemanda.prazo_resposta && (
        <div className={`bg-gray-50 p-3 rounded-xl border ${isPastDeadline ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
          <p className={`text-sm ${isPastDeadline ? 'text-red-500 font-medium' : 'text-gray-500'} mb-1`}>
            Prazo para resposta
          </p>
          <div className="flex items-center">
            <Clock className={`h-4 w-4 mr-2 ${isPastDeadline ? 'text-red-500' : 'text-gray-400'}`} />
            <p className={`font-medium ${isPastDeadline ? 'text-red-600' : ''}`}>
              {formatDateWithTime(selectedDemanda.prazo_resposta)}
            </p>
          </div>
        </div>
      )}

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
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <p className="font-medium">{selectedDemanda.bairros.nome}</p>
          </div>
        </div>
      )}

      {selectedDemanda.distrito && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Distrito</p>
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-gray-400" />
            <p className="font-medium">{selectedDemanda.distrito.nome}</p>
          </div>
        </div>
      )}

      {selectedDemanda.endereco && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 md:col-span-2">
          <p className="text-sm text-gray-500 mb-1">Endereço</p>
          <p className="font-medium">{selectedDemanda.endereco}</p>
        </div>
      )}

      {selectedDemanda.nome_solicitante && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Solicitante</p>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <p className="font-medium">{selectedDemanda.nome_solicitante}</p>
          </div>
        </div>
      )}

      {selectedDemanda.email_solicitante && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">E-mail</p>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <p className="font-medium">{selectedDemanda.email_solicitante}</p>
          </div>
        </div>
      )}

      {selectedDemanda.telefone_solicitante && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Telefone</p>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            <p className="font-medium">{selectedDemanda.telefone_solicitante}</p>
          </div>
        </div>
      )}

      {selectedDemanda.origens_demandas && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Origem</p>
          <p className="font-medium">{selectedDemanda.origens_demandas.descricao}</p>
        </div>
      )}
      
      {selectedDemanda.protocolo && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Protocolo</p>
          <p className="font-medium">{selectedDemanda.protocolo}</p>
        </div>
      )}
    </div>
  );
};

export default DemandaMetadataSection;
