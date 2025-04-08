
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
  return (
    <>
      <div className="flex justify-end mb-6">
        <Button 
          onClick={onCreateProcesso}
          variant="action"
          className="hidden md:flex items-center"
        >
          <FilePlus className="h-5 w-5 mr-2" />
          Novo Processo
        </Button>
        
        <Button 
          onClick={onCreateProcesso}
          variant="action"
          className="flex md:hidden"
        >
          <FilePlus className="h-5 w-5" />
        </Button>
      </div>
      
      <ProcessoList
        processos={processos}
        isLoading={isLoading}
        onSelectProcesso={onViewProcesso}
        onEditProcesso={onEditProcesso}
        onDeleteProcesso={onDeleteProcesso}
      />
    </>
  );
};

export default ProcessosList;
