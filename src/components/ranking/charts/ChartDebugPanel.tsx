
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Save, FileJson, RefreshCw, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ChartDebugPanelProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  isVisible: boolean;
  onUpdateMockData?: (type: 'sgz' | 'painel', data: any[]) => Promise<boolean> | void;
  dataSource?: string;
  dataStatus?: Record<string, any>;
  isLoading?: boolean;
}

const ChartDebugPanel: React.FC<ChartDebugPanelProps> = ({
  sgzData,
  painelData,
  isVisible,
  onUpdateMockData,
  dataSource = 'unknown',
  dataStatus = {},
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState<'sgz' | 'painel' | 'status'>('sgz');
  const [sgzJsonString, setSgzJsonString] = useState<string>('');
  const [painelJsonString, setPainelJsonString] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Check if the component can update data
  const canUpdateData = typeof onUpdateMockData === 'function';
  const readOnlyMode = !canUpdateData;
  
  // Update the JSON strings when data changes
  React.useEffect(() => {
    if (sgzData && sgzData.length > 0) {
      try {
        setSgzJsonString(JSON.stringify(sgzData, null, 2));
      } catch (e) {
        console.error("Error stringifying SGZ data:", e);
        setSgzJsonString("Error parsing SGZ data");
      }
    }
  }, [sgzData]);
  
  React.useEffect(() => {
    if (painelData && painelData.length > 0) {
      try {
        setPainelJsonString(JSON.stringify(painelData, null, 2));
      } catch (e) {
        console.error("Error stringifying Painel data:", e);
        setPainelJsonString("Error parsing Painel data");
      }
    }
  }, [painelData]);
  
  if (!isVisible) return null;
  
  const handleSaveData = async (type: 'sgz' | 'painel') => {
    if (!onUpdateMockData) {
      toast.error("Função de atualização não disponível. Verifique se o componente está dentro de DemoDataProvider.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const jsonString = type === 'sgz' ? sgzJsonString : painelJsonString;
      let parsedData: any[] = [];
      
      try {
        parsedData = JSON.parse(jsonString);
      } catch (parseError) {
        toast.error(`Erro no formato JSON: ${String(parseError)}`);
        return;
      }
      
      if (!Array.isArray(parsedData)) {
        toast.error("Formato inválido: os dados devem ser um array de objetos");
        return;
      }
      
      console.log(`Saving ${type} data with ${parsedData.length} records`);
      const result = await onUpdateMockData(type, parsedData);
      
      if (result) {
        toast.success(`Dados ${type.toUpperCase()} salvos com sucesso. Refresh dos gráficos em andamento...`);
      }
    } catch (error) {
      console.error(`Error saving ${type} data:`, error);
      toast.error(`Erro ao salvar dados ${type}: ${String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleRefreshData = () => {
    try {
      if (sgzData) setSgzJsonString(JSON.stringify(sgzData, null, 2));
      if (painelData) setPainelJsonString(JSON.stringify(painelData, null, 2));
      toast.success("Dados atualizados");
    } catch (e) {
      console.error("Error refreshing data:", e);
      toast.error(`Erro ao atualizar dados: ${String(e)}`);
    }
  };
  
  return (
    <Card className="mt-4 border-orange-300">
      <CardHeader className="bg-orange-50 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-orange-700 flex items-center">
            Painel de Debug
            {readOnlyMode && (
              <span className="ml-2 bg-amber-100 text-amber-700 text-xs py-0.5 px-2 rounded-full flex items-center">
                <Info className="h-3 w-3 mr-1" /> Modo de leitura
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleRefreshData}
              disabled={isLoading || !sgzData || !painelData}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-orange-600 mt-1">
          <div className="flex justify-between">
            <div>
              Fonte de dados: <span className="font-medium">{dataSource || 'unknown'}</span>
            </div>
            <div>
              {sgzData?.length || 0} registros SGZ, {painelData?.length || 0} registros Painel
            </div>
          </div>
          
          {readOnlyMode && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 flex items-start">
              <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">Modo somente leitura:</span> Este componente não pode salvar alterações. Verifique se o componente está dentro de {`<DemoDataProvider>`}. Caso contrário, navegue para /zeladoria/ranking-subs para usar o modo de edição.
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <Tabs defaultValue="sgz" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="px-4 pt-2">
          <TabsList className="w-full bg-orange-100/50">
            <TabsTrigger value="sgz">SGZ ({sgzData?.length || 0})</TabsTrigger>
            <TabsTrigger value="painel">Painel ({painelData?.length || 0})</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-4">
          <TabsContent value="sgz" className="mt-0">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium">Dados SGZ</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveData('sgz')}
                disabled={readOnlyMode || isSaving || isLoading || !sgzJsonString}
                className="text-xs"
              >
                {isSaving && activeTab === 'sgz' ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Save className="h-3 w-3 mr-1" />
                )}
                Salvar alterações
              </Button>
            </div>
            
            <Textarea
              value={sgzJsonString}
              onChange={(e) => setSgzJsonString(e.target.value)}
              className="font-mono text-xs h-[400px] bg-slate-50"
              placeholder="Nenhum dado SGZ disponível"
              readOnly={isLoading || !sgzData}
            />
            
            {!canUpdateData && (
              <div className="mt-2 text-xs text-amber-600">
                <FileJson className="h-3 w-3 inline mr-1" />
                Somente visualização. Para editar, verifique se o componente está dentro de DemoDataProvider.
              </div>
            )}
          </TabsContent>

          <TabsContent value="painel" className="mt-0">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium">Dados do Painel</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveData('painel')}
                disabled={readOnlyMode || isSaving || isLoading || !painelJsonString}
                className="text-xs"
              >
                {isSaving && activeTab === 'painel' ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Save className="h-3 w-3 mr-1" />
                )}
                Salvar alterações
              </Button>
            </div>
            
            <Textarea
              value={painelJsonString}
              onChange={(e) => setPainelJsonString(e.target.value)}
              className="font-mono text-xs h-[400px] bg-slate-50"
              placeholder="Nenhum dado do Painel disponível"
              readOnly={isLoading || !painelData}
            />
            
            {!canUpdateData && (
              <div className="mt-2 text-xs text-amber-600">
                <FileJson className="h-3 w-3 inline mr-1" />
                Somente visualização. Para editar, verifique se o componente está dentro de DemoDataProvider.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="status" className="mt-0">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Status da aplicação</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fonte de dados:</span>
                  <span className="font-medium">{dataSource || 'Desconhecida'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Dados SGZ:</span>
                  <span>
                    {sgzData ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {sgzData.length} registros
                      </span>
                    ) : (
                      <span className="text-red-500">Indisponível</span>
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Dados Painel:</span>
                  <span>
                    {painelData ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {painelData.length} registros
                      </span>
                    ) : (
                      <span className="text-red-500">Indisponível</span>
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Modo de edição:</span>
                  <span>
                    {canUpdateData ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Disponível
                      </span>
                    ) : (
                      <span className="text-red-500">Indisponível</span>
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Estado de carregamento:</span>
                  <span>{isLoading ? 'Carregando...' : 'Completo'}</span>
                </div>
                
                {Object.entries(dataStatus || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default ChartDebugPanel;
