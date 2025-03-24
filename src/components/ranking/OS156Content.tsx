
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, Download, Trash2, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useOS156Data } from '@/hooks/ranking/useOS156Data';
import OS156Charts from './OS156Charts';
import OS156Filters from './OS156Filters';
import { FilterOptions } from './types';

const OS156Content: React.FC = () => {
  const { user } = useAuth();
  const {
    lastUpload,
    isLoading,
    chartData,
    osData,
    companies,
    filters,
    uploadProgress,
    handleFileUpload,
    deleteLastUpload,
    applyFilters
  } = useOS156Data(user);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

  useEffect(() => {
    if (uploadProgress > 0 && uploadProgress < 100) {
      // Calculate estimated time based on progress
      const remainingPercentage = 100 - uploadProgress;
      const estimatedSeconds = remainingPercentage * 0.5; // Rough estimate: 0.5 sec per percentage point
      
      if (estimatedSeconds > 60) {
        const minutes = Math.floor(estimatedSeconds / 60);
        const seconds = Math.floor(estimatedSeconds % 60);
        setEstimatedTime(`~${minutes}m ${seconds}s restantes`);
      } else {
        setEstimatedTime(`~${Math.ceil(estimatedSeconds)}s restantes`);
      }
    } else if (uploadProgress >= 100) {
      setEstimatedTime(null);
    }
  }, [uploadProgress]);

  const handleFiltersChange = (newFilters: Partial<FilterOptions>) => {
    applyFilters({ ...filters, ...newFilters } as any);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      await handleFileUpload(selectedFile);
      setSelectedFile(null);
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  const handleExportData = () => {
    // To be implemented - export data to CSV/Excel
    console.log('Export data');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análise de Ordens de Serviço 156</CardTitle>
          <CardDescription>
            Carregue uma planilha das ordens de serviço do Portal 156 para visualizar os gráficos e análises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                id="file-upload"
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={handleFileChange}
                className="max-w-md px-3 py-2 border rounded-md text-sm"
                disabled={isLoading}
              />
              <Button 
                onClick={handleUploadClick} 
                disabled={!selectedFile || isLoading}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {isLoading ? 'Processando...' : 'Carregar Planilha'}
              </Button>
            </div>
            
            {/* Upload Progress Indicator */}
            {isLoading && uploadProgress > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processando planilha...</span>
                  <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                {estimatedTime && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{estimatedTime}</span>
                  </div>
                )}
              </div>
            )}
            
            {lastUpload && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                  <div>
                    <p className="font-medium text-sm">{lastUpload.nome_arquivo}</p>
                    <p className="text-sm text-muted-foreground">{lastUpload.data_upload}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-gray-500"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500" 
                      onClick={deleteLastUpload}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <OS156Filters 
        filters={filters as any}
        onFiltersChange={handleFiltersChange}
        companies={companies}
        onApplyFilters={() => applyFilters(filters as any)}
      />
      
      <OS156Charts 
        data={chartData}
        isLoading={isLoading}
      />
      
      <div className="border-t pt-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleExportData}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar Dados
        </Button>
      </div>
    </div>
  );
};

export default OS156Content;
