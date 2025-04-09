
import React, { useState } from 'react';
import { ESICProcesso } from '@/types/esic';
import ProcessoList from '@/components/esic/ProcessoList';
import { Button } from '@/components/ui/button';
import { FilePlus, Grid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ProcessosListProps {
  processos: ESICProcesso[];
  isLoading: boolean;
  onCreateProcesso: () => void;
  onViewProcesso: (processo: ESICProcesso) => void;
  onEditProcesso: (processo: ESICProcesso) => void;
  onDeleteProcesso: (id: string) => void;
}

const ProcessosList: React.FC<ProcessosListProps> = ({
  processos = [],
  isLoading,
  onCreateProcesso,
  onViewProcesso,
  onEditProcesso,
  onDeleteProcesso
}) => {
  const [filterTerm, setFilterTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  
  const filteredProcessos = processos?.filter(processo => 
    processo.assunto?.toLowerCase().includes(filterTerm.toLowerCase()) ||
    processo.protocolo?.toLowerCase().includes(filterTerm.toLowerCase()) ||
    processo.texto?.toLowerCase().includes(filterTerm.toLowerCase()) ||
    (processo.solicitante || '').toLowerCase().includes(filterTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar processos..."
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            className="pl-8 w-full rounded-xl"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'list' | 'cards')}>
            <ToggleGroupItem value="list" aria-label="Lista" className="rounded-xl">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="cards" aria-label="Cards" className="rounded-xl">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Button 
            onClick={onCreateProcesso}
            variant="action"
            className="hidden sm:flex items-center w-auto rounded-xl"
          >
            <FilePlus className="h-5 w-5 mr-2" />
            Novo Processo
          </Button>
          
          <Button 
            onClick={onCreateProcesso}
            variant="action"
            className="flex sm:hidden items-center w-10 h-10 p-0 justify-center rounded-xl"
            aria-label="Novo Processo"
          >
            <FilePlus className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <ProcessoList 
        searchTerm={filterTerm}
        processos={processos}
        isLoading={isLoading}
        onViewClick={onViewProcesso}
        onEditClick={onEditProcesso}
        onDeleteClick={(processo) => onDeleteProcesso(processo.id)}
        showEmptyState={true}
        viewMode={viewMode}
      />
    </div>
  );
};

export default ProcessosList;
