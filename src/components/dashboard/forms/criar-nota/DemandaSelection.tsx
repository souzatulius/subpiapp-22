
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Demand } from './types';
import { Loader2 } from 'lucide-react';

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
  // Filter demandas to only show those that have been responded to
  const respondedasDemandas = filteredDemandas.filter(demanda => 
    demanda.status === 'respondida' || demanda.status === 'aguardando_nota');

  return (
    <Card className="border border-gray-200 rounded-lg shadow-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Selecione uma Demanda</h3>
        
        <div className="mb-6">
          <Input
            placeholder="Buscar demanda por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          {isLoading ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {respondedasDemandas.length > 0 ? (
                respondedasDemandas.map((demanda) => (
                  <div 
                    key={demanda.id}
                    className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => onDemandaSelect(demanda.id)}
                  >
                    <div className="font-medium">{demanda.titulo}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {demanda.supervisao_tecnica?.descricao || demanda.area_coordenacao?.descricao || 'Área não informada'}
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
