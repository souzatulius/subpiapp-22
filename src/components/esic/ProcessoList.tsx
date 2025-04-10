
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ESICProcesso, statusLabels } from '@/types/esic';
import ProcessoItem from './ProcessoItem';
import ProcessoListEmpty from './ProcessoListEmpty';
import ProcessoListSkeleton from './ProcessoListSkeleton';
import ProcessoCard from './ProcessoCard';

interface ProcessoListProps {
  searchTerm?: string;
  processos?: ESICProcesso[];
  isLoading?: boolean;
  onAddJustificativa?: (processo: ESICProcesso) => void;
  onViewClick?: (processo: ESICProcesso) => void;
  onEditClick?: (processo: ESICProcesso) => void;
  onDeleteClick?: (processo: ESICProcesso) => void;
  showEmptyState?: boolean;
  viewMode?: 'list' | 'cards';
}

const ProcessoList: React.FC<ProcessoListProps> = ({
  searchTerm = '',
  onAddJustificativa,
  onViewClick,
  onEditClick,
  onDeleteClick,
  showEmptyState = false,
  processos = [],
  isLoading = false,
  viewMode = 'list'
}) => {
  const navigate = useNavigate();
  
  console.log("ProcessoList received processos:", processos);

  // Filter processos based on search term
  const filteredProcessos = processos.filter(processo => {
    return processo.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           processo.protocolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (processo.solicitante?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return <ProcessoListSkeleton viewMode={viewMode} />;
  }

  // Mostrar estado vazio apenas se não houver processos ou se os resultados da pesquisa forem vazios
  if (processos.length === 0) {
    return <ProcessoListEmpty searchTerm={''} />;
  }

  if (filteredProcessos.length === 0 && searchTerm) {
    return <ProcessoListEmpty searchTerm={searchTerm} />;
  }

  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProcessos.map((processo) => (
          <ProcessoCard
            key={processo.id}
            processo={processo}
            onViewClick={onViewClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onAddJustificativa={onAddJustificativa ? () => onAddJustificativa(processo) : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredProcessos.map((processo) => (
        <ProcessoItem
          key={processo.id}
          processo={processo}
          onViewClick={onViewClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onAddJustificativa={onAddJustificativa ? () => onAddJustificativa(processo) : undefined}
        />
      ))}
    </div>
  );
};

export default ProcessoList;
