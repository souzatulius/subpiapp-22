
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadManagement } from '@/hooks/ranking/useUploadManagement';
import { usePainelZeladoriaUpload } from './hooks/usePainelZeladoriaUpload';
import { User } from '@supabase/supabase-js';
import { Progress } from '@/components/ui/progress';

interface UploadSectionProps {
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  isUploading: boolean;
  user: User | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  onUploadStart,
  onUploadComplete,
  isUploading,
  user
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { handleUpload, processingStats } = useUploadManagement(user);
  const { 
    handleUploadPainel, 
    uploadProgress, 
    processamentoPainel, 
    isLoading: isLoadingPainel 
  } = usePainelZeladoriaUpload(user);

  const dragEvents = {
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
    },
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadStart();
      const result = await handleUpload(files[0]);
      if (result && result.id && result.data) {
        onUploadComplete(result.id, result.data);
      }
    }
  }, [handleUpload, onUploadComplete, onUploadStart]);

  const handlePainelFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const result = await handleUploadPainel(files[0]);
      if (result && result.id && result.data) {
        // Handle painel upload completion if needed
      }
    }
  }, [handleUploadPainel]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onUploadStart();
      const result = await handleUpload(files[0]);
      if (result && result.id && result.data) {
        onUploadComplete(result.id, result.data);
      }
    }
  }, [handleUpload, onUploadComplete, onUploadStart]);

  return (
    <div className="space-y-4">
      <Card
        className={`border-dashed ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
        } cursor-pointer transition-colors`}
        {...dragEvents}
        onDrop={handleDrop}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <FileUp className="h-5 w-5 mr-2 text-orange-500" />
            Upload da Planilha SGZ
          </CardTitle>
          <CardDescription>
            Arraste e solte sua planilha SGZ aqui ou clique para fazer upload
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg p-6">
            <div className="relative">
              <input
                id="sgz-upload"
                type="file"
                accept=".xlsx,.xls"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <Button 
                variant="outline" 
                className="gap-2"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
                Selecionar Planilha SGZ
              </Button>
            </div>
            {isUploading && (
              <div className="w-full space-y-2">
                <Progress value={processingStats.processingStatus === 'processing' ? 50 : 100} />
                <p className="text-center text-sm">
                  {processingStats.processingStatus === 'processing' 
                    ? `Processando ${processingStats.newOrders || 0} registros...` 
                    : processingStats.errorMessage || "Processamento concluído"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Segundo card para upload do Painel da Zeladoria */}
      <Card className="border-dashed border-gray-300 cursor-pointer transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <FileUp className="h-5 w-5 mr-2 text-orange-500" />
            Upload do Painel da Zeladoria
          </CardTitle>
          <CardDescription>
            Faça upload da planilha do Painel da Zeladoria para análises inteligentes
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg p-6">
            <div className="relative">
              <input
                id="painel-upload"
                type="file"
                accept=".xlsx,.xls"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handlePainelFileChange}
                disabled={isLoadingPainel}
              />
              <Button 
                variant="outline" 
                className="gap-2"
                disabled={isLoadingPainel}
              >
                <Upload className="h-4 w-4" />
                Selecionar Planilha do Painel
              </Button>
            </div>
            {isLoadingPainel && (
              <div className="w-full space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-center text-sm">
                  {processamentoPainel.status === 'processing' 
                    ? processamentoPainel.message 
                    : (processamentoPainel.status === 'success' 
                      ? `${processamentoPainel.message} (${processamentoPainel.recordCount} registros)` 
                      : processamentoPainel.message)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSection;
