
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2, RefreshCw, Clock, FileSpreadsheet } from 'lucide-react';
import { SGZPlanilhaUpload } from '@/types/sgz';
import { toast } from 'sonner';

interface SGZUploadSectionProps {
  onUpload: (file: File) => Promise<void>;
  lastUpload: SGZPlanilhaUpload | null;
  onDelete: () => Promise<void>;
  isLoading: boolean;
  onRefresh?: () => void;
}

const SGZUploadSection: React.FC<SGZUploadSectionProps> = ({ 
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
      const validExtensions = ['.xls', '.xlsx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        toast.error('Formato de arquivo inválido! Por favor, selecione um arquivo Excel (.xls, .xlsx).');
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
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleRefreshClick = () => {
    if (onRefresh) {
      onRefresh();
      toast.success('Dados atualizados com sucesso');
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
          {!lastUpload && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex-1">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange}
                  className="max-w-md"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceitos: XLS, XLSX
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
          )}
          
          {lastUpload && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
                <FileSpreadsheet className="h-8 w-8 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{lastUpload.arquivo_nome}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-3 w-3" />
                    {new Date(lastUpload.data_upload || '').toLocaleString('pt-BR')}
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
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="secondary" 
                  className="w-full sm:w-auto"
                  onClick={handleRefreshClick}
                  disabled={isLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar dados
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                    setSelectedFile(null);
                  }}
                  disabled={isLoading || !lastUpload}
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Nova Planilha
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SGZUploadSection;
