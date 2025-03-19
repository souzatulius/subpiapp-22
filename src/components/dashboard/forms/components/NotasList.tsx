
import React from 'react';
import NotaCard from './NotaCard';
import { LoadingState, EmptyState, NoAccessState } from './NotasListStates';
import { NotaOficial } from '../types';

interface NotasListProps {
  notas: NotaOficial[];
  selectedNota: NotaOficial | null;
  onSelectNota: (nota: NotaOficial) => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const NotasList: React.FC<NotasListProps> = ({ 
  notas, 
  selectedNota, 
  onSelectNota, 
  isAdmin, 
  isLoading 
}) => {
  if (!isAdmin) {
    return <NoAccessState />;
  }
  
  if (isLoading) {
    return <LoadingState />;
  }

  if (notas.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {notas.map((nota) => (
        <NotaCard
          key={nota.id}
          nota={nota}
          isSelected={selectedNota?.id === nota.id}
          onClick={() => onSelectNota(nota)}
        />
      ))}
    </div>
  );
};

export default NotasList;
