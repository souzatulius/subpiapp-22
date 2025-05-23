import React, { useState, useEffect } from 'react';
import { usePainelZeladoriaUpload } from '@/hooks/ranking/usePainelZeladoriaUpload';
import { handleFileUpload } from '@/hooks/ranking/services/uploadService';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { ValidationError } from '@/hooks/ranking/types/uploadTypes';
import ErrorSummary from '@/components/ranking/ErrorSummary';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import FileUploadWithProgress from '@/components/shared/FileUploadWithProgress';
import { Button } from '@/components/ui/button';
import UploadProgressDisplay from '@/components/ranking/UploadProgressDisplay';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';

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
    setSGZProgress, 
    setPainelProgress, 
    validationErrors, 
    setValidationErrors,
    resetProgress,
    setDataSource,
    setLastRefreshTime
  } = useUploadState();
  
  const { 
    setSgzData, 
    setPainelData, 
    setIsMockData,
    setDataSource: setRankingDataSource,
    refreshChartData
  } = useRankingCharts();
  
  const { handleUploadPainel } = usePainelZeladoriaUpload(user);
  
  useEffect(() => {
    if (!isUploading) {
      if (sgzProgress?.stage === 'complete' || painelProgress?.stage === 'complete') {
        setTimeout(() => {
          resetProgress();
        }, 3000);
      }
    }
  }, [isUploading, sgzProgress, painelProgress, resetProgress]);
  
  const handleSgzFileSelect = (file: File | null) => {
    setSgzFile(file);
    setValidationErrors([]);
    console.log("SGZ file selected:", file?.name);
  };
  
  const handlePainelFileSelect = (file: File | null) => {
    setPainelFile(file);
    setValidationErrors([]);
    console.log("Painel file selected:", file?.name);
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
      
      setSGZProgress({
        totalRows: 0,
        processedRows: 0,
        updatedRows: 0,
        newRows: 0,
        totalRecords: 0,
        processed: 0,
        success: 0,
        failed: 0,
        progress: 0,
        stage: 'uploading',
        message: 'Iniciando upload...'
      });
      
      const uploadResult = await handleFileUpload(
        sgzFile,
        user,
        (progress: number) => {
          setSGZProgress({
            totalRows: 0,
            processedRows: Math.round((progress/100) * 100),
            updatedRows: 0,
            newRows: 0,
            totalRecords: 0,
            processed: Math.round((progress/100) * 100),
            success: 0,
            failed: 0,
            progress: progress,
            stage: 'uploading',
            message: `Processando... ${progress.toFixed(0)}%`,
          });
        },
        (stats: any) => {
          setSGZProgress(stats);
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
        
        setDataSource('upload');
        setRankingDataSource('upload');
        setIsMockData(false);
        setLastRefreshTime(new Date());
        
        try {
          localStorage.setItem('demo-data-source', 'upload');
          localStorage.setItem('demo-sgz-data', JSON.stringify(uploadResult.data || []));
          localStorage.setItem('demo-last-update', new Date().toISOString());
          
          if (uploadResult.data && uploadResult.data.length > 0) {
            setSgzData(uploadResult.data);
          }
        } catch (error) {
          console.error("Error saving upload source to localStorage:", error);
        }
        
        onUploadComplete(uploadResult.id || 'no-id', uploadResult.data || []);
        
        setSgzFile(null);
        
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
        
        setSGZProgress({
          totalRows: 0,
          processedRows: 0,
          updatedRows: 0,
          newRows: 0,
          totalRecords: 0,
          processed: 0,
          success: 0,
          failed: 0,
          progress: 0,
          stage: 'error',
          message: uploadResult?.message || 'Erro no upload',
          errorCount: uploadResult?.errors?.length || 0
        });
        
        setSgzFile(null);
      }
    } catch (error: any) {
      console.error('Error during SGZ file upload:', error);
      
      toast.error(`Ocorreu um erro inesperado: ${error.message}`);
      
      setSGZProgress({
        totalRows: 0,
        processedRows: 0,
        updatedRows: 0,
        newRows: 0,
        totalRecords: 0,
        processed: 0,
        success: 0,
        failed: 0,
        progress: 0,
        stage: 'error',
        message: `Erro: ${error.message}`,
      });
      
      setSgzFile(null);
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
        
        setDataSource('upload');
        setRankingDataSource('upload');
        setIsMockData(false);
        setLastRefreshTime(new Date());
        
        try {
          localStorage.setItem('demo-data-source', 'upload');
          localStorage.setItem('demo-painel-data', JSON.stringify(uploadResult.data || []));
          localStorage.setItem('demo-last-update', new Date().toISOString());
          
          if (uploadResult.data && uploadResult.data.length > 0) {
            setPainelData(uploadResult.data);
          }
        } catch (error) {
          console.error("Error saving upload source to localStorage:", error);
        }
        
        onPainelUploadComplete(uploadResult.id || 'no-id', uploadResult.data || []);
        
        setPainelFile(null);
        
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
        
        setPainelFile(null);
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
      
      setPainelFile(null);
    }
  };
  
  const isActiveUpload = (progress: any) => 
    progress && (progress.stage === 'uploading' || progress.stage === 'processing');
  
  const isUploadingNow = isActiveUpload(sgzProgress) || isActiveUpload(painelProgress);
  const canUploadSGZ = !isUploadingNow && !!sgzFile;
  const canUploadPainel = !isUploadingNow && !!painelFile;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="min-h-[340px]">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Importar dados do SGZ
            </h3>
            
            <FileUploadWithProgress
              onFileSelected={handleSgzFileSelect}
              accept=".xlsx, .xls"
              maxSize={10}
              isLoading={isUploadingNow && isActiveUpload(sgzProgress)}
              progress={sgzProgress?.progress || 0}
              label={sgzFile ? sgzFile.name : "Selecionar arquivo SGZ"}
              helperText="Clique para selecionar ou arraste o arquivo"
              disabled={isUploadingNow && !sgzFile}
            />
            
            <div className="flex justify-end mt-3">
              <Button
                onClick={uploadSgzFile}
                disabled={!canUploadSGZ}
                className={`bg-blue-500 hover:bg-blue-700 text-white ${!canUploadSGZ ? 'opacity-50' : ''}`}
              >
                {isUploadingNow && sgzFile ? 'Enviando...' : 'Enviar SGZ'}
              </Button>
            </div>
            
            {sgzProgress && (
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
        
        <Card className="min-h-[340px]">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Importar dados do Painel da Zeladoria
            </h3>
            
            <FileUploadWithProgress
              onFileSelected={handlePainelFileSelect}
              accept=".xlsx, .xls"
              maxSize={10}
              isLoading={isUploadingNow && isActiveUpload(painelProgress)}
              progress={painelProgress?.processedRows || 0}
              label={painelFile ? painelFile.name : "Selecionar arquivo Painel"}
              helperText="Clique para selecionar ou arraste o arquivo"
              disabled={isUploadingNow && !painelFile}
            />
            
            <div className="flex justify-end mt-3">
              <Button
                onClick={handlePainelUpload}
                disabled={!canUploadPainel}
                className={`bg-blue-500 hover:bg-blue-700 text-white ${!canUploadPainel ? 'opacity-50' : ''}`}
              >
                {isUploadingNow && painelFile ? 'Enviando...' : 'Enviar Painel'}
              </Button>
            </div>
            
            {painelProgress && (
              <div className="mt-4">
                <UploadProgressDisplay stats={painelProgress} type="painel" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadSection;
