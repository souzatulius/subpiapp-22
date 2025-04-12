
import React, { useEffect } from 'react';
import ChartDataDebugger from '@/components/ranking/debug/ChartDataDebugger';
import { Card } from '@/components/ui/card';
import StatusDistributionChart from '@/components/ranking/charts/StatusDistributionChart';
import { useZeladoriaChartDataMock } from '@/hooks/ranking/useZeladoriaChartDataMock';
import ChartDebugPanel from '@/components/ranking/charts/ChartDebugPanel';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';

export default function ChartTest() {
  const { data, isLoading: mockDataLoading, error } = useZeladoriaChartDataMock(500);
  const { setSgzData, sgzData, isLoading: storeLoading } = useRankingCharts();
  
  // Prepare mock SGZ data from the mockData
  const mockSgzData = React.useMemo(() => {
    if (!data) return null;
    
    // Transform the data structure to match what the StatusDistributionChart expects
    return Object.entries(data.por_status).map(([status, count]) => ({
      sgz_status: status,
      count: count
    }));
  }, [data]);
  
  // Load mock SGZ data from the JSON file
  useEffect(() => {
    async function loadMockSgzData() {
      try {
        const response = await fetch('/mock/sgz_data_mock.json');
        if (!response.ok) {
          throw new Error(`Failed to load mock data: ${response.status}`);
        }
        const data = await response.json();
        console.log("Loaded SGZ mock data:", data);
        
        // Set the data in the store
        setSgzData(data);
      } catch (error) {
        console.error("Error loading mock SGZ data:", error);
      }
    }
    
    loadMockSgzData();
  }, [setSgzData]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Chart Testing Page</h1>
      
      <ChartDataDebugger />
      <ChartDebugPanel sgzData={sgzData} isVisible={true} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Status Distribution Chart</h2>
          <StatusDistributionChart 
            data={{}}
            sgzData={sgzData}
            isLoading={storeLoading || mockDataLoading}
            isSimulationActive={false}
          />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Raw Mock SGZ Data</h2>
          {storeLoading || mockDataLoading ? (
            <p>Loading...</p>
          ) : !sgzData ? (
            <p>No data available</p>
          ) : (
            <pre className="bg-gray-100 p-2 rounded text-xs max-h-[300px] overflow-auto">
              {JSON.stringify(sgzData, null, 2)}
            </pre>
          )}
        </Card>
      </div>
    </div>
  );
}
