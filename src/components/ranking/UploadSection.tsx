
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { UploadInfo } from './types';
import { toast } from 'sonner';

interface UploadSectionProps {
  onUpload: (file: File) => Promise<void>;
  lastUpload: UploadInfo | null;
  onDelete: () => Promise<void>;
  isLoading: boolean;
  onRefreshCharts: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onUpload, 
  lastUpload, 
  onDelete,
  isLoading,
  onRefreshCharts
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    toast.info('Atualizando gráficos com os dados mais recentes...');
    onRefreshCharts();
  };

  return (
    <Card className="border-orange-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-orange-700">Upload de Planilha SGZ</CardTitle>
        <CardDescription>
          Carregue uma planilha XLS/XLSX com dados das ordens de serviço do SGZ
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
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {isLoading ? 'Carregando...' : 'Carregar Planilha SGZ'}
            </Button>
          </div>
          
          {lastUpload && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 p-3 border rounded-md bg-orange-50 border-orange-200">
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

          <div className="flex items-start gap-2 p-3 border border-orange-200 rounded-md bg-orange-50">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-orange-800">Importante:</p>
              <p className="text-orange-700">
                A planilha SGZ deve conter as colunas: ordem_servico, sgz_departamento_tecnico (STM/STLP), 
                sgz_status, sgz_distrito, sgz_bairro, sgz_criado_em, sgz_modificado_em, sgz_empresa e sgz_tipo_servico.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
