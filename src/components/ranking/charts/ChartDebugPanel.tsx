
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw } from 'lucide-react';

interface ChartDebugPanelProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  isVisible?: boolean;
  isLoading?: boolean; // Add isLoading prop
}

const ChartDebugPanel: React.FC<ChartDebugPanelProps> = ({
  sgzData,
  painelData,
  isVisible = false,
  isLoading = false // Include isLoading prop with default
}) => {
  const [showPanel, setShowPanel] = useState<boolean>(isVisible);
  const [activeSgzSample, setActiveSgzSample] = useState<any>(null);
  const [activePainelSample, setActivePainelSample] = useState<any>(null);
  
  useEffect(() => {
    setShowPanel(isVisible);
  }, [isVisible]);
  
  // Check samples when data changes
  useEffect(() => {
    if (sgzData && sgzData.length > 0) {
      setActiveSgzSample(sgzData[0]);
    }
    
    if (painelData && painelData.length > 0) {
      setActivePainelSample(painelData[0]);
    }
  }, [sgzData, painelData]);
  
  if (!showPanel) return null;
  
  const handleSampleSgz = () => {
    if (!sgzData || sgzData.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * sgzData.length);
    setActiveSgzSample(sgzData[randomIndex]);
  };
  
  const handleSamplePainel = () => {
    if (!painelData || painelData.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * painelData.length);
    setActivePainelSample(painelData[randomIndex]);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  return (
    <Card className="p-4 mt-4 border-dashed border-2 border-gray-300 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Debug Panel</h3>
        <div className="flex items-center gap-2">
          {isLoading && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Loading...
            </Badge>
          )}
          <Badge variant="outline">
            SGZ: {sgzData?.length || 0} records
          </Badge>
          <Badge variant="outline">
            Painel: {painelData?.length || 0} records
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPanel(false)}
          >
            Close
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="sgz">
        <TabsList className="mb-4 bg-gray-100">
          <TabsTrigger value="sgz">SGZ Data</TabsTrigger>
          <TabsTrigger value="painel">Painel Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sgz" className="space-y-4">
          <div className="flex justify-between mb-2">
            <h4 className="text-sm font-medium">Sample SGZ Record</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSampleSgz}
              disabled={!sgzData || sgzData.length === 0}
              className="text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              New Sample
            </Button>
          </div>
          
          <div className="bg-slate-800 text-white p-3 rounded-md text-xs">
            <div className="flex justify-between mb-1">
              <span>Sample from SGZ data:</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 p-1 text-gray-300 hover:text-white"
                onClick={() => activeSgzSample && copyToClipboard(JSON.stringify(activeSgzSample, null, 2))}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="overflow-auto max-h-[200px] whitespace-pre-wrap">
              {activeSgzSample ? JSON.stringify(activeSgzSample, null, 2) : 'No SGZ data available'}
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="painel" className="space-y-4">
          <div className="flex justify-between mb-2">
            <h4 className="text-sm font-medium">Sample Painel Record</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSamplePainel}
              disabled={!painelData || painelData.length === 0}
              className="text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              New Sample
            </Button>
          </div>
          
          <div className="bg-slate-800 text-white p-3 rounded-md text-xs">
            <div className="flex justify-between mb-1">
              <span>Sample from Painel data:</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 p-1 text-gray-300 hover:text-white"
                onClick={() => activePainelSample && copyToClipboard(JSON.stringify(activePainelSample, null, 2))}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="overflow-auto max-h-[200px] whitespace-pre-wrap">
              {activePainelSample ? JSON.stringify(activePainelSample, null, 2) : 'No Painel data available'}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ChartDebugPanel;
