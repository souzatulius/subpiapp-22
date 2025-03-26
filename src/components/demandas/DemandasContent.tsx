
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DemandFilter from './DemandFilter';
import DemandCards from './DemandCards';
import DemandList from './DemandList';
import DemandDetail from './DemandDetail';
import { useDemandas } from '@/hooks/demandas/useDemandas';
import { Demand as AppDemand } from '@/types/demand';

// Extend the Demand type to include missing properties if needed
interface DemandWithService extends AppDemand {
  servico: {
    descricao: string;
  } | null;
}

const DemandasContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('pendente');
  
  const {
    demandas: fetchedDemandas,
    isLoading,
    selectedDemand,
    isDetailOpen,
    handleSelectDemand,
    handleCloseDetail
  } = useDemandas(filterStatus);

  useEffect(() => {
    console.log("Demandas atualizadas:", fetchedDemandas);
  }, [fetchedDemandas]);

  // Convert fetched demandas to include servico property
  const demandas = fetchedDemandas.map(demand => {
    return {
      ...demand,
      servico: null // Add null servico since it's required by the interface
    } as DemandWithService;
  });

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-2xl font-bold text-[#003570]">
          Gerenciamento de Demandas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <DemandFilter 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          filterStatus={filterStatus} 
          setFilterStatus={setFilterStatus} 
        />
        
        {viewMode === 'cards' ? 
          <DemandCards demandas={demandas} isLoading={isLoading} onSelectDemand={handleSelectDemand} /> : 
          <DemandList demandas={demandas} isLoading={isLoading} onSelectDemand={handleSelectDemand} />
        }

        <DemandDetail demand={selectedDemand} isOpen={isDetailOpen} onClose={handleCloseDetail} />
      </CardContent>
    </Card>
  );
};

export default DemandasContent;
