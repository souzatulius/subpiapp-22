
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Download, Trash2, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SGZPlanilhaUpload } from '@/types/sgz';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SGZUploadSectionProps {
  lastUpload: SGZPlanilhaUpload | null;
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

const SGZUploadSection: React.FC<SGZUploadSectionProps> = ({
  lastUpload,
  isLoading,
  isUploading,
  uploadProgress,
  onUpload,
  onDelete,
  onRefresh
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
      setUploadSuccess(false);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      setUploadError(null);
      setUploadSuccess(false);
      
      try {
        await onUpload(selectedFile);
        setSelectedFile(null);
        setUploadSuccess(true);
        
        // Reset the file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Erro ao processar a planilha');
      }
    }
  };

  const getProgressMessage = () => {
    if (uploadProgress < 20) return 'Inicializando processamento...';
    if (uploadProgress < 40) return 'Analisando arquivo...';
    if (uploadProgress < 60) return 'Processando ordens de serviço...';
    if (uploadProgress < 80) return 'Salvando dados no banco...';
    return 'Finalizando processamento...';
  };

  const getEstimatedTime = () => {
    if (uploadProgress < 20) return '3-5 minutos restantes';
    if (uploadProgress < 50) return '2-3 minutos restantes';
    if (uploadProgress < 80) return '1 minuto restante';
    return 'Menos de 30 segundos';
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Gestão de Zeladoria</CardTitle>
        <CardDescription>
          Carregue uma planilha com os dados de ordens de serviço para visualizar os gráficos e análises
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isUploading && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                id="file-upload"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="max-w-md px-3 py-2 border rounded-md text-sm"
                disabled={isLoading || isUploading}
              />
              <Button 
                onClick={handleUploadClick}
                disabled={!selectedFile || isLoading || isUploading}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Carregar Planilha
              </Button>
            </div>
          )}
          
          {isUploading && (
            <div className="bg-slate-50 p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-orange-500 animate-pulse" />
                <h3 className="font-medium">Processando planilha</h3>
                <span className="ml-auto font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              
              <Progress value={uploadProgress} className="h-2 mb-2" />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{getProgressMessage()}</span>
                <span>{getEstimatedTime()}</span>
              </div>
            </div>
          )}

          {uploadSuccess && !isUploading && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Planilha processada com sucesso! Os gráficos foram atualizados.
              </AlertDescription>
            </Alert>
          )}
          
          {uploadError && !isUploading && (
            <Alert className="bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                {uploadError}
              </AlertDescription>
            </Alert>
          )}
          
          {lastUpload && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                <div>
                  <p className="font-medium text-sm">{lastUpload.arquivo_nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(lastUpload.data_upload || '').toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-500"
                    onClick={onRefresh}
                    disabled={isLoading || isUploading}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500" 
                    onClick={onDelete}
                    disabled={isLoading || isUploading}
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
  );
};

export default SGZUploadSection;
