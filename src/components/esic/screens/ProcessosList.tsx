
import React from 'react';
import { ESICProcesso } from '@/types/esic';
import ProcessoList from '@/components/esic/ProcessoList';
import ESICWelcomeCard from '@/components/esic/ESICWelcomeCard';
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
      <div className="flex justify-between items-center">
        <ESICWelcomeCard onNovoProcesso={onCreateProcesso} />
        <Button 
          onClick={onCreateProcesso}
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
