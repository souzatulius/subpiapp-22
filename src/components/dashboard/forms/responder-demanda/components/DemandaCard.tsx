
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demanda } from '../types';
import { DemandaStatusBadge, PrioridadeBadge } from '@/components/ui/status-badge';

interface DemandaCardProps {
  demanda: Demanda;
  isSelected: boolean;
  onClick: () => void;
}

const DemandaCard: React.FC<DemandaCardProps> = ({ demanda, isSelected, onClick }) => {
  // Format the date
  const formattedDate = demanda.horario_publicacao
    ? format(new Date(demanda.horario_publicacao), "dd/MM/yyyy", { locale: ptBR })
    : "";
    
  // Get the coordenação name/sigla
  const coordenacaoSigla = demanda.tema?.coordenacao?.sigla || 
                          demanda.problema?.coordenacao?.sigla || 
                          (demanda.coordenacao?.sigla || '');

  return (
    <div 
      className={`
        p-4 rounded-xl border ${isSelected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'} 
        hover:bg-gray-50 transition-colors duration-150 cursor-pointer 
        bg-white shadow-sm
      `}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-800 line-clamp-2">{demanda.titulo || 'Sem título'}</h3>
          <div className="flex flex-shrink-0 gap-2 ml-2">
            <PrioridadeBadge prioridade={demanda.prioridade} size="sm" />
          </div>
        </div>
        
        <div className="text-sm text-gray-600 line-clamp-2 mb-3">
          {demanda.detalhes_solicitacao || 'Sem detalhes'}
        </div>
        
        <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            {coordenacaoSigla && (
              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded mr-2">
                {coordenacaoSigla}
              </span>
            )}
            <span>{demanda.autor?.nome_completo || 'Usuário'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{formattedDate}</span>
            <DemandaStatusBadge status={demanda.status} showIcon={false} size="xs" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandaCard;
