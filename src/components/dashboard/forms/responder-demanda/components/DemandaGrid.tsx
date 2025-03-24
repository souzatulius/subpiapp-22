
import React from 'react';
import DemandaCard from './DemandaCard';
import EmptyState from './EmptyState';
import { Demanda } from '../types';

interface DemandaGridProps {
  demandas: Demanda[];
  selectedDemanda: Demanda | null;
  handleSelectDemanda: (demanda: Demanda) => void;
  isLoading: boolean;
}

const DemandaGrid: React.FC<DemandaGridProps> = ({
  demandas,
  selectedDemanda,
  handleSelectDemanda,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner" />
      </div>
    );
  }
  
  if (demandas.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {demandas.map(demanda => (
        <DemandaCard 
          key={demanda.id} 
          demanda={demanda} 
          selected={selectedDemanda?.id === demanda.id} 
          onClick={() => handleSelectDemanda(demanda)} 
        />
      ))}
    </div>
  );
};

export default DemandaGrid;
