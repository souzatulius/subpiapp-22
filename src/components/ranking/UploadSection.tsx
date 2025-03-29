
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadManagement } from '@/hooks/ranking/useUploadManagement';
import { usePainelZeladoriaUpload } from './hooks/usePainelZeladoriaUpload';
import { User } from '@supabase/supabase-js';
import { Progress } from '@/components/ui/progress';
import { UploadResult } from '@/hooks/ranking/types/uploadTypes';

interface UploadSectionProps {
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  onPainelUploadComplete: (id: string, data: any[]) => void;
  isUploading: boolean;
  user: User | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  onUploadStart,
  onUploadComplete,
  onPainelUploadComplete,
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
      try {
        const result = await handleUpload(files[0]);
        if (result && typeof result !== 'string') {
          onUploadComplete(result.id, result.data);
        }
      } catch (error) {
        console.error("Error handling file upload:", error);
        toast.error("Falha ao processar o arquivo");
      }
    }
  }, [handleUpload, onUploadComplete, onUploadStart]);

  const handlePainelFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadStart();
      try {
        const result = await handleUploadPainel(files[0]);
        if (result && typeof result !== 'string' && result.id) {
          onPainelUploadComplete(result.id, result.data || []);
          toast.success("Planilha do Painel da Zeladoria processada com sucesso!");
        }
      } catch (error) {
        console.error("Error handling painel file upload:", error);
        toast.error("Falha ao processar o arquivo do painel");
      }
    }
  }, [handleUploadPainel, onPainelUploadComplete, onUploadStart]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onUploadStart();
      try {
        const result = await handleUpload(files[0]);
        if (result && typeof result !== 'string') {
          onUploadComplete(result.id, result.data);
        }
      } catch (error) {
        console.error("Error handling dropped file:", error);
        toast.error("Falha ao processar o arquivo arrastado");
      }
    }
  }, [handleUpload, onUploadComplete, onUploadStart]);

  return (
    <div className="space-y-4">
      <Card
        className={`border-dashed ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-blue-300'
        } cursor-pointer transition-colors`}
        {...dragEvents}
        onDrop={handleDrop}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-blue-800">
            <FileUp className="h-5 w-5 mr-2 text-blue-600" />
            Upload da Planilha SGZ
          </CardTitle>
          <CardDescription className="text-blue-600">
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
                className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
                Selecionar Planilha SGZ
              </Button>
            </div>
            {isUploading && (
              <div className="w-full space-y-2">
                <Progress value={processingStats.processingStatus === 'processing' ? 50 : 100} className="bg-blue-100" />
                <p className="text-center text-sm text-blue-700">
                  {processingStats.processingStatus === 'processing' 
                    ? `Processando ${processingStats.newOrders || 0} registros...` 
                    : processingStats.errorMessage || "Processamento concluído"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed border-blue-300 cursor-pointer transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-blue-800">
            <FileUp className="h-5 w-5 mr-2 text-blue-600" />
            Upload do Painel da Zeladoria
          </CardTitle>
          <CardDescription className="text-blue-600">
            Faça upload da planilha do Painel da Zeladoria para análises comparativas
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
                className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
                disabled={isLoadingPainel}
              >
                <Upload className="h-4 w-4" />
                Selecionar Planilha do Painel
              </Button>
            </div>
            {isLoadingPainel && (
              <div className="w-full space-y-2">
                <Progress value={uploadProgress} className="bg-blue-100" />
                <p className="text-center text-sm text-blue-700">
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
