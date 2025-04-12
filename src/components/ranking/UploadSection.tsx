import React, { useState, useEffect } from 'react';
import { usePainelZeladoriaUpload } from '@/hooks/ranking/usePainelZeladoriaUpload';
import { handleFileUpload } from '@/hooks/ranking/services/uploadService';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { ValidationError } from '@/hooks/ranking/types/uploadTypes';
import ErrorSummary from '@/components/ranking/ErrorSummary';
import { toast } from 'sonner';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { FileInput } from '@/components/ui/file-input';
import { Button } from '@/components/ui/button';
import UploadProgressDisplay from '@/components/ranking/UploadProgressDisplay';

interface UploadSectionProps {
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  onPainelUploadComplete: (id: string, data: any[]) => void;
  isUploading: boolean;
  user: any;
  onRefreshData: () => Promise<void>;
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
  const { toast: toastNotification } = useToast();
  const { 
    sgzProgress, 
    painelProgress, 
    setSgzProgress, 
    setPainelProgress, 
    validationErrors, 
    setValidationErrors 
  } = useUploadState();
  
  const { handleUploadPainel } = usePainelZeladoriaUpload(user);
  
  const handleSgzFileChange = (file: File | null) => {
    setSgzFile(file);
    setValidationErrors([]);
  };
  
  const handlePainelFileChange = (file: File | null) => {
    setPainelFile(file);
    setValidationErrors([]);
  };
  
  const uploadSgzFile = async () => {
    if (!sgzFile) {
      toastNotification({
        title: 'Erro',
        description: 'Por favor, selecione o arquivo SGZ para upload.',
        variant: 'destructive'
      });
      return;
    }
    
    onUploadStart();
    
    try {
      console.log("Starting SGZ file upload:", sgzFile.name);
      
      setSgzProgress({
        totalRows: 0,
        processedRows: 0,
        updatedRows: 0,
        newRows: 0,
        stage: 'uploading',
        message: 'Iniciando upload...',
      });
      
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
      
      console.log("SGZ upload result:", uploadResult);
      
      if (uploadResult && uploadResult.success) {
        toast.success(uploadResult.message);
        
        if (uploadResult.errors && uploadResult.errors.length > 0) {
          console.log(`Upload completed with ${uploadResult.errors.length} validation errors`);
          setValidationErrors(uploadResult.errors);
        } else {
          setValidationErrors([]);
        }
        
        try {
          localStorage.setItem('demo-data-source', 'upload');
          localStorage.setItem('demo-sgz-data', JSON.stringify(uploadResult.data || []));
          localStorage.setItem('demo-last-update', new Date().toISOString());
        } catch (error) {
          console.error("Error saving upload source to localStorage:", error);
        }
        
        onUploadComplete(uploadResult.id || 'no-id', uploadResult.data || []);
        
        try {
          await onRefreshData();
        } catch (refreshError) {
          console.error("Error refreshing data after upload:", refreshError);
          toast.error("Ocorreu um erro ao atualizar os gráficos");
        }
      } else {
        console.error('SGZ Upload failed:', uploadResult);
        
        toast.error(uploadResult?.message || 'Falha ao processar o arquivo SGZ.');
        
        if (uploadResult?.errors) {
          setValidationErrors(uploadResult.errors);
        }
        
        setSgzProgress({
          totalRows: 0,
          processedRows: 0,
          updatedRows: 0,
          newRows: 0,
          stage: 'error',
          message: uploadResult?.message || 'Erro no upload',
          errorCount: uploadResult?.errors?.length || 0
        });
      }
    } catch (error: any) {
      console.error('Error during SGZ file upload:', error);
      
      toast.error(`Ocorreu um erro inesperado: ${error.message}`);
      
      setSgzProgress({
        totalRows: 0,
        processedRows: 0,
        updatedRows: 0,
        newRows: 0,
        stage: 'error',
        message: `Erro: ${error.message}`,
      });
    }
  };
  
