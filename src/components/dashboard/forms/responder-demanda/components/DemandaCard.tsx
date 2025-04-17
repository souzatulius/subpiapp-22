
import React from 'react';
import { formatDistanceToNow, format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Demanda } from '../types';
import { DemandaStatusBadge, PrioridadeBadge } from '@/components/ui/status-badge';
import { Clock } from 'lucide-react';

interface DemandaCardProps {
  demanda: Demanda;
  isSelected: boolean;
  onClick: () => void;
}

const DemandaCard: React.FC<DemandaCardProps> = ({ demanda, isSelected, onClick }) => {
  // Format the deadline date (prazo_resposta)
  const formattedPrazo = demanda.prazo_resposta
    ? format(new Date(demanda.prazo_resposta), "dd/MM HH:mm", { locale: ptBR })
    : "";
    
  // Format the creation date as relative time
  const formatRelativeTime = () => {
    if (!demanda.horario_publicacao) return "";
    
    const date = new Date(demanda.horario_publicacao);
    const isDateToday = isToday(date);
    const relativeTime = formatDistanceToNow(date, { locale: ptBR, addSuffix: false });
    
    if (isDateToday) {
      return `Hoje, há ${relativeTime}`;
    } else {
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    }
  };
    
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
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-gray-800 line-clamp-2">{demanda.titulo || 'Sem título'}</h3>
          <div className="text-xs text-gray-500">
            {formatRelativeTime()}
          </div>
        </div>
        
        {coordenacaoSigla && (
          <div className="text-xs font-medium text-gray-500 mb-2">
            {coordenacaoSigla}
          </div>
        )}
        
        <div className="text-sm text-gray-600 line-clamp-2 mb-3">
          {demanda.resumo_situacao || demanda.detalhes_solicitacao || 'Sem detalhes'}
        </div>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-wrap gap-1.5">
            <PrioridadeBadge prioridade={demanda.prioridade} size="sm" />
            <DemandaStatusBadge status={demanda.status} showIcon={false} size="sm" />
          </div>
          
          {demanda.prazo_resposta && (
            <div className="text-xs font-medium flex items-center text-orange-600">
              <Clock className="h-3 w-3 mr-1" />
              <span>Prazo: {formattedPrazo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemandaCard;
