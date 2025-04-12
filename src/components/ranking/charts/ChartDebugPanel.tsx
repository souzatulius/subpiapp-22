
import React, { useState, useEffect } from 'react';
import { useZeladoriaChartDataMock } from '@/hooks/ranking/useZeladoriaChartDataMock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { Bug, RefreshCw } from 'lucide-react';

interface ChartDebugPanelProps {
  sgzData?: any[] | null;
  painelData?: any[] | null;
  isVisible?: boolean;
}

const ChartDebugPanel: React.FC<ChartDebugPanelProps> = ({ 
  sgzData,
  painelData,
  isVisible = false 
}) => {
  const { data: mockData, isLoading, error, refresh: refreshMock } = useZeladoriaChartDataMock(0); // No delay for quick debug
  const [activeTab, setActiveTab] = useState('mock');
  const { setSgzData, setPlanilhaData, setPainelData } = useRankingCharts();
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to load mock SGZ data from JSON and inject it into the store
  const loadAndInjectSgzMockData = async () => {
    try {
      const response = await fetch('/mock/sgz_data_mock.json');
      if (!response.ok) {
        console.error(`Failed to load SGZ mock data: ${response.status}`);
        return;
      }
      const data = await response.json();
      console.log("Debug Panel: Loaded mock SGZ data, injecting into store:", data);
      
      // Set the data in the store
      setSgzData(data);
      setPlanilhaData(data);
    } catch (error) {
      console.error("Debug Panel: Error loading mock SGZ data:", error);
    }
  };

  // Function to load mock Painel data from JSON and inject it into the store
  const loadAndInjectPainelMockData = async () => {
    try {
      const response = await fetch('/mock/painel_data_mock.json');
      if (!response.ok) {
        console.error(`Failed to load Painel mock data: ${response.status}`);
        return;
      }
      const data = await response.json();
      console.log("Debug Panel: Loaded mock Painel data, injecting into store:", data);
      
      // Set the data in the store
      setPainelData(data);
    } catch (error) {
      console.error("Debug Panel: Error loading mock Painel data:", error);
    }
  };

  // Function to load both SGZ and Painel mock data
  const loadAllMockData = async () => {
    await loadAndInjectSgzMockData();
    await loadAndInjectPainelMockData();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg border border-gray-300 shadow-lg ${isExpanded ? 'w-[600px] max-h-[600px]' : 'w-96 max-h-96'} overflow-auto`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Bug size={16} className="text-orange-500" />
          <h3 className="text-sm font-bold">Chart Debug Panel</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadAllMockData} className="flex items-center gap-1">
            <RefreshCw size={12} />
            <span>Inject All Mocks</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Compress' : 'Expand'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-2">
          <TabsTrigger value="mock">Mock Data</TabsTrigger>
          <TabsTrigger value="sgz">SGZ Data</TabsTrigger>
          <TabsTrigger value="painel">Painel Data</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mock">
          {isLoading ? (
            <p className="text-xs">Loading mock data...</p>
          ) : error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : !mockData ? (
            <p className="text-xs">No mock data available</p>
          ) : (
            <pre className="text-xs bg-gray-100 p-2 rounded max-h-32 overflow-auto">
              {JSON.stringify(mockData, null, 2)}
            </pre>
          )}
        </TabsContent>
        
        <TabsContent value="sgz">
          {!sgzData ? (
            <div>
              <p className="text-xs text-red-600 font-semibold mb-2">No SGZ data provided</p>
              <Button size="sm" variant="destructive" onClick={loadAndInjectSgzMockData}>
                Inject Mock Data to SGZ
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-medium">Total items: {sgzData.length}</p>
                {sgzData.length > 0 && (
                  <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(sgzData[0]))} className="text-xs">
                    Copy Sample
                  </Button>
                )}
              </div>
              <pre className="text-xs bg-gray-100 p-2 rounded max-h-48 overflow-auto">
                {sgzData.length > 0 ? (
                  JSON.stringify(sgzData[0], null, 2)
                ) : (
                  "[]"
                )}
              </pre>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="painel">
          {!painelData ? (
            <div>
              <p className="text-xs text-red-600 font-semibold mb-2">No Painel data provided</p>
              <Button size="sm" variant="destructive" onClick={loadAndInjectPainelMockData}>
                Inject Mock Data to Painel
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-medium">Total items: {painelData.length}</p>
                {painelData.length > 0 && (
                  <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(painelData[0]))} className="text-xs">
                    Copy Sample
                  </Button>
                )}
              </div>
              <pre className="text-xs bg-gray-100 p-2 rounded max-h-48 overflow-auto">
                {painelData.length > 0 ? (
                  JSON.stringify(painelData[0], null, 2)
                ) : (
                  "[]"
                )}
              </pre>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="status">
          <div className="text-xs">
            <p><strong>Status:</strong></p>
            <ul className="bg-gray-100 p-2 rounded">
              <li>Mock Data: {mockData ? '✅ Available' : '❌ Not Available'}</li>
              <li>SGZ Data: {sgzData && sgzData.length > 0 ? `✅ Available (${sgzData.length} items)` : '❌ Not Available'}</li>
              <li>Painel Data: {painelData && painelData.length > 0 ? `✅ Available (${painelData.length} items)` : '❌ Not Available'}</li>
              <li>Loading State: {isLoading ? '⏳ Loading' : '✅ Not Loading'}</li>
              {error && <li className="text-red-500">Error: {error}</li>}
            </ul>
            
            <div className="mt-3">
              <p><strong>Debug Actions:</strong></p>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Button size="sm" variant="outline" onClick={refreshMock} className="text-xs">
                  Refresh Mock
                </Button>
                <Button size="sm" variant="outline" onClick={loadAndInjectSgzMockData} className="text-xs">
                  Load SGZ Mock
                </Button>
                <Button size="sm" variant="outline" onClick={loadAndInjectPainelMockData} className="text-xs">
                  Load Painel Mock
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChartDebugPanel;
