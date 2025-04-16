
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Demand } from './types';
import { Loader2, Clock } from 'lucide-react';
import UnifiedFilterBar, { ViewMode } from '@/components/shared/unified-view/UnifiedFilterBar';
import { formatDistanceToNow, format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DemandaStatusBadge, PrioridadeBadge } from '@/components/ui/status-badge';

interface DemandaSelectionProps {
  filteredDemandas: Demand[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onDemandaSelect: (demandaId: string) => void;
  isLoading: boolean;
}

const DemandaSelection: React.FC<DemandaSelectionProps> = ({
  filteredDemandas,
  searchTerm,
  setSearchTerm,
  onDemandaSelect,
  isLoading
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Format relative time (like "Hoje, há 5 horas")
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const isDateToday = isToday(date);
    const relativeTime = formatDistanceToNow(date, { locale: ptBR, addSuffix: false });
    
    if (isDateToday) {
      return `Hoje, há ${relativeTime}`;
    } else {
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    }
  };
  
  // Format deadline date
  const formatDeadline = (dateString?: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd/MM HH:mm", { locale: ptBR });
  };
  
  // Get coordenação sigla
  const getCoordSigla = (demanda: Demand) => {
    const coordenacao = demanda.tema?.coordenacao?.sigla || 
                        demanda.problema?.coordenacao?.sigla || 
                        demanda.area_coordenacao?.descricao || '';
    
    return coordenacao;
  };
  
  return (
    <Card className="border border-gray-200 rounded-lg shadow-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Selecione uma Demanda</h3>
        
        <div className="mb-6">
          <UnifiedFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchPlaceholder="Buscar demanda por título..."
          />
          
          {isLoading ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className={`mt-4 ${viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-3'} max-h-96 overflow-y-auto`}>
              {filteredDemandas.length > 0 ? (
                filteredDemandas.map((demanda) => (
                  <div 
                    key={demanda.id}
                    className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => onDemandaSelect(demanda.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-800">{demanda.titulo}</h4>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(demanda.horario_publicacao)}
                      </span>
                    </div>
                    
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      {getCoordSigla(demanda)}
                    </div>
                    
                    <div className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {demanda.resumo_situacao || demanda.detalhes_solicitacao || 'Sem detalhes'}
                    </div>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex flex-wrap gap-1.5">
                        <PrioridadeBadge prioridade={demanda.prioridade || 'media'} size="sm" />
                        <DemandaStatusBadge status={demanda.status} showIcon={false} size="sm" />
                      </div>
                      
                      {demanda.prazo_resposta && (
                        <div className="text-xs font-medium flex items-center text-orange-600">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Prazo: {formatDeadline(demanda.prazo_resposta)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Nenhuma demanda respondida encontrada
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaSelection;
