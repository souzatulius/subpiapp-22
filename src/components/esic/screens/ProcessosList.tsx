
import React, { useState } from 'react';
import { ESICProcesso } from '@/types/esic';
import ProcessoList from '@/components/esic/ProcessoList';
import { Button } from '@/components/ui/button';
import { FilePlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  
  const filteredProcessos = processos?.filter(processo => 
    processo.texto?.toLowerCase().includes(filterTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row justify-between gap-2 items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar processos..."
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        
        <Button 
          onClick={onCreateProcesso}
          variant="action"
          className="hidden sm:flex items-center w-auto"
        >
          <FilePlus className="h-5 w-5 mr-2" />
          Novo Processo
        </Button>
        
        <Button 
          onClick={onCreateProcesso}
          variant="action"
          className="flex sm:hidden items-center w-10 h-10 p-0 justify-center"
          aria-label="Novo Processo"
        >
          <FilePlus className="h-5 w-5" />
        </Button>
      </div>
      
      <ProcessoList 
        processos={filteredProcessos}
        isLoading={isLoading}
        onViewProcesso={onViewProcesso}
        onEditProcesso={onEditProcesso}
        onDeleteProcesso={onDeleteProcesso}
        showEmptyState={processos?.length === 0}
      />
    </div>
  );
};

export default ProcessosList;
