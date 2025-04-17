
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Demand } from './types';
import { Loader2 } from 'lucide-react';
import UnifiedFilterBar, { ViewMode } from '@/components/shared/unified-view/UnifiedFilterBar';

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
                    className={`p-3 border rounded-md hover:bg-gray-50 cursor-pointer ${viewMode === 'cards' ? 'h-full' : ''}`}
                    onClick={() => onDemandaSelect(demanda.id)}
                  >
                    <div className="font-medium">{demanda.titulo}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {demanda.area_coordenacao?.descricao || 'Área não informada'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Status: {demanda.status === 'respondida' ? 'Respondida' : 'Aguardando nota'}
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
