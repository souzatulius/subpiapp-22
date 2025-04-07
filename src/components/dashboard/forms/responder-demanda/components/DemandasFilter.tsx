
import React, { useState } from 'react';
import { Search, Filter, Grid, List, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ViewMode } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

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
  showBackButton
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

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar demanda..."
            className="pl-9 pr-4 py-2"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleFilter}
          className={isFilterOpen ? 'bg-blue-50' : ''}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isFilterOpen && (
        <div className="flex flex-wrap gap-4 animate-fadeInUp">
          <div className="w-full sm:w-auto flex-1">
            <Select value={areaFilter} onValueChange={setAreaFilter} defaultValue="todos">
              <SelectTrigger>
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
              <SelectTrigger>
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
