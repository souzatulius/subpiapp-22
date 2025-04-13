
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ChartDebugPanelProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  isVisible?: boolean;
  onUpdateMockData?: (type: 'sgz' | 'painel', data: any[]) => Promise<boolean>;
  dataSource: 'mock' | 'upload' | 'supabase';
  dataStatus: {
    sgzCount: number;
    painelCount: number;
    lastSgzUpdate: string | null;
    lastPainelUpdate: string | null;
    dataSource: string;
  };
  isLoading: boolean;
}

const ChartDebugPanel: React.FC<ChartDebugPanelProps> = ({
  sgzData,
  painelData,
  isVisible = true,
  onUpdateMockData,
  dataSource,
  dataStatus,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<string>('sgz');
  const [jsonView, setJsonView] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mockSimulation, setMockSimulation] = useState<boolean>(false);
  
  if (!isVisible) return null;
  
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Nunca';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Data inválida';
    }
  };
  
  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setJsonView(true);
  };
  
  const getDataSourceLabel = () => {
    switch(dataSource) {
      case 'mock': return 'Demonstração';
      case 'upload': return 'Upload Manual';
      case 'supabase': return 'Supabase';
      default: return 'Desconhecido';
    }
  };
  
  const getBadgeClass = () => {
    switch(dataSource) {
      case 'mock': return 'bg-amber-500';
      case 'upload': return 'bg-green-500';
      case 'supabase': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const handleSimulateProgress = () => {
    toast.info("Simulação de progresso iniciada");
    setMockSimulation(true);
    
    // Example simulation - just for demonstration
    const simulatedSgz = sgzData?.map(item => ({
      ...item,
      sgz_status: Math.random() > 0.5 ? 'CONCLUIDO' : 'EM_ANDAMENTO'
    }));
    
    if (onUpdateMockData && simulatedSgz) {
      onUpdateMockData('sgz', simulatedSgz)
        .then(success => {
          if (success) {
            toast.success("Simulação aplicada com sucesso");
          }
        })
        .catch(error => {
          console.error("Error simulating progress:", error);
          toast.error("Erro ao simular progresso");
        })
        .finally(() => {
          setMockSimulation(false);
        });
    } else {
      toast.error("Não foi possível iniciar simulação");
      setMockSimulation(false);
    }
  };
  
  const handleForceMockData = () => {
    // Load sample data from the mock files
    Promise.all([
      fetch('/mock/sgz_data_mock.json'),
      fetch('/mock/painel_data_mock.json')
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([sgzMock, painelMock]) => {
      // Store in localStorage
      localStorage.setItem('demo-sgz-data', JSON.stringify(sgzMock));
      localStorage.setItem('demo-painel-data', JSON.stringify(painelMock));
      localStorage.setItem('demo-data-source', 'mock');
      localStorage.setItem('demo-last-update', new Date().toISOString());
      localStorage.setItem('isMockData', 'true');
      
      // Update via callback if available
      if (onUpdateMockData) {
        onUpdateMockData('sgz', sgzMock)
          .then(() => onUpdateMockData('painel', painelMock))
          .then(() => {
            toast.success("Dados de demonstração carregados com sucesso");
          })
          .catch(error => {
            console.error("Error loading mock data:", error);
            toast.error("Erro ao carregar dados de demonstração");
          });
      } else {
        toast.success("Dados de demonstração carregados. Recarregue a página para ver as alterações.");
      }
    })
    .catch(error => {
      console.error("Error fetching mock data:", error);
      toast.error("Erro ao carregar dados de demonstração");
    });
  };
  
  const handleClearCache = () => {
    try {
      // Clear only demo data from localStorage
      localStorage.removeItem('demo-sgz-data');
      localStorage.removeItem('demo-painel-data');
      localStorage.setItem('demo-data-source', 'unknown');
      localStorage.removeItem('demo-last-update');
      localStorage.setItem('isMockData', 'false');
      
      toast.success("Cache local limpo com sucesso. Recarregue a página para ver as alterações.");
      
      // Update via callback if available
      if (onUpdateMockData) {
        onUpdateMockData('sgz', [])
          .then(() => onUpdateMockData('painel', []))
          .then(() => {
            toast.success("Dados removidos com sucesso");
          })
          .catch(error => {
            console.error("Error clearing data:", error);
          });
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast.error("Erro ao limpar cache local");
    }
  };
  
  const showCurrentLocalStorage = () => {
    try {
      const state = {
        total: 0,
        items: {} as Record<string, any>
      };
      
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            const size = value.length * 2; // rough estimate in bytes
            totalSize += size;
            
            if (key.startsWith('demo-')) {
              try {
                state.items[key] = JSON.parse(value);
              } catch {
                state.items[key] = value;
              }
            } else {
              state.items[key] = `[${(size / 1024).toFixed(2)}KB]`;
            }
          }
        }
      }
      
      state.total = totalSize / (1024 * 1024); // MB
      
      // Display in an iframe for better formatting
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: monospace; padding: 20px; }
              h2 { margin-top: 0; }
              pre { background: #f1f1f1; padding: 10px; border-radius: 5px; overflow: auto; }
            </style>
          </head>
          <body>
            <h2>Estado atual do localStorage:</h2>
            <p>Total utilizado: ~${state.total.toFixed(2)}MB</p>
            <div>
              <p><strong>demo-data-source:</strong> ${localStorage.getItem('demo-data-source') || 'não definido'}</p>
              <p><strong>SGZ registros:</strong> ${(state.items['demo-sgz-data']?.length || 0)}</p>
              <p><strong>Painel registros:</strong> ${(state.items['demo-painel-data']?.length || 0)}</p>
              <p><strong>Última atualização:</strong> ${formatDate(localStorage.getItem('demo-last-update'))}</p>
              <p><strong>isMockData:</strong> ${localStorage.getItem('isMockData') || 'não definido'}</p>
            </div>
          </body>
        </html>
      `;
      
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '50%';
      iframe.style.left = '50%';
      iframe.style.transform = 'translate(-50%, -50%)';
      iframe.style.width = '80%';
      iframe.style.height = '80%';
      iframe.style.backgroundColor = 'white';
      iframe.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.zIndex = '10000';
      
      const closeBtn = document.createElement('button');
      closeBtn.innerText = 'X';
      closeBtn.style.position = 'fixed';
      closeBtn.style.top = '10%';
      closeBtn.style.right = '10%';
      closeBtn.style.zIndex = '10001';
      closeBtn.style.backgroundColor = '#f44336';
      closeBtn.style.color = 'white';
      closeBtn.style.border = 'none';
      closeBtn.style.borderRadius = '50%';
      closeBtn.style.width = '40px';
      closeBtn.style.height = '40px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.fontSize = '20px';
      closeBtn.onclick = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(closeBtn);
      };
      
      document.body.appendChild(iframe);
      document.body.appendChild(closeBtn);
      
      iframe.contentWindow?.document.open();
      iframe.contentWindow?.document.write(html);
      iframe.contentWindow?.document.close();
      
    } catch (error) {
      console.error("Error showing localStorage:", error);
      toast.error("Erro ao mostrar localStorage");
    }
  };
  
  return (
    <Card className="mt-4 bg-gray-50 border border-amber-300">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-amber-800 flex items-center">
          <span className="mr-2">Debug Panel</span>
          <Badge className={getBadgeClass()}>
            {getDataSourceLabel()}
          </Badge>
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className={isLoading ? 'bg-amber-100' : 'bg-green-100'}>
            {isLoading ? 'Carregando...' : 'Pronto'}
          </Badge>
          <Badge className="bg-gray-700">
            SGZ: {dataStatus.sgzCount || 0}
          </Badge>
          <Badge className="bg-gray-700">
            Painel: {dataStatus.painelCount || 0}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs mb-2 grid grid-cols-2 gap-2">
          <div>
            <span className="font-bold">SGZ Atualização:</span> {formatDate(dataStatus.lastSgzUpdate)}
          </div>
          <div>
            <span className="font-bold">Painel Atualização:</span> {formatDate(dataStatus.lastPainelUpdate)}
          </div>
          <div>
            <span className="font-bold">Fonte de Dados:</span> {dataStatus.dataSource || dataSource}
          </div>
          <div>
            <span className="font-bold">Local Storage:</span> {localStorage.getItem('demo-data-source') || 'não definido'}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="sgz">SGZ ({sgzData?.length || 0})</TabsTrigger>
            <TabsTrigger value="painel">Painel ({painelData?.length || 0})</TabsTrigger>
            <TabsTrigger value="actions">Ações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sgz" className="max-h-96 overflow-auto">
            {jsonView && selectedItem ? (
              <div className="bg-gray-900 text-white p-3 text-xs overflow-auto relative rounded">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="absolute top-1 right-1 text-xs h-6 bg-gray-700 hover:bg-gray-600"
                  onClick={() => setJsonView(false)}
                >
                  Voltar
                </Button>
                <pre className="mt-6">{JSON.stringify(selectedItem, null, 2)}</pre>
              </div>
            ) : sgzData && sgzData.length > 0 ? (
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-1 border text-left">OS</th>
                    <th className="p-1 border text-left">Status</th>
                    <th className="p-1 border text-left">Serviço</th>
                    <th className="p-1 border text-left">Distrito</th>
                    <th className="p-1 border text-left">Data</th>
                    <th className="p-1 border text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sgzData.slice(0, 50).map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-1 border">{item.ordem_servico}</td>
                      <td className="p-1 border">{item.sgz_status}</td>
                      <td className="p-1 border truncate max-w-xs">{item.sgz_tipo_servico}</td>
                      <td className="p-1 border">{item.sgz_distrito}</td>
                      <td className="p-1 border">{new Date(item.sgz_criado_em || Date.now()).toLocaleDateString()}</td>
                      <td className="p-1 border">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 text-xs"
                          onClick={() => handleSelectItem(item)}
                        >
                          JSON
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Nenhum dado SGZ disponível
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="painel" className="max-h-96 overflow-auto">
            {jsonView && selectedItem ? (
              <div className="bg-gray-900 text-white p-3 text-xs overflow-auto relative rounded">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="absolute top-1 right-1 text-xs h-6 bg-gray-700 hover:bg-gray-600"
                  onClick={() => setJsonView(false)}
                >
                  Voltar
                </Button>
                <pre className="mt-6">{JSON.stringify(selectedItem, null, 2)}</pre>
              </div>
            ) : painelData && painelData.length > 0 ? (
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-1 border text-left">OS</th>
                    <th className="p-1 border text-left">Status</th>
                    <th className="p-1 border text-left">Serviço</th>
                    <th className="p-1 border text-left">Distrito</th>
                    <th className="p-1 border text-left">Respon.</th>
                    <th className="p-1 border text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {painelData.slice(0, 50).map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-1 border">{item.id_os}</td>
                      <td className="p-1 border">{item.status}</td>
                      <td className="p-1 border truncate max-w-xs">{item.tipo_servico}</td>
                      <td className="p-1 border">{item.distrito}</td>
                      <td className="p-1 border">{item.responsavel_real || item.responsavel_classificado}</td>
                      <td className="p-1 border">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 text-xs"
                          onClick={() => handleSelectItem(item)}
                        >
                          JSON
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Nenhum dado do Painel disponível
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Ações para dados:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={handleSimulateProgress}
                    disabled={mockSimulation || isLoading || !sgzData?.length}
                  >
                    Simular Progresso
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={handleForceMockData}
                    disabled={mockSimulation || isLoading}
                  >
                    Forçar Mock Data
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-orange-50 hover:bg-orange-100"
                    onClick={handleClearCache}
                    disabled={mockSimulation || isLoading}
                  >
                    Limpar Cache
                  </Button>
                </div>
                
                <h3 className="text-sm font-medium">Diagnóstico:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={showCurrentLocalStorage}
                  >
                    Ver LocalStorage
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      try {
                        console.log('SGZ Data:', sgzData);
                        console.log('Painel Data:', painelData);
                        console.log('Data Source:', dataSource);
                        console.log('localStorage:', {
                          'demo-data-source': localStorage.getItem('demo-data-source'),
                          'demo-last-update': localStorage.getItem('demo-last-update'),
                          'isMockData': localStorage.getItem('isMockData')
                        });
                        toast.info("Dados no console. Pressione F12 para visualizar.");
                      } catch (err) {
                        console.error("Debug log error:", err);
                      }
                    }}
                  >
                    Debug Log
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg space-y-1 text-xs">
                <h3 className="font-medium">Estado Atual:</h3>
                <p><strong>Data Source:</strong> {dataSource}</p>
                <p><strong>localStorage Source:</strong> {localStorage.getItem('demo-data-source') || 'não definido'}</p>
                <p><strong>isMockData:</strong> {localStorage.getItem('isMockData') || 'não definido'}</p>
                <p><strong>SGZ Registros:</strong> {sgzData?.length || 0}</p>
                <p><strong>Painel Registros:</strong> {painelData?.length || 0}</p>
                <p><strong>Última Atualização:</strong> {formatDate(localStorage.getItem('demo-last-update'))}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChartDebugPanel;
