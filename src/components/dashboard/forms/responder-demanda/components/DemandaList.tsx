
import React from 'react';
import DemandaCard from './DemandaCard';
import EmptyState from './EmptyState';
import { Demanda } from '../types';

interface DemandaListProps {
  demandas: Demanda[];
  selectedDemanda: Demanda | null;
  handleSelectDemanda: (demanda: Demanda) => void;
  isLoading: boolean;
}

const DemandaList: React.FC<DemandaListProps> = ({
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
    <div className="space-y-4">
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

export default DemandaList;
