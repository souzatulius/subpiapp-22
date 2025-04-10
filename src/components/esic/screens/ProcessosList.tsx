
import React, { useState, useEffect } from 'react';
import { ESICProcesso } from '@/types/esic';
import ProcessoList from '@/components/esic/ProcessoList';
import ESICSearchHeader from '@/components/esic/ESICSearchHeader';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ProcessosListProps {
  processos: ESICProcesso[];
  isLoading: boolean;
  error: string | null;
  onCreateProcesso: () => void;
  onViewProcesso: (processo: ESICProcesso) => void;
  onEditProcesso: (processo: ESICProcesso) => void;
  onDeleteProcesso: (id: string) => void;
  onAddJustificativa?: (processo: ESICProcesso) => void;
}

const ProcessosList: React.FC<ProcessosListProps> = ({
  processos = [],
  isLoading,
  error,
  onCreateProcesso,
  onViewProcesso,
  onEditProcesso,
  onDeleteProcesso,
  onAddJustificativa
}) => {
  const [filterTerm, setFilterTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(e.target.value);
  };
  
  console.log('ProcessosList received processos:', processos);
  
  return (
    <div className="space-y-4">
      <ESICSearchHeader 
        searchTerm={filterTerm}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFilterClick={() => {}} // Placeholder for filter action
        onNewProcessClick={onCreateProcesso}
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error}. Tente novamente mais tarde ou entre em contato com o suporte.
          </AlertDescription>
        </Alert>
      )}
      
      <ProcessoList 
        searchTerm={filterTerm}
        processos={processos}
        isLoading={isLoading}
        onViewClick={onViewProcesso}
        onEditClick={onEditProcesso}
        onDeleteClick={(processo) => onDeleteProcesso(processo.id)}
        onAddJustificativa={onAddJustificativa}
        showEmptyState={true}
        viewMode={viewMode}
      />
    </div>
  );
};

export default ProcessosList;
