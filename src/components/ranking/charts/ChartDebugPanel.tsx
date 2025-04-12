
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
            <span className="font-bold">Fonte de Dados:</span> {dataSource}
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
                      <td className="p-1 border">{new Date(item.sgz_criado_em).toLocaleDateString()}</td>
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
                <h3 className="text-sm font-medium">Ações para dados SGZ:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      if (sgzData && onUpdateMockData) {
                        // Update status of random items to simulate progress
                        const updatedData = sgzData.map((item, idx) => {
                          if (idx % 5 === 0 && item.sgz_status !== 'CONCLUIDO') {
                            return { ...item, sgz_status: 'CONCLUIDO' };
                          }
                          return item;
                        });
                        onUpdateMockData('sgz', updatedData);
                      }
                    }}
                  >
                    Simular Progresso
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      localStorage.setItem('demo-data-source', 'mock');
                      window.location.reload();
                    }}
                  >
                    Forçar Mock
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Limpeza e Diagnóstico:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs"
                    onClick={() => {
                      localStorage.removeItem('demo-sgz-data');
                      localStorage.removeItem('demo-painel-data');
                      localStorage.removeItem('demo-last-update');
                      localStorage.removeItem('demo-data-source');
                      localStorage.removeItem('ranking-charts-storage');
                      window.location.reload();
                    }}
                  >
                    Limpar Cache
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      const storageUsed = Object.keys(localStorage).reduce((total, key) => {
                        return total + ((localStorage[key].length * 2) / 1024 / 1024);
                      }, 0);
                      alert(`Estado atual do localStorage:\n\n` + 
                        `Total utilizado: ~${storageUsed.toFixed(2)}MB\n` +
                        `demo-data-source: ${localStorage.getItem('demo-data-source')}\n` +
                        `SGZ registros: ${sgzData?.length || 0}\n` +
                        `Painel registros: ${painelData?.length || 0}\n` +
                        `Última atualização: ${formatDate(localStorage.getItem('demo-last-update'))}\n` +
                        `isMockData: ${dataSource === 'mock' ? 'true' : 'false'}`
                      );
                    }}
                  >
                    Diagnóstico
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-3 rounded text-xs">
              <h3 className="font-medium mb-2">Dicas:</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>Use Alt+D para alternar a visibilidade do painel de debug</li>
                <li>O botão "Limpar Cache" apaga todos os dados armazenados localmente</li>
                <li>Caso os dados não apareçam, verifique se o dataSource está correto</li>
                <li>O botão "Forçar Mock" força o uso de dados de demonstração</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChartDebugPanel;
