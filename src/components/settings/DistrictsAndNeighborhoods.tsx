
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useDistrictsAndNeighborhoods } from './districts-neighborhoods/hooks/useDistrictsAndNeighborhoods';
import DistrictsTab from './districts-neighborhoods/DistrictsTab';
import NeighborhoodsTab from './districts-neighborhoods/NeighborhoodsTab';

const DistrictsAndNeighborhoods = () => {
  const {
    activeTab,
    setActiveTab,
    districts,
    neighborhoods,
    loadingDistricts,
    loadingNeighborhoods,
    isSubmitting,
    setIsSubmitting,
    fetchDistricts,
    fetchNeighborhoods,
  } = useDistrictsAndNeighborhoods();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="districts">Distritos</TabsTrigger>
          <TabsTrigger value="neighborhoods">Bairros</TabsTrigger>
        </TabsList>
        
        <TabsContent value="districts" className="pt-4">
          <DistrictsTab
            districts={districts}
            loadingDistricts={loadingDistricts}
            fetchDistricts={fetchDistricts}
            fetchNeighborhoods={fetchNeighborhoods}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </TabsContent>
        
        <TabsContent value="neighborhoods" className="pt-4">
          <NeighborhoodsTab
            neighborhoods={neighborhoods}
            districts={districts}
            loadingNeighborhoods={loadingNeighborhoods}
            fetchNeighborhoods={fetchNeighborhoods}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistrictsAndNeighborhoods;
