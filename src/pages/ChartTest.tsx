
import React, { useEffect } from 'react';
import ChartDataDebugger from '@/components/ranking/debug/ChartDataDebugger';
import { Card } from '@/components/ui/card';
import StatusDistributionChart from '@/components/ranking/charts/StatusDistributionChart';
import ComparativoSGZPainelChart from '@/components/ranking/charts/ComparativoSGZPainelChart';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import ChartDebugPanel from '@/components/ranking/charts/ChartDebugPanel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ChartTest() {
  const { setSgzData, sgzData, setPainelData, painelData, isLoading } = useRankingCharts();
  
  // Load mock data from the JSON files
  useEffect(() => {
    async function loadMockData() {
      try {
        // Load SGZ data
        const sgzResponse = await fetch('/mock/sgz_data_mock.json');
        if (!sgzResponse.ok) {
          throw new Error(`Failed to load SGZ mock data: ${sgzResponse.status}`);
        }
        const sgzData = await sgzResponse.json();
        console.log("ChartTest: Loaded SGZ mock data:", sgzData);
        
        // Set the SGZ data in the store
        setSgzData(sgzData);
        
        // Load Painel data
        const painelResponse = await fetch('/mock/painel_data_mock.json');
        if (!painelResponse.ok) {
          throw new Error(`Failed to load Painel mock data: ${painelResponse.status}`);
        }
        const painelData = await painelResponse.json();
        console.log("ChartTest: Loaded Painel mock data:", painelData);
        
        // Set the Painel data in the store
        setPainelData(painelData);
      } catch (error) {
        console.error("ChartTest: Error loading mock data:", error);
      }
    }
    
    loadMockData();
  }, [setSgzData, setPainelData]);
  
  // Function to reload data
  const reloadData = async () => {
    try {
      // Load SGZ data
      const sgzResponse = await fetch('/mock/sgz_data_mock.json');
      const sgzData = await sgzResponse.json();
      setSgzData(sgzData);
      
      // Load Painel data
      const painelResponse = await fetch('/mock/painel_data_mock.json');
      const painelData = await painelResponse.json();
      setPainelData(painelData);
      
      console.log("Data reloaded successfully!");
    } catch (error) {
      console.error("Error reloading data:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chart Testing Page</h1>
        <Button onClick={reloadData} variant="outline">
          Reload Mock Data
        </Button>
      </div>
      
      <ChartDataDebugger />
      <ChartDebugPanel sgzData={sgzData} painelData={painelData} isVisible={true} />
      
      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="data">Raw Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Status Distribution Chart</h2>
              <StatusDistributionChart 
                data={{}}
                sgzData={sgzData}
                isLoading={isLoading}
                isSimulationActive={false}
              />
            </Card>
            
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">SGZ vs Painel Comparison</h2>
              <ComparativoSGZPainelChart 
                data={{}}
                sgzData={sgzData}
                painelData={painelData}
                isLoading={isLoading}
                isSimulationActive={false}
              />
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">SGZ Mock Data</h2>
              {!sgzData ? (
                <p>No SGZ data available</p>
              ) : (
                <div>
                  <p className="mb-2 text-sm">Total records: {sgzData.length}</p>
                  <pre className="bg-gray-100 p-2 rounded text-xs max-h-[300px] overflow-auto">
                    {JSON.stringify(sgzData.slice(0, 5), null, 2)}
                    {sgzData.length > 5 && <div className="text-gray-400 text-center mt-2">... {sgzData.length - 5} more records ...</div>}
                  </pre>
                </div>
              )}
            </Card>
            
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Painel Mock Data</h2>
              {!painelData ? (
                <p>No Painel data available</p>
              ) : (
                <div>
                  <p className="mb-2 text-sm">Total records: {painelData.length}</p>
                  <pre className="bg-gray-100 p-2 rounded text-xs max-h-[300px] overflow-auto">
                    {JSON.stringify(painelData.slice(0, 5), null, 2)}
                    {painelData.length > 5 && <div className="text-gray-400 text-center mt-2">... {painelData.length - 5} more records ...</div>}
                  </pre>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
