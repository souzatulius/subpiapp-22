
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, Eye, Save, Edit, AlertCircle, RotateCcw } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ChartDebugPanelProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  isVisible?: boolean;
  isLoading?: boolean;
  onUpdateMockData?: (type: 'sgz' | 'painel', data: any[]) => Promise<void>;
}

const ChartDebugPanel: React.FC<ChartDebugPanelProps> = ({
  sgzData,
  painelData,
  isVisible = false,
  isLoading = false,
  onUpdateMockData
}) => {
  const [showPanel, setShowPanel] = useState<boolean>(isVisible);
  const [activeSgzSample, setActiveSgzSample] = useState<any>(null);
  const [activePainelSample, setActivePainelSample] = useState<any>(null);
  
  // Edit mode state
  const [editingSgz, setEditingSgz] = useState<boolean>(false);
  const [editingPainel, setEditingPainel] = useState<boolean>(false);
  const [sgzJsonText, setSgzJsonText] = useState<string>('');
  const [painelJsonText, setPainelJsonText] = useState<string>('');
  const [sgzJsonError, setSgzJsonError] = useState<string | null>(null);
  const [painelJsonError, setPainelJsonError] = useState<string | null>(null);
  const [isSavingSgz, setIsSavingSgz] = useState<boolean>(false);
  const [isSavingPainel, setIsSavingPainel] = useState<boolean>(false);
  
  // Update panel visibility when prop changes
  useEffect(() => {
    setShowPanel(isVisible);
  }, [isVisible]);
  
  // Automatically select the first item and update JSON text when data changes
  useEffect(() => {
    if (sgzData && sgzData.length > 0) {
      setActiveSgzSample(sgzData[0]);
      setSgzJsonText(JSON.stringify(sgzData, null, 2));
      setSgzJsonError(null);
    }
  }, [sgzData]);
  
  useEffect(() => {
    if (painelData && painelData.length > 0) {
      setActivePainelSample(painelData[0]);
      setPainelJsonText(JSON.stringify(painelData, null, 2));
      setPainelJsonError(null);
    }
  }, [painelData]);
  
  if (!showPanel) return null;
  
  // Get random sample from SGZ data
  const handleSampleSgz = () => {
    if (!sgzData || sgzData.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * sgzData.length);
    setActiveSgzSample(sgzData[randomIndex]);
  };
  
  // Get random sample from Painel data
  const handleSamplePainel = () => {
    if (!painelData || painelData.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * painelData.length);
    setActivePainelSample(painelData[randomIndex]);
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência");
  };
  
  // Reset to original data
  const handleResetSgz = () => {
    if (sgzData) {
      setSgzJsonText(JSON.stringify(sgzData, null, 2));
      setSgzJsonError(null);
      toast.info("Dados SGZ restaurados ao original");
    }
  };
  
  const handleResetPainel = () => {
    if (painelData) {
      setPainelJsonText(JSON.stringify(painelData, null, 2));
      setPainelJsonError(null);
      toast.info("Dados do Painel restaurados ao original");
    }
  };
  
  // Validate JSON
  const validateJson = (jsonString: string): { valid: boolean, error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { valid: false, error: 'O JSON deve ser um array de objetos' };
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  };
  
  // Preview parsed JSON before saving
  const previewParsedJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      toast.info(`Prévia: ${Array.isArray(parsed) ? parsed.length : 0} registros`);
    } catch (error) {
      toast.error("JSON inválido, não foi possível mostrar prévia");
    }
  };
  
  // Handle saving mock data
  const handleSaveSgzMock = async () => {
    // Validate JSON first
    const validation = validateJson(sgzJsonText);
    if (!validation.valid) {
      setSgzJsonError(validation.error || "JSON inválido");
      toast.error(`JSON inválido: ${validation.error}`);
      return;
    }
    
    try {
      setIsSavingSgz(true);
      const parsedData = JSON.parse(sgzJsonText);
      
      if (onUpdateMockData) {
        await onUpdateMockData('sgz', parsedData);
        setEditingSgz(false);
        setSgzJsonError(null);
        toast.success(`SGZ mock data atualizado com sucesso: ${parsedData.length} registros`);
      } else {
        console.error("Update mock data function not available");
        toast.error("Função de atualização não disponível. Verifique se o componente está dentro de DemoDataProvider.");
      }
    } catch (error) {
      console.error('Error parsing or saving SGZ JSON:', error);
      toast.error(`Erro ao salvar: ${(error as Error).message}`);
    } finally {
      setIsSavingSgz(false);
    }
  };
  
  const handleSavePainelMock = async () => {
    // Validate JSON first
    const validation = validateJson(painelJsonText);
    if (!validation.valid) {
      setPainelJsonError(validation.error || "JSON inválido");
      toast.error(`JSON inválido: ${validation.error}`);
      return;
    }
    
    try {
      setIsSavingPainel(true);
      const parsedData = JSON.parse(painelJsonText);
      
      if (onUpdateMockData) {
        await onUpdateMockData('painel', parsedData);
        setEditingPainel(false);
        setPainelJsonError(null);
        toast.success(`Painel mock data atualizado com sucesso: ${parsedData.length} registros`);
      } else {
        console.error("Update mock data function not available");
        toast.error("Função de atualização não disponível. Verifique se o componente está dentro de DemoDataProvider.");
      }
    } catch (error) {
      console.error('Error parsing or saving Painel JSON:', error);
      toast.error(`Erro ao salvar: ${(error as Error).message}`);
    } finally {
      setIsSavingPainel(false);
    }
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
          <Badge variant="outline" className="bg-green-50 border-green-200">
            SGZ: {sgzData?.length || 0} records
          </Badge>
          <Badge variant="outline" className="bg-orange-50 border-orange-200">
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
            <div className="space-x-2">
              {!editingSgz ? (
                <>
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
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!sgzData || sgzData.length === 0}
                    className="text-xs"
                    onClick={() => {
                      if (sgzData) {
                        copyToClipboard(JSON.stringify(sgzData, null, 2));
                      }
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    onClick={() => setEditingSgz(true)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit Mock
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={handleSaveSgzMock}
                    disabled={isSavingSgz}
                  >
                    {isSavingSgz ? (
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3 mr-1" />
                    )}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleResetSgz()}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      try {
                        previewParsedJson(sgzJsonText);
                      } catch (error) {
                        // Already handled in previewParsedJson
                      }
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setEditingSgz(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {!editingSgz ? (
            <div className="bg-slate-800 text-white p-3 rounded-md text-xs">
              <div className="flex justify-between mb-1">
                <span>Sample from SGZ data:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 p-1 text-gray-300 hover:text-white"
                  onClick={() => activeSgzSample && copyToClipboard(JSON.stringify(activeSgzSample, null, 2))}
                  disabled={!activeSgzSample}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="overflow-auto max-h-[200px] whitespace-pre-wrap">
                {activeSgzSample ? JSON.stringify(activeSgzSample, null, 2) : 'No SGZ data available'}
              </pre>
            </div>
          ) : (
            <div className="bg-slate-800 text-white p-3 rounded-md text-xs">
              <div className="flex justify-between mb-1">
                <span>Edit SGZ mock data:</span>
                <div className="text-xs text-gray-400">Format: JSON Array</div>
              </div>
              <Textarea 
                value={sgzJsonText}
                onChange={(e) => {
                  setSgzJsonText(e.target.value);
                  setSgzJsonError(null); // Clear error on change
                }}
                className="font-mono text-xs bg-slate-900 text-white border-slate-700 h-[300px]"
              />
              {sgzJsonError && (
                <div className="mt-2 text-red-400 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {sgzJsonError}
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="painel" className="space-y-4">
          <div className="flex justify-between mb-2">
            <h4 className="text-sm font-medium">Sample Painel Record</h4>
            <div className="space-x-2">
              {!editingPainel ? (
                <>
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
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!painelData || painelData.length === 0}
                    className="text-xs"
                    onClick={() => {
                      if (painelData) {
                        copyToClipboard(JSON.stringify(painelData, null, 2));
                      }
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    onClick={() => setEditingPainel(true)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit Mock
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={handleSavePainelMock}
                    disabled={isSavingPainel}
                  >
                    {isSavingPainel ? (
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3 mr-1" />
                    )}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleResetPainel()}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      try {
                        previewParsedJson(painelJsonText);
                      } catch (error) {
                        // Already handled in previewParsedJson
                      }
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setEditingPainel(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {!editingPainel ? (
            <div className="bg-slate-800 text-white p-3 rounded-md text-xs">
              <div className="flex justify-between mb-1">
                <span>Sample from Painel data:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 p-1 text-gray-300 hover:text-white"
                  onClick={() => activePainelSample && copyToClipboard(JSON.stringify(activePainelSample, null, 2))}
                  disabled={!activePainelSample}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="overflow-auto max-h-[200px] whitespace-pre-wrap">
                {activePainelSample ? JSON.stringify(activePainelSample, null, 2) : 'No Painel data available'}
              </pre>
            </div>
          ) : (
            <div className="bg-slate-800 text-white p-3 rounded-md text-xs">
              <div className="flex justify-between mb-1">
                <span>Edit Painel mock data:</span>
                <div className="text-xs text-gray-400">Format: JSON Array</div>
              </div>
              <Textarea 
                value={painelJsonText}
                onChange={(e) => {
                  setPainelJsonText(e.target.value);
                  setPainelJsonError(null); // Clear error on change
                }}
                className="font-mono text-xs bg-slate-900 text-white border-slate-700 h-[300px]"
              />
              {painelJsonError && (
                <div className="mt-2 text-red-400 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {painelJsonError}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ChartDebugPanel;
