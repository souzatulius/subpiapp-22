
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DemandFilter from './DemandFilter';
import DemandCards from './DemandCards';
import DemandList from './DemandList';
import DemandDetail from './DemandDetail';
import { useDemandas } from '@/hooks/demandas';
import { Demand as AppDemand } from '@/types/demand';

const DemandasContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('pendente');
  
  // Local state for demand management
  const [fetchedDemandas, setFetchedDemandas] = useState<AppDemand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDemand, setSelectedDemand] = useState<AppDemand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { useRespostaDemanda } = useDemandas();

  // Handlers
  const handleSelectDemand = (demand: AppDemand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedDemand(null);
  };

  // Simulate fetching demands - replace with your actual data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual API call
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data - replace with actual API response
        const mockData: AppDemand[] = [
          // Add mock data if needed
        ];
        setFetchedDemandas(mockData);
      } catch (error) {
        console.error("Error fetching demands:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filterStatus]);

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
