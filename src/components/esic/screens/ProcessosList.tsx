
import React from 'react';
import { ESICProcesso } from '@/types/esic';
import ProcessoList from '@/components/esic/ProcessoList';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

interface ProcessosListProps {
  processos: ESICProcesso[] | undefined;
  isLoading: boolean;
  onCreateProcesso: () => void;
  onViewProcesso: (processo: ESICProcesso) => void;
  onEditProcesso: (processo: ESICProcesso) => void;
  onDeleteProcesso: (id: string) => void;
}

const ProcessosList: React.FC<ProcessosListProps> = ({
  processos,
  isLoading,
  onCreateProcesso,
  onViewProcesso,
  onEditProcesso,
  onDeleteProcesso
}) => {
  // States for viewMode, searchTerm, filterOpen and setFilterOpen that ProcessoList needs
  const [viewMode, setViewMode] = React.useState<'list' | 'cards'>('list');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterOpen, setFilterOpen] = React.useState(false);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button 
          onClick={onCreateProcesso}
          variant="action"
          className="hidden sm:flex items-center"
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
      
      {/* ProcessoList component with required props */}
      <ProcessoList
        viewMode={viewMode}
        searchTerm={searchTerm}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
      />
    </div>
  );
};

export default ProcessosList;
