
import React from 'react';
import { Info, FileText, AlertCircle, Calendar, Clock, Flag, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demanda } from '../types';
import { Separator } from '@/components/ui/separator';

interface DemandaInfoSectionProps {
  demanda: Demanda;
}

const DemandaInfoSection: React.FC<DemandaInfoSectionProps> = ({ demanda }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definido';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getPriorityText = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      default: return 'Baixa';
    }
  };

  return (
    <>
      <h3 className="text-base font-medium mb-3">Informações da Demanda</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-gray-600">
            <Info className="w-4 h-4 mr-1" />
            <span className="text-xs">Origem</span>
          </div>
          <span className="text-sm font-medium">
            {demanda.origens_demandas?.descricao || 'Não informado'}
          </span>
        </div>
        
        {demanda.protocolo && (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-gray-600">
              <FileText className="w-4 h-4 mr-1" />
              <span className="text-xs">Protocolo 156</span>
            </div>
            <span className="text-sm font-medium">{demanda.protocolo}</span>
          </div>
        )}
        
        {demanda.veiculo_imprensa && (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-gray-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">Veículo de Imprensa</span>
            </div>
            <span className="text-sm font-medium">{demanda.veiculo_imprensa}</span>
          </div>
        )}
        
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-xs">Data de Criação</span>
          </div>
          <span className="text-sm font-medium">
            {format(new Date(demanda.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>
        
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-xs">Prazo para Resposta</span>
          </div>
          <span className="text-sm font-medium">
            {demanda.prazo_resposta ? formatDate(demanda.prazo_resposta) : 'Não definido'}
          </span>
        </div>
        
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-gray-600">
            <Flag className="w-4 h-4 mr-1" />
            <span className="text-xs">Prioridade</span>
          </div>
          <span className={`text-sm font-medium ${
            demanda.prioridade === 'alta' ? 'text-red-600' : 
            demanda.prioridade === 'media' ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {getPriorityText(demanda.prioridade)}
          </span>
        </div>
      </div>

      {/* Localização */}
      {(demanda.endereco || demanda.bairro_id || demanda.distrito) && (
        <>
          <Separator className="my-4" />
          <div>
            <h3 className="text-base font-medium mb-3">Localização</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {demanda.endereco && (
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-xs">Endereço</span>
                  </div>
                  <span className="text-sm font-medium">{demanda.endereco}</span>
                </div>
              )}
              
              {demanda.bairros?.nome && (
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-xs">Bairro</span>
                  </div>
                  <span className="text-sm font-medium">
                    {demanda.bairros.nome}
                  </span>
                </div>
              )}

              {demanda.distrito && (
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-xs">Distrito</span>
                  </div>
                  <span className="text-sm font-medium">
                    {demanda.distrito?.nome}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DemandaInfoSection;
