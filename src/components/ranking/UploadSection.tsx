
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2, RefreshCw, Clock, FileSpreadsheet } from 'lucide-react';
import { UploadInfo } from './types';
import { toast } from 'sonner';

interface UploadSectionProps {
  onUpload: (file: File) => Promise<void>;
  lastUpload: UploadInfo | null;
  onDelete: () => Promise<void>;
  isLoading: boolean;
  onRefresh?: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onUpload, 
  lastUpload, 
  onDelete,
  isLoading,
  onRefresh
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file is Excel format
      const validExtensions = ['.xls', '.xlsx', '.csv'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        toast.error('Formato de arquivo inválido! Por favor, selecione um arquivo Excel (.xls, .xlsx) ou CSV.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      try {
        await onUpload(selectedFile);
        toast.success('Planilha carregada com sucesso!');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast.error('Erro ao processar planilha. Por favor, tente novamente.');
        console.error('Upload error:', error);
      }
    }
  };

  const handleRefreshClick = () => {
    if (onRefresh) {
      onRefresh();
      toast.success('Gráficos atualizados com os dados mais recentes');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de Planilha SGZ</CardTitle>
        <CardDescription>
          Carregue uma planilha no formato padrão do SGZ com dados das ordens de serviço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={handleFileChange}
                className="max-w-md"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Formatos aceitos: XLS, XLSX, CSV
              </p>
            </div>
            <Button 
              onClick={handleUploadClick} 
              disabled={!selectedFile || isLoading}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {isLoading ? 'Processando...' : 'Carregar Planilha'}
            </Button>
          </div>
          
          {lastUpload && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
                <FileSpreadsheet className="h-8 w-8 text-orange-500" />
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
