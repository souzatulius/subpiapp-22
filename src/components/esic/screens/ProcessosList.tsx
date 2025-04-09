
import React, { useState } from 'react';
import { ESICProcesso } from '@/types/esic';
import ProcessoList from '@/components/esic/ProcessoList';
import ESICSearchHeader from '@/components/esic/ESICSearchHeader';

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
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(e.target.value);
  };
  
  // Log the received processes to help with debugging
  console.log('ProcessosList received processos:', processos);
  
  // Filter processes based on the search term
  const filteredProcessos = processos?.filter(processo => 
    processo.assunto?.toLowerCase().includes(filterTerm.toLowerCase()) ||
    processo.protocolo?.toLowerCase().includes(filterTerm.toLowerCase()) ||
    processo.texto?.toLowerCase().includes(filterTerm.toLowerCase()) ||
    (processo.solicitante || '').toLowerCase().includes(filterTerm.toLowerCase())
  ) || [];

  console.log('Filtered processos:', filteredProcessos);

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
      
      <ProcessoList 
        searchTerm={filterTerm}
        processos={filteredProcessos}
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
