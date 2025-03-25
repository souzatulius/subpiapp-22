
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Download, Trash2, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SGZPlanilhaUpload } from '@/types/sgz';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      setSelectedFile(null);
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Zeladoria</CardTitle>
        <CardDescription>
          Carregue uma planilha com os dados de ordens de serviço para visualizar os gráficos e análises
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
              {isUploading ? 'Processando...' : 'Carregar Planilha'}
            </Button>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Processando planilha...</div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
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
