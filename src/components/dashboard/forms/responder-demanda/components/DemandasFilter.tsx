
import React, { useState } from 'react';
import { Filter, Grid, List, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import DemandasSearchBar from '@/components/consultar-demandas/DemandasSearchBar';

interface DemandasFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  areaFilter: string;
  setAreaFilter: (area: string) => void;
  prioridadeFilter: string;
  setPrioridadeFilter: (prioridade: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  areas: { id: string; nome: string }[];
  onBack?: () => void;
  showBackButton?: boolean;
}

const DemandasFilter: React.FC<DemandasFilterProps> = ({
  searchTerm,
  setSearchTerm,
  areaFilter,
  setAreaFilter,
  prioridadeFilter,
  setPrioridadeFilter,
  viewMode,
  setViewMode,
  areas,
  onBack,
  showBackButton = false
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const prioridades = [
    { id: 'todos', nome: 'Todas as prioridades' },
    { id: 'alta', nome: 'Alta' },
    { id: 'media', nome: 'Média' },
    { id: 'baixa', nome: 'Baixa' }
  ];

  // Set default values on mount if they're not already set
  React.useEffect(() => {
    if (!areaFilter) {
      setAreaFilter('todos');
    }
    if (!prioridadeFilter) {
      setPrioridadeFilter('todos');
    }
  }, [areaFilter, prioridadeFilter, setAreaFilter, setPrioridadeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {/* Only show back button if explicitly requested */}
        {showBackButton && onBack && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {!isMobile && "Voltar"}
          </Button>
        )}

        <DemandasSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Buscar demanda..."
          className="flex-1"
        />

        <Button
          variant="outline"
          size="icon"
          onClick={toggleFilter}
          className={`rounded-xl ${isFilterOpen ? 'bg-blue-50' : ''}`}
        >
          <Filter className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('list')}
            className={`rounded-xl ${viewMode === 'list' ? 'bg-blue-50' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('cards')}
            className={`rounded-xl ${viewMode === 'cards' ? 'bg-blue-50' : ''}`}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="flex flex-wrap gap-4 animate-fadeInUp">
          <div className="w-full sm:w-auto flex-1">
            <Select value={areaFilter} onValueChange={setAreaFilter} defaultValue="todos">
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Coordenação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as coordenações</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-auto flex-1">
            <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter} defaultValue="todos">
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                {prioridades.map((prioridade) => (
                  <SelectItem key={prioridade.id} value={prioridade.id}>
                    {prioridade.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandasFilter;
