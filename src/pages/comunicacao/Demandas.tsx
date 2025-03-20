
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
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    dateRange: { from: undefined, to: undefined }
  });

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
            <DemandFilter filter={filter} setFilter={setFilter} />
            <DemandList 
              filter={filter} 
              onSelectDemand={setSelectedDemand} 
            />
            {selectedDemand && (
              <DemandDetail 
                demand={selectedDemand} 
                onClose={() => setSelectedDemand(null)} 
              />
            )}
          </Layout>
        </TabsContent>
        
        <TabsContent value="cards">
          <Layout>
            <DemandFilter filter={filter} setFilter={setFilter} />
            <DemandCards 
              filter={filter} 
              onSelectDemand={setSelectedDemand} 
            />
            {selectedDemand && (
              <DemandDetail 
                demand={selectedDemand} 
                onClose={() => setSelectedDemand(null)} 
              />
            )}
          </Layout>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DemandasPage;
