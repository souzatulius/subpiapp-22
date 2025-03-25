
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, Trash2, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { UploadInfo } from './types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UploadSectionProps {
  onUpload: (file: File) => Promise<void>;
  lastUpload: UploadInfo | null;
  onDelete: () => Promise<void>;
  isLoading: boolean;
  uploadProgress?: number;
  uploadError?: string | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onUpload, 
  lastUpload, 
  onDelete,
  isLoading,
  uploadProgress = 0,
  uploadError = null
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUploading = isLoading && selectedFile;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
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

  const handleRefreshClick = () => {
    window.location.reload();
  };

  // Calculate estimated time
  const getEstimatedTime = () => {
    if (uploadProgress < 30) return "Estimando tempo...";
    if (uploadProgress < 70) return "Aproximadamente 1 minuto";
    if (uploadProgress < 95) return "Finalizando...";
    return "Concluído";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de Planilha</CardTitle>
        <CardDescription>
          Carregue uma planilha XLS/XLSX com dados das ordens de serviço
        </CardDescription>
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
              disabled={isLoading}
            />
            <Button 
              onClick={handleUploadClick} 
              disabled={!selectedFile || isLoading}
              className="w-full sm:w-auto"
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {isUploading ? 'Carregando...' : 'Carregar Planilha'}
            </Button>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Progresso do upload</span>
                <span className="text-sm font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{getEstimatedTime()}</span>
                {uploadProgress < 100 && <span>Não feche esta página</span>}
              </div>
            </div>
          )}
          
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro no upload</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
          
          {lastUpload && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-sm">{lastUpload.fileName}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-3 w-3" />
                    {lastUpload.uploadDate}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500" 
                  onClick={onDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full sm:w-auto"
                onClick={handleRefreshClick}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar gráficos
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
