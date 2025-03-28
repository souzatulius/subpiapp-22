import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2, RefreshCw, Clock, AlertCircle, FileSpreadsheet, CheckCircle, XCircle, FileText, Printer, Download } from 'lucide-react';
import { UploadInfo } from './types';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useExportPDF } from '@/hooks/consultar-notas/useExportPDF';
import { usePainelZeladoriaUpload } from './hooks/usePainelZeladoriaUpload';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface UploadSectionProps {
  onUpload: (file: File) => Promise<void>;
  lastUpload: UploadInfo | null;
  onDelete: (uploadId: string) => Promise<void>;
  isLoading: boolean;
  onRefreshCharts: () => void;
  uploads?: any[];
  uploadProgress?: number;
  processingStats?: {
    newOrders: number;
    updatedOrders: number;
    processingStatus: 'idle' | 'processing' | 'success' | 'error';
    errorMessage?: string;
  };
}

const UploadSection: React.FC<UploadSectionProps> = ({
  onUpload,
  lastUpload,
  onDelete,
  isLoading,
  onRefreshCharts,
  uploads = [],
  uploadProgress = 0,
  processingStats = {
    newOrders: 0,
    updatedOrders: 0,
    processingStatus: 'idle'
  }
}) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPainelFile, setSelectedPainelFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const painelFileInputRef = useRef<HTMLInputElement>(null);
  const { handleExportPDF } = useExportPDF();
  const { 
    isLoading: isPainelLoading,
    uploadProgress: painelUploadProgress,
    processamentoPainel,
    handleUploadPainel
  } = usePainelZeladoriaUpload(user);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePainelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedPainelFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePainelUploadClick = async () => {
    if (selectedPainelFile) {
      await handleUploadPainel(selectedPainelFile);
      setSelectedPainelFile(null);
      if (painelFileInputRef.current) {
        painelFileInputRef.current.value = '';
      }
    }
  };

  const handleRefreshClick = () => {
    toast.info('Atualizando gráficos com os dados mais recentes...');
    onRefreshCharts();
  };

  const handleDownloadTemplate = () => {
    const template = [{
      'Ordem de Serviço': 'OS-1001',
      'Classificação de Serviço': 'Tapa-buraco',
      'Fornecedor': 'Empresa A',
      'Criado em': new Date().toISOString(),
      'Status': 'Em Andamento',
      'Data do Status': new Date().toISOString(),
      'Bairro': 'Cerqueira César',
      'Distrito': 'Pinheiros'
    }, {
      'Ordem de Serviço': 'OS-1002',
      'Classificação de Serviço': 'Poda de árvore',
      'Fornecedor': 'Empresa B',
      'Criado em': new Date().toISOString(),
      'Status': 'PREPLAN',
      'Data do Status': new Date().toISOString(),
      'Bairro': 'Vila Olímpia',
      'Distrito': 'Itaim Bibi'
    }];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    XLSX.utils.book_append_sheet(wb, ws, 'SGZ Template');
    XLSX.writeFile(wb, 'modelo_sgz.xlsx');
    toast.success('Modelo de planilha SGZ baixado com sucesso!');
  };
  
  const handleExport = () => {
    if (uploads && uploads.length > 0) {
      const exportData = uploads.map(upload => ({
        'Arquivo': upload.nome_arquivo,
        'Data de Upload': new Date(upload.data_upload).toLocaleString('pt-BR'),
        'Status': upload.processado ? 'Concluído' : 'Processando'
      }));
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Histórico de Uploads');
      XLSX.writeFile(wb, 'historico_uploads_sgz.xlsx');
      toast.success('Histórico de uploads exportado com sucesso!');
    } else {
      toast.error('Não há dados para exportar.');
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Enviando para impressão...');
  };

  const getProgressText = () => {
    if (uploadProgress === 0) return "";
    if (uploadProgress < 25) return "Validando arquivo...";
    if (uploadProgress < 50) return "Processando dados...";
    if (uploadProgress < 75) return "Salvando no banco de dados...";
    if (uploadProgress < 100) return "Finalizando importação...";
    return "Concluído!";
  };

  const getStatusBadge = (upload: any) => {
    if (!upload.processado && upload === uploads[0]) {
      return <Badge className="bg-yellow-500 text-white">
          Processando
        </Badge>;
    } else if (upload.processado) {
      return <Badge className="bg-green-500 text-white">
          Concluído
        </Badge>;
    } else {
      return <Badge className="bg-gray-500 text-white">
          Desconhecido
        </Badge>;
    }
  };
  
  return (
    <Card className="border-orange-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-orange-700">Upload de Planilha SGZ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input 
              ref={fileInputRef} 
              type="file" 
              accept=".xls,.xlsx" 
              onChange={handleFileChange} 
              className="max-w-md" 
              disabled={isLoading || isPainelLoading} 
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleUploadClick} 
                disabled={!selectedFile || isLoading || isPainelLoading} 
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {isLoading ? 'Carregando...' : 'Carregar'}
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={handleRefreshClick} 
                disabled={isLoading || isPainelLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading || isPainelLoading ? 'animate-spin' : ''}`} />
                Atualizar gráficos
              </Button>
              
              <Button variant="outline" size="icon" onClick={handleExport} title="Exportar dados">
                <FileText className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={handlePrint} title="Imprimir relatório">
                <Printer className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={handleExportPDF} title="Exportar como PDF">
                <FileText className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={handleDownloadTemplate} title="Baixar modelo SGZ">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Upload do Painel da Zeladoria</h3>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input 
                ref={painelFileInputRef} 
                type="file" 
                accept=".xls,.xlsx" 
                onChange={handlePainelFileChange} 
                className="max-w-md" 
                disabled={isLoading || isPainelLoading} 
              />
              <Button 
                onClick={handlePainelUploadClick} 
                disabled={!selectedPainelFile || isLoading || isPainelLoading} 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {isPainelLoading ? 'Carregando...' : 'Carregar Painel'}
              </Button>
            </div>
            
            {isPainelLoading && painelUploadProgress > 0 && (
              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Processando dados do Painel...</span>
                  <span>{painelUploadProgress}%</span>
                </div>
                <Progress value={painelUploadProgress} className="h-2" />
              </div>
            )}
            
            {processamentoPainel.status === 'success' && (
              <div className="p-3 mt-2 border rounded-md bg-green-50 border-green-200 flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-700">Painel processado com sucesso!</p>
                  <p className="text-xs text-green-600">
                    {processamentoPainel.recordCount} registros importados
                  </p>
                </div>
              </div>
            )}
            
            {processamentoPainel.status === 'error' && (
              <div className="p-3 mt-2 border rounded-md bg-red-50 border-red-200 flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">Erro ao processar painel</p>
                  <p className="text-xs text-red-600">{processamentoPainel.message}</p>
                </div>
              </div>
            )}
          </div>
          
          {isLoading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{getProgressText()}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {processingStats.processingStatus === 'processing' && (
            <div className="p-3 border rounded-md bg-blue-50 border-blue-200 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
              <p className="text-sm text-blue-700">Processando planilha...</p>
            </div>
          )}
          
          {processingStats.processingStatus === 'success' && processingStats.newOrders + processingStats.updatedOrders > 0 && (
            <div className="p-3 border rounded-md bg-green-50 border-green-200 flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-700">Processamento concluído com sucesso!</p>
                <p className="text-xs text-green-600">
                  {processingStats.newOrders} novas ordens inseridas e {processingStats.updatedOrders} ordens atualizadas
                </p>
              </div>
            </div>
          )}
          
          {processingStats.processingStatus === 'error' && (
            <div className="p-3 border rounded-md bg-red-50 border-red-200 flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700">Erro ao processar planilha</p>
                <p className="text-xs text-red-600">{processingStats.errorMessage}</p>
              </div>
            </div>
          )}
          
          {lastUpload && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 p-3 border rounded-md bg-orange-50 border-orange-200">
                <div className="flex-1">
                  <p className="font-medium text-sm">{lastUpload.fileName}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-3 w-3" />
                    {lastUpload.uploadDate}
                    {!lastUpload.processed && <Badge className="ml-2 bg-yellow-500 text-white text-xs">Processando</Badge>}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-red-500" onClick={() => onDelete(lastUpload.id)} disabled={isLoading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {uploads && uploads.length > 1 && (
            <div className="mt-4">
              <Separator className="my-4" />
              <h3 className="text-sm font-medium mb-2">Histórico de Uploads</h3>
              <div className="max-h-44 overflow-y-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-orange-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Arquivo</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Data</th>
                      <th scope="col" className="px-3 py-2 text-xs font-medium text-orange-700 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-3 py-2 text-xs font-medium text-orange-700 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploads.slice(1).map(upload => <tr key={upload.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{upload.nome_arquivo}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          {new Date(upload.data_upload).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          {getStatusBadge(upload)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-xs">
                          <Button variant="ghost" size="sm" className="h-6 text-red-500 hover:text-red-700" onClick={() => onDelete(upload.id)} disabled={isLoading}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
