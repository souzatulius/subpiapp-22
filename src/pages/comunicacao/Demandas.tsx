
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Layout,
  DemandList,
  DemandFilter,
  DemandCards,
  DemandDetail
} from '@/components/demandas';

const DemandasPage = () => {
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [filterStatus, setFilterStatus] = useState('pendente');

  const handleSelectDemand = (demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedDemand(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Demandas</h1>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Lista de Demandas</TabsTrigger>
          <TabsTrigger value="cards">Visão em Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Layout>
            <DemandFilter 
              viewMode={viewMode === 'cards' ? 'cards' : 'list'} 
              setViewMode={(mode) => setViewMode(mode)}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
            <DemandList 
              demandas={[]} 
              isLoading={false}
              onSelectDemand={handleSelectDemand} 
            />
            {selectedDemand && (
              <DemandDetail 
                demand={selectedDemand} 
                isOpen={isDetailOpen}
                onClose={handleCloseDetail} 
              />
            )}
          </Layout>
        </TabsContent>
        
        <TabsContent value="cards">
          <Layout>
            <DemandFilter 
              viewMode={viewMode === 'cards' ? 'cards' : 'list'} 
              setViewMode={(mode) => setViewMode(mode)}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
            <DemandCards 
              demandas={[]} 
              isLoading={false}
              onSelectDemand={handleSelectDemand} 
            />
            {selectedDemand && (
              <DemandDetail 
                demand={selectedDemand} 
                isOpen={isDetailOpen}
                onClose={handleCloseDetail} 
              />
            )}
          </Layout>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DemandasPage;
