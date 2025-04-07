
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react'; // Changed from MagnifyingGlassIcon to Search from lucide-react
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
          <div>
            <h2 className="text-xl font-semibold mb-4">Selecionar Demanda</h2>
            <p className="text-gray-600 mb-4">
              Selecione uma demanda para criar uma nova nota oficial. Apenas demandas respondidas estão disponíveis para criação de notas.
            </p>
          </div>
          
          <div className="relative">
            <Label htmlFor="search-demanda" className="block text-sm font-medium text-gray-700 mb-1">
              Pesquisar por título ou área
            </Label>
            <div className="relative">
              <Input
                id="search-demanda"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="min-h-[300px]">
            <h3 className="font-medium text-base mb-2">Demandas Disponíveis</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              </div>
            ) : filteredDemandas.length === 0 ? (
              <div className="text-center py-12 border rounded-md border-dashed">
                <p className="text-gray-500">
                  {searchTerm 
                    ? "Nenhuma demanda encontrada com esses critérios." 
                    : "Não há demandas disponíveis para criação de notas."}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Demandas precisam ser respondidas antes que uma nota possa ser criada.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {filteredDemandas.map((demanda) => (
                  <div 
                    key={demanda.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{demanda.titulo}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Área: {demanda.area_coordenacao?.descricao || 'Não informada'}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDemandaSelect(demanda.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Selecionar</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandaSelection;
