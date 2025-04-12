
import React, { useState } from 'react';
import { useZeladoriaChartDataMock } from '@/hooks/ranking/useZeladoriaChartDataMock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChartDebugPanelProps {
  sgzData?: any[] | null;
  isVisible?: boolean;
}

const ChartDebugPanel: React.FC<ChartDebugPanelProps> = ({ 
  sgzData,
  isVisible = false 
}) => {
  const { data: mockData, isLoading, error, refresh } = useZeladoriaChartDataMock(0); // No delay for quick debug
  const [activeTab, setActiveTab] = useState('mock');

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg border border-gray-300 shadow-lg w-96 max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold">Chart Debug Panel</h3>
        <Button variant="outline" size="sm" onClick={refresh}>Refresh</Button>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-2">
          <TabsTrigger value="mock">Mock Data</TabsTrigger>
          <TabsTrigger value="sgz">SGZ Data</TabsTrigger>
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
            <p className="text-xs">No SGZ data provided</p>
          ) : (
            <pre className="text-xs bg-gray-100 p-2 rounded max-h-32 overflow-auto">
              {`Total items: ${sgzData.length}`}
              {sgzData.length > 0 && (
                <>
                  <br />
                  {`First item sample: ${JSON.stringify(sgzData[0], null, 2)}`}
                </>
              )}
            </pre>
          )}
        </TabsContent>
        
        <TabsContent value="status">
          <div className="text-xs">
            <p><strong>Status:</strong></p>
            <ul className="bg-gray-100 p-2 rounded">
              <li>Mock Data: {mockData ? '✅ Available' : '❌ Not Available'}</li>
              <li>SGZ Data: {sgzData && sgzData.length > 0 ? `✅ Available (${sgzData.length} items)` : '❌ Not Available'}</li>
              <li>Loading State: {isLoading ? '⏳ Loading' : '✅ Not Loading'}</li>
              {error && <li className="text-red-500">Error: {error}</li>}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChartDebugPanel;
