
import React from 'react';
import { Demanda } from '../types';
import DemandaCard from './DemandaCard';
import EmptyState from './EmptyState';

interface DemandaGridProps {
  demandas: Demanda[];
  selectedDemandaId: string | null;
  onSelectDemanda: (demanda: Demanda) => void;
  loading: boolean;
}

const DemandaGrid: React.FC<DemandaGridProps> = ({ 
  demandas, 
  selectedDemandaId, 
  onSelectDemanda,
  loading 
}) => {
  if (demandas.length === 0 && !loading) {
    return <EmptyState message="Nenhuma demanda encontrada com os filtros selecionados" />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {demandas.map(demanda => (
        <DemandaCard
          key={demanda.id}
          demanda={demanda}
          isSelected={selectedDemandaId === demanda.id}
          onClick={() => onSelectDemanda(demanda)}
        />
      ))}
    </div>
  );
};

export default DemandaGrid;
