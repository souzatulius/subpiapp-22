
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Demand } from '@/types/demand';
import { Loader2, Clock } from 'lucide-react';
import UnifiedFilterBar, { ViewMode } from '@/components/shared/unified-view/UnifiedFilterBar';
import { PrioridadeBadge } from '@/components/ui/badges/prioridade-badge';
import { TemaBadge } from '@/components/ui/badges/tema-badge';
import { CoordenacaoBadge } from '@/components/ui/badges/coordenacao-badge';
import { formatDateWithTime } from '@/lib/dateUtils';

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
  
  return (
    <Card className="border border-gray-200 rounded-xl shadow-sm">
      <CardContent className="p-6">
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
                    className={`p-3 border rounded-xl hover:bg-gray-50 cursor-pointer ${viewMode === 'cards' ? 'h-full' : ''}`}
                    onClick={() => onDemandaSelect(demanda.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{demanda.titulo}</div>
                    </div>
                    
                    {demanda.coordenacao && (
                      <div className="text-xs text-gray-500 mt-1">
                        {demanda.coordenacao.sigla || demanda.coordenacao.descricao || 'Coordenação não informada'}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {demanda.prioridade && (
                        <PrioridadeBadge prioridade={demanda.prioridade} size="xs" />
                      )}
                      {demanda.problema?.descricao && (
                        <TemaBadge texto={demanda.problema.descricao} size="xs" />
                      )}
                      {demanda.coordenacao?.descricao && (
                        <CoordenacaoBadge texto={demanda.coordenacao.sigla || demanda.coordenacao.descricao} size="xs" />
                      )}
                    </div>
                    
                    {demanda.prazo_resposta && (
                      <div className="text-xs flex items-center text-orange-600 mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Prazo: {formatDateWithTime(demanda.prazo_resposta)}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 rounded-xl border border-gray-200">
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
