
import React, { useState } from 'react';
import { usePainelZeladoriaUpload } from '@/hooks/ranking/usePainelZeladoriaUpload';
import { handleFileUpload } from '@/hooks/ranking/services/uploadService';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { UploadResult, ValidationError } from '@/hooks/ranking/types/uploadTypes';
import ErrorSummary from '@/components/ranking/ErrorSummary';
import { toast } from 'sonner';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { FileInput } from '@/components/ui/file-input';

interface UploadSectionProps {
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  onPainelUploadComplete: (id: string, data: any[]) => void;
  isUploading: boolean;
  user: any;
  onRefreshData: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  onUploadStart,
  onUploadComplete,
  onPainelUploadComplete,
  isUploading,
  user,
  onRefreshData
}) => {
  const [sgzFile, setSgzFile] = useState<File | null>(null);
  const [painelFile, setPainelFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { sgzProgress, painelProgress, setSgzProgress, setPainelProgress, setValidationErrors } = useUploadState();
  
  // Get the painel upload function from our hook
  const { handleUploadPainel } = usePainelZeladoriaUpload(user);
  
  const handleSgzFileChange = (file: File | null) => {
    setSgzFile(file);
  };
  
  const handlePainelFileChange = (file: File | null) => {
    setPainelFile(file);
  };
  
  const uploadSgzFile = async () => {
    if (!sgzFile) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione o arquivo SGZ para upload.',
        variant: 'destructive'
      });
      return;
    }
    
    onUploadStart();
    
    try {
      const uploadResult = await handleFileUpload(
        sgzFile,
        user,
        (progress: number) => {
          setSgzProgress({
            totalRows: 0,
            processedRows: 0,
            updatedRows: 0,
            newRows: 0,
            stage: 'uploading',
            message: `Processando... ${progress.toFixed(0)}%`,
          });
        },
        (stats: any) => {
          setSgzProgress(stats);
        }
      );
      
      if (uploadResult && uploadResult.success) {
        toast({
          title: 'Sucesso',
          description: uploadResult.message
        });
        
        onUploadComplete(uploadResult.id || 'no-id', uploadResult.data || []);
        setValidationErrors([]);
        onRefreshData();
      } else {
        console.error('SGZ Upload failed:', uploadResult);
        
        toast({
          title: 'Erro no Upload SGZ',
          description: uploadResult?.message || 'Falha ao processar o arquivo SGZ.',
          variant: 'destructive'
        });
        
        setValidationErrors(uploadResult?.errors || []);
      }
    } catch (error: any) {
      console.error('Error during SGZ file upload:', error);
      
      toast({
        title: 'Erro no Upload SGZ',
        description: `Ocorreu um erro inesperado: ${error.message}`,
        variant: 'destructive'
      });
    }
  };
  
  // Function to handle Painel upload
  const handlePainelUpload = async () => {
    if (!painelFile) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione o arquivo do Painel da Zeladoria para upload.',
        variant: 'destructive'
      });
      return;
    }
    
    onUploadStart();
    
    try {
      const uploadResult = await handleUploadPainel(painelFile);
      
      if (uploadResult && uploadResult.success) {
        toast({
          title: 'Sucesso',
          description: uploadResult.message
        });
        
        onPainelUploadComplete(uploadResult.id || 'no-id', uploadResult.data || []);
        onRefreshData();
      } else {
        console.error('Painel Upload failed:', uploadResult);
        
        toast({
          title: 'Erro no Upload Painel',
          description: uploadResult?.message || 'Falha ao processar o arquivo do Painel.',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error during Painel file upload:', error);
      
      toast({
        title: 'Erro no Upload Painel',
        description: `Ocorreu um erro inesperado: ${error.message}`,
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      {/* SGZ Upload */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Importar dados do SGZ
          </h3>
          <FileInput
            id="sgz-upload"
            accept=".xlsx, .xls"
            onChange={handleSgzFileChange}
            disabled={isUploading}
          />
          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={uploadSgzFile}
              disabled={isUploading || !sgzFile}
            >
              {isUploading ? 'Enviando...' : 'Enviar SGZ'}
            </button>
          </div>
          {sgzProgress && sgzProgress.errorCount !== undefined && sgzProgress.errorCount > 0 && (
            <ErrorSummary errors={[]} />
          )}
        </CardContent>
      </Card>
      
      {/* Painel Upload */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Importar dados do Painel da Zeladoria
          </h3>
          <FileInput
            id="painel-upload"
            accept=".xlsx, .xls"
            onChange={handlePainelFileChange}
            disabled={isUploading}
          />
          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handlePainelUpload}
              disabled={isUploading || !painelFile}
            >
              {isUploading ? 'Enviando...' : 'Enviar Painel'}
            </button>
          </div>
          {painelProgress && painelProgress.errorCount !== undefined && painelProgress.errorCount > 0 && (
            <ErrorSummary errors={[]} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSection;
