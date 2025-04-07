
import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Demand } from '@/types/demand';

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
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Buscar demandas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="py-8 flex justify-center">
              <p>Carregando demandas...</p>
            </div>
          ) : filteredDemandas.length === 0 ? (
            <div className="py-8 flex justify-center">
              <p>Nenhuma demanda encontrada</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredDemandas.map((demanda) => (
                <div
                  key={demanda.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onDemandaSelect(demanda.id)}
                >
                  <h3 className="font-medium">{demanda.titulo}</h3>
                  <div className="flex gap-2 mt-2 text-sm text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                      {demanda.status === 'pendente' ? 'Pendente' : 'Em andamento'}
                    </span>
                    {demanda.supervisao_tecnica && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                        {demanda.supervisao_tecnica.descricao}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaSelection;
