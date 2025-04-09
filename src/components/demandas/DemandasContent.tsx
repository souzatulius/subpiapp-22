
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DemandFilter from './DemandFilter';
import DemandCards from './DemandCards';
import DemandList from './DemandList';
import DemandDetail from './DemandDetail';
import { useDemandas } from '@/hooks/demandas/useDemandas';
import { Demand } from '@/types/demand';

const DemandasContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('pendente');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const {
    demandas: fetchedDemandas,
    isLoading,
    selectedDemand,
    isDetailOpen,
    handleSelectDemand,
    handleCloseDetail
  } = useDemandas(filterStatus);

  // Filter demands by search term
  const filteredDemandas = fetchedDemandas.filter(demand => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      (demand.title?.toLowerCase().includes(term)) ||
      (demand.origem?.toLowerCase().includes(term)) ||
      (demand.status?.toLowerCase().includes(term))
    );
  });

  useEffect(() => {
    console.log("Demandas atualizadas:", fetchedDemandas);
  }, [fetchedDemandas]);

  return (
    <Card className="bg-white shadow-sm rounded-xl">
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
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        {viewMode === 'cards' ? 
          <DemandCards demandas={filteredDemandas} isLoading={isLoading} onSelectDemand={handleSelectDemand} /> : 
          <DemandList demandas={filteredDemandas} isLoading={isLoading} onSelectDemand={handleSelectDemand} />
        }

        <DemandDetail demand={selectedDemand} isOpen={isDetailOpen} onClose={handleCloseDetail} />
      </CardContent>
    </Card>
  );
};

export default DemandasContent;