  const handlePainelUpload = async () => {
    if (!painelFile) {
      toast.error('Por favor, selecione o arquivo do Painel da Zeladoria para upload.');
      return;
    }
    
    onUploadStart();
    
    try {
      console.log("Starting Painel file upload:", painelFile.name);
      
      setPainelProgress({
        totalRows: 0,
        processedRows: 0,
        updatedRows: 0,
        newRows: 0,
        stage: 'uploading',
        message: 'Iniciando upload...',
      });
      
      const uploadResult = await handleUploadPainel(painelFile);
      console.log("Painel upload result:", uploadResult);
      
      if (uploadResult && uploadResult.success) {
        toast.success(uploadResult.message);
        
        try {
          localStorage.setItem('demo-data-source', 'upload');
          localStorage.setItem('demo-painel-data', JSON.stringify(uploadResult.data || []));
          localStorage.setItem('demo-last-update', new Date().toISOString());
        } catch (error) {
          console.error("Error saving upload source to localStorage:", error);
        }
        
        onPainelUploadComplete(uploadResult.id || 'no-id', uploadResult.data || []);
        
        try {
          await onRefreshData();
        } catch (refreshError) {
          console.error("Error refreshing data after upload:", refreshError);
          toast.error("Ocorreu um erro ao atualizar os gráficos");
        }
      } else {
        console.error('Painel Upload failed:', uploadResult);
        
        toast.error(uploadResult?.message || 'Falha ao processar o arquivo do Painel.');
        
        setPainelProgress({
          totalRows: 0,
          processedRows: 0,
          updatedRows: 0,
          newRows: 0,
          stage: 'error',
          message: uploadResult?.message || 'Erro no upload',
        });
      }
    } catch (error: any) {
      console.error('Error during Painel file upload:', error);
      
      toast.error(`Ocorreu um erro inesperado: ${error.message}`);
      
      setPainelProgress({
        totalRows: 0,
        processedRows: 0,
        updatedRows: 0,
        newRows: 0,
        stage: 'error',
        message: `Erro: ${error.message}`,
      });
    }
  };
  
  const showSgzProgress = sgzProgress && (sgzProgress.stage === 'uploading' || sgzProgress.stage === 'processing');
  const showPainelProgress = painelProgress && (painelProgress.stage === 'uploading' || painelProgress.stage === 'processing');
  
  return (
    <div className="flex flex-col space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Importar dados do SGZ
          </h3>
          
          <FileInput
            id="sgz-upload"
            accept=".xlsx, .xls"
            onChange={handleSgzFileChange}
            disabled={isUploading || showSgzProgress || showPainelProgress}
          />
          
          {sgzFile && (
            <div className="mt-2 text-sm text-gray-500">
              Arquivo selecionado: {sgzFile.name} ({Math.round(sgzFile.size / 1024)} KB)
            </div>
          )}
          
          <div className="flex justify-end mt-3">
            <Button
              onClick={uploadSgzFile}
              disabled={isUploading || !sgzFile || showSgzProgress || showPainelProgress}
              className="bg-blue-500 hover:bg-blue-700 text-white"
            >
              {isUploading && sgzFile ? 'Enviando...' : 'Enviar SGZ'}
            </Button>
          </div>
          
          {sgzProgress && sgzProgress.stage !== 'complete' && sgzProgress.stage !== 'error' && (
            <div className="mt-4">
              <UploadProgressDisplay stats={sgzProgress} type="sgz" />
            </div>
          )}
          
          {sgzProgress && (sgzProgress.stage === 'complete' || sgzProgress.stage === 'error') && (
            <div className="mt-4">
              <UploadProgressDisplay stats={sgzProgress} type="sgz" />
            </div>
          )}
          
          {validationErrors && validationErrors.length > 0 && (
            <div className="mt-4">
              <ErrorSummary errors={validationErrors} maxErrors={5} />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Importar dados do Painel da Zeladoria
          </h3>
          
          <FileInput
            id="painel-upload"
            accept=".xlsx, .xls"
            onChange={handlePainelFileChange}
            disabled={isUploading || showSgzProgress || showPainelProgress}
          />
          
          {painelFile && (
            <div className="mt-2 text-sm text-gray-500">
              Arquivo selecionado: {painelFile.name} ({Math.round(painelFile.size / 1024)} KB)
            </div>
          )}
          
          <div className="flex justify-end mt-3">
            <Button
              onClick={handlePainelUpload}
              disabled={isUploading || !painelFile || showSgzProgress || showPainelProgress}
              className="bg-blue-500 hover:bg-blue-700 text-white"
            >
              {isUploading && painelFile ? 'Enviando...' : 'Enviar Painel'}
            </Button>
          </div>
          
          {painelProgress && painelProgress.stage !== 'complete' && painelProgress.stage !== 'error' && (
            <div className="mt-4">
              <UploadProgressDisplay stats={painelProgress} type="painel" />
            </div>
          )}
          
          {painelProgress && (painelProgress.stage === 'complete' || painelProgress.stage === 'error') && (
            <div className="mt-4">
              <UploadProgressDisplay stats={painelProgress} type="painel" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSection;
