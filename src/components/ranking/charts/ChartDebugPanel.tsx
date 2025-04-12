
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { Trash2, RefreshCw, Database, ToggleLeft, ToggleRight } from 'lucide-react';

interface ChartDebugPanelProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  isVisible: boolean;
}

const ChartDebugPanel: React.FC<ChartDebugPanelProps> = ({ sgzData, painelData, isVisible }) => {
  const [activeTab, setActiveTab] = useState('sgz');
  const { isMockData, setIsMockData, refreshChartData } = useRankingCharts();

  if (!isVisible) return null;

  const clearLocalStorage = () => {
    localStorage.removeItem('ranking-charts-storage');
    localStorage.removeItem('demo-sgz-data');
    localStorage.removeItem('demo-painel-data');
    localStorage.removeItem('demo-last-update');
    window.location.reload();
  };

  const toggleMockMode = () => {
    setIsMockData(!isMockData);
    setTimeout(() => {
      refreshChartData();
    }, 100);
  };

  return (
    <Card className="mt-4 p-4 bg-gray-50 border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Database className="h-4 w-4 mr-2 text-orange-500" />
          Debug Panel
          <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 rounded-full text-orange-800">
            {isMockData ? 'Mock Mode' : 'Supabase Mode'}
          </span>
        </h3>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1 text-xs h-7"
            onClick={toggleMockMode}
          >
            {isMockData ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
            {isMockData ? 'Using Mocks' : 'Using Supabase'}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1 text-xs h-7"
            onClick={() => refreshChartData()}
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            className="flex items-center gap-1 text-xs h-7"
            onClick={clearLocalStorage}
          >
            <Trash2 className="h-3 w-3" />
            Clear Cache
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-blue-50 p-2 rounded-md">
          <div className="text-xs font-medium text-blue-700">SGZ Records</div>
          <div className="text-lg font-bold">{sgzData?.length || 0}</div>
        </div>
        <div className="bg-green-50 p-2 rounded-md">
          <div className="text-xs font-medium text-green-700">Painel Records</div>
          <div className="text-lg font-bold">{painelData?.length || 0}</div>
        </div>
        <div className="bg-purple-50 p-2 rounded-md">
          <div className="text-xs font-medium text-purple-700">Data Source</div>
          <div className="text-lg font-bold">{isMockData ? 'Mock' : 'Supabase'}</div>
        </div>
        <div className="bg-orange-50 p-2 rounded-md">
          <div className="text-xs font-medium text-orange-700">Environment</div>
          <div className="text-lg font-bold">{process.env.NODE_ENV}</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-2">
          <TabsTrigger value="sgz">SGZ Data</TabsTrigger>
          <TabsTrigger value="painel">Painel Data</TabsTrigger>
          <TabsTrigger value="storage">Local Storage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sgz" className="p-2 bg-white rounded-md border border-gray-200 max-h-80 overflow-auto">
          {sgzData && sgzData.length > 0 ? (
            <div className="text-xs">
              <pre>{JSON.stringify(sgzData.slice(0, 3), null, 2)}</pre>
              {sgzData.length > 3 && (
                <div className="text-gray-500 mt-2">... and {sgzData.length - 3} more records</div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No SGZ data available</div>
          )}
        </TabsContent>
        
        <TabsContent value="painel" className="p-2 bg-white rounded-md border border-gray-200 max-h-80 overflow-auto">
          {painelData && painelData.length > 0 ? (
            <div className="text-xs">
              <pre>{JSON.stringify(painelData.slice(0, 3), null, 2)}</pre>
              {painelData.length > 3 && (
                <div className="text-gray-500 mt-2">... and {painelData.length - 3} more records</div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No Painel data available</div>
          )}
        </TabsContent>
        
        <TabsContent value="storage" className="p-2 bg-white rounded-md border border-gray-200 max-h-80 overflow-auto">
          <div className="text-xs">
            {Object.keys(localStorage).filter(key => 
              key.includes('ranking') || key.includes('demo')
            ).map(key => (
              <div key={key} className="mb-2">
                <div className="font-medium text-blue-700">{key}:</div>
                <pre className="bg-gray-50 p-1 rounded">{localStorage.getItem(key)?.substring(0, 100)}...</pre>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ChartDebugPanel;
