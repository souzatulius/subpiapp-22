
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DemandFilter from './DemandFilter';
import DemandCards from './DemandCards';
import DemandList from './DemandList';
import DemandDetail from './DemandDetail';
import { useDemandas } from '@/hooks/demandas/useDemandas';
import { Demand as AppDemand } from '@/types/demand';

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
          <DemandCards demandas={fetchedDemandas} isLoading={isLoading} onSelectDemand={handleSelectDemand} /> : 
          <DemandList demandas={fetchedDemandas} isLoading={isLoading} onSelectDemand={handleSelectDemand} />
        }

        <DemandDetail demand={selectedDemand} isOpen={isDetailOpen} onClose={handleCloseDetail} />
      </CardContent>
    </Card>
  );
};

export default DemandasContent;
