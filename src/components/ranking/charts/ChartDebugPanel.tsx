
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, Eye, Save, Edit, AlertCircle, RotateCcw, Info } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Define storage keys constants
const STORAGE_KEY_SGZ = 'demo-sgz-data';
const STORAGE_KEY_PAINEL = 'demo-painel-data';
const STORAGE_KEY_LAST_UPDATE = 'demo-last-update';
const STORAGE_KEY_DATA_SOURCE = 'demo-data-source';

interface ChartDebugPanelProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  isVisible?: boolean;
  isLoading?: boolean;
  onUpdateMockData?: (type: 'sgz' | 'painel', data: any[]) => Promise<void>;
  dataSource?: 'mock' | 'upload' | 'supabase';
  dataStatus?: {
    sgzCount: number;
    painelCount: number;
    lastSgzUpdate: string | null;
    lastPainelUpdate: string | null;
  };
}

const ChartDebugPanel: React.FC<ChartDebugPanelProps> = ({
  sgzData,
  painelData,
  isVisible = false,
  isLoading = false,
  onUpdateMockData,
  dataSource = 'mock',
  dataStatus
}) => {
  const [showPanel, setShowPanel] = useState<boolean>(isVisible);
  const [activeSgzSample, setActiveSgzSample] = useState<any>(null);
  const [activePainelSample, setActivePainelSample] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('sgz');
  
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

  // Debug log to verify that onUpdateMockData is available
  useEffect(() => {
    console.log("ChartDebugPanel mounted, onUpdateMockData available:", !!onUpdateMockData);
  }, [onUpdateMockData]);
  
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
  
  // Validate specific fields in parsed JSON
  const validateJsonFields = (jsonString: string, type: 'sgz' | 'painel'): { valid: boolean, error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return { valid: true }; // Empty array is valid
      }
      
      // Check first item to validate structure
      const firstItem = parsed[0];
      
      if (type === 'sgz') {
        const requiredFields = ['ordem_servico', 'sgz_status', 'sgz_tipo_servico', 'sgz_distrito'];
        for (const field of requiredFields) {
          if (!(field in firstItem)) {
            return { 
              valid: false, 
              error: `Campo obrigatório '${field}' ausente nos dados do SGZ` 
            };
          }
        }
      } else if (type === 'painel') {
        const requiredFields = ['id_os', 'status', 'tipo_servico', 'distrito'];
        for (const field of requiredFields) {
          if (!(field in firstItem)) {
            return { 
              valid: false, 
              error: `Campo obrigatório '${field}' ausente nos dados do Painel` 
            };
          }
        }
      }
      
      return { valid: true };
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  };
  
  // Handle saving mock data
  const handleSaveSgzMock = async () => {
    // Log the function availability
    console.log("Attempting to save SGZ mock data, onUpdateMockData available:", !!onUpdateMockData);
    
    // Validate JSON first
    const jsonValidation = validateJson(sgzJsonText);
    if (!jsonValidation.valid) {
      setSgzJsonError(jsonValidation.error || "JSON inválido");
      toast.error(`JSON inválido: ${jsonValidation.error}`);
      return;
    }
    
    // Validate fields and structure
    const fieldsValidation = validateJsonFields(sgzJsonText, 'sgz');
    if (!fieldsValidation.valid) {
      setSgzJsonError(fieldsValidation.error || "Estrutura de dados inválida");
      toast.error(`Estrutura de dados inválida: ${fieldsValidation.error}`);
      return;
    }
    
    try {
      setIsSavingSgz(true);
      const parsedData = JSON.parse(sgzJsonText);
      
      if (onUpdateMockData) {
        // Save to localStorage first to ensure data is not lost
        try {
          localStorage.setItem(STORAGE_KEY_SGZ, JSON.stringify(parsedData));
          localStorage.setItem(STORAGE_KEY_LAST_UPDATE, new Date().toISOString());
          localStorage.setItem(STORAGE_KEY_DATA_SOURCE, 'mock');
        } catch (storageError) {
          console.error("Error saving to localStorage:", storageError);
          // Continue with update anyway
        }
        
        await onUpdateMockData('sgz', parsedData);
        setEditingSgz(false);
        setSgzJsonError(null);
        setActiveTab('status'); // Switch to status tab to show updated information
        toast.success("Dados SGZ atualizados com sucesso!");
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
    // Log the function availability
    console.log("Attempting to save Painel mock data, onUpdateMockData available:", !!onUpdateMockData);
    
    // Validate JSON first
    const jsonValidation = validateJson(painelJsonText);
    if (!jsonValidation.valid) {
      setPainelJsonError(jsonValidation.error || "JSON inválido");
      toast.error(`JSON inválido: ${jsonValidation.error}`);
      return;
    }
    
    // Validate fields and structure
    const fieldsValidation = validateJsonFields(painelJsonText, 'painel');
    if (!fieldsValidation.valid) {
      setPainelJsonError(fieldsValidation.error || "Estrutura de dados inválida");
      toast.error(`Estrutura de dados inválida: ${fieldsValidation.error}`);
      return;
    }
    
    try {
      setIsSavingPainel(true);
      const parsedData = JSON.parse(painelJsonText);
      
      if (onUpdateMockData) {
        // Save to localStorage first to ensure data is not lost
        try {
          localStorage.setItem(STORAGE_KEY_PAINEL, JSON.stringify(parsedData));
          localStorage.setItem(STORAGE_KEY_LAST_UPDATE, new Date().toISOString());
          localStorage.setItem(STORAGE_KEY_DATA_SOURCE, 'mock');
        } catch (storageError) {
          console.error("Error saving to localStorage:", storageError);
          // Continue with update anyway
        }
        
        await onUpdateMockData('painel', parsedData);
        setEditingPainel(false);
        setPainelJsonError(null);
        setActiveTab('status'); // Switch to status tab to show updated information
        toast.success("Dados do Painel atualizados com sucesso!");
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
  
  // Get data source label
  const getDataSourceLabel = () => {
    switch(dataSource) {
      case 'mock': return 'Dados Mock (Demo)';
      case 'upload': return 'Upload Manual';
      case 'supabase': return 'Supabase (Produção)';
      default: return 'Desconhecido';
    }
  };
  
  // Get data source badge color
  const getDataSourceBadgeColor = () => {
    switch(dataSource) {
      case 'mock': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'upload': return 'bg-green-100 text-green-800 border-green-300';
      case 'supabase': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <Card className="p-4 mt-4 border-dashed border-2 border-gray-300 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-700">Debug Panel</h3>
          <Badge variant="outline" className={`ml-2 ${getDataSourceBadgeColor()}`}>
            {getDataSourceLabel()}
          </Badge>
        </div>
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
      
      <Tabs defaultValue="sgz" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-gray-100">
          <TabsTrigger value="sgz">SGZ Data</TabsTrigger>
          <TabsTrigger value="painel">Painel Data</TabsTrigger>
          <TabsTrigger value="status" className="animate-pulse">Status do Sistema</TabsTrigger>
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
        
        <TabsContent value="status" className="space-y-4">
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium mb-4 flex items-center">
              <Info className="w-4 h-4 mr-1 text-blue-500" />
              Status do Sistema
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Origem dos dados */}
              <div className="border rounded-md p-3 bg-gray-50">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Origem dos Dados</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fonte:</span>
                  <Badge className={getDataSourceBadgeColor()}>
                    {getDataSourceLabel()}
                  </Badge>
                </div>
              </div>
              
              {/* Última atualização */}
              <div className="border rounded-md p-3 bg-gray-50">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Última Atualização</h5>
                <div className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span>SGZ:</span> 
                    <span className="font-medium">{dataStatus?.lastSgzUpdate || 'Nunca'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Painel:</span> 
                    <span className="font-medium">{dataStatus?.lastPainelUpdate || 'Nunca'}</span>
                  </div>
                </div>
              </div>
              
              {/* Estatísticas de dados */}
              <div className="border rounded-md p-3 bg-gray-50">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Estatísticas</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 rounded p-2">
                    <div className="text-xs text-gray-600">Registros SGZ</div>
                    <div className="text-lg font-bold text-blue-700">{sgzData?.length || 0}</div>
                  </div>
                  <div className="bg-orange-50 rounded p-2">
                    <div className="text-xs text-gray-600">Registros Painel</div>
                    <div className="text-lg font-bold text-orange-700">{painelData?.length || 0}</div>
                  </div>
                </div>
              </div>
              
              {/* Status de sincronização */}
              <div className="border rounded-md p-3 bg-gray-50">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Status de Sincronização</h5>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache Storage:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Persistência:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      {localStorage.getItem('demo-sgz-data') ? 'Dados salvos' : 'Não inicializado'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Ações */}
              <div className="border rounded-md p-3 bg-gray-50 col-span-1 md:col-span-2">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Ações</h5>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      localStorage.removeItem(STORAGE_KEY_SGZ);
                      localStorage.removeItem(STORAGE_KEY_PAINEL);
                      localStorage.removeItem(STORAGE_KEY_LAST_UPDATE);
                      localStorage.removeItem(STORAGE_KEY_DATA_SOURCE);
                      toast.success("Cache limpo com sucesso");
                      
                      // Recarregar a página após 1 segundo
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }}
                    className="text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  >
                    Limpar Cache
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Diagrama de fluxo de dados simplificado */}
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium mb-4">Fluxo de Dados</h4>
            <div className="p-2 text-xs">
              <pre className="bg-gray-100 p-3 rounded-md overflow-auto">
{`Fluxo de Dados da Aplicação:

1. Fontes de Dados:
   - Mock Data (desenvolvimento)
   - Upload Manual (produção)
   - Supabase API (produção)

2. Armazenamento Local:
   - LocalStorage para persistência entre sessões
   - Cache em memória durante execução

3. Provedores de Estado:
   - DemoDataProvider: gerencia dados mock e uploads
   - useRankingCharts: gerencia estado dos gráficos
   - useUploadState: gerencia estado de uploads

4. Visualização:
   - RankingContent: renderiza gráficos baseados no estado
   - ChartDebugPanel: permite edição e visualização de dados

Origem atual: ${getDataSourceLabel()}
`}
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ChartDebugPanel;
