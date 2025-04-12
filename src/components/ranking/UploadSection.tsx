import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { handleFileUpload, handlePainelZeladoriaUpload } from '@/hooks/ranking/services/uploadService';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { UploadProgressStats, ValidationError } from '@/hooks/ranking/types/uploadTypes';
import UploadProgressDisplay from './UploadProgressDisplay';
import { useUploadState } from '@/hooks/ranking/useUploadState';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ErrorSummary from './ErrorSummary';

interface UploadSectionProps {
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  onPainelUploadComplete: (id: string, data: any[]) => void;
  isUploading: boolean;
  user: any;
  onRefreshData: () => Promise<void>;
}

const initialProgressState: UploadProgressStats = {
  totalRows: 0,
  processedRows: 0,
  updatedRows: 0,
  newRows: 0,
  stage: 'uploading',
};

const UploadSection = ({
  onUploadStart,
  onUploadComplete,
  onPainelUploadComplete,
  isUploading,
  user,
  onRefreshData
}: UploadSectionProps) => {
  const [isSgzUploading, setIsSgzUploading] = useState(false);
  const [isPainelUploading, setIsPainelUploading] = useState(false);
  const { showFeedback } = useAnimatedFeedback();
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  
  const { 
    sgzProgress, 
    painelProgress, 
    setSgzProgress, 
    setPainelProgress, 
    setLastRefreshTime,
    resetProgress
  } = useUploadState();

  // Auto reset and collapse when both uploads complete successfully
  useEffect(() => {
    const sgzComplete = sgzProgress?.stage === 'complete';
    const painelComplete = painelProgress?.stage === 'complete';
    const anyError = sgzProgress?.stage === 'error' || painelProgress?.stage === 'error';
    
    if ((sgzComplete && isSgzUploading) || (painelComplete && isPainelUploading)) {
      // If upload was successful, show success feedback
      if (!anyError) {
        const successMessage = sgzComplete 
          ? `Upload da planilha SGZ concluído com sucesso!` 
          : `Upload da planilha do Painel concluído com sucesso!`;
        
        showFeedback('success', successMessage, { duration: 3000 });
      }
      
      // Reset upload state flags after a short delay
      const timer = setTimeout(() => {
        if (sgzComplete) setIsSgzUploading(false);
        if (painelComplete) setIsPainelUploading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [
    sgzProgress, 
    painelProgress, 
    isSgzUploading, 
    isPainelUploading,
    showFeedback
  ]);

  // Auto refresh data when uploads are complete
  useEffect(() => {
    const sgzComplete = sgzProgress?.stage === 'complete';
    const painelComplete = painelProgress?.stage === 'complete';
    
    // Only refresh when all active uploads are complete
    if ((sgzComplete && isSgzUploading) || (painelComplete && isPainelUploading)) {
      // Set a small delay before refreshing to ensure all data is committed
      const timer = setTimeout(() => {
        onRefreshData().then(() => {
          setLastRefreshTime(new Date());
          
          showFeedback('success', 'Dados atualizados com sucesso', { duration: 2000 });
          
          // Reset upload state flags
          if (sgzComplete) setIsSgzUploading(false);
          if (painelComplete) setIsPainelUploading(false);
        });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [
    sgzProgress, 
    painelProgress, 
    onRefreshData, 
    showFeedback, 
    isSgzUploading, 
    isPainelUploading, 
    setLastRefreshTime
  ]);

  // Handle SGZ file upload
  const handleSGZFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadStart();
    setIsSgzUploading(true);
    setIsOpen(true); // Keep the section open during upload
    setValidationErrors([]); // Reset previous validation errors
    setShowErrorDetails(false);
    
    // Initialize progress tracking
    const initialProgress: UploadProgressStats = {
      ...initialProgressState,
      stage: 'uploading',
      message: 'Iniciando upload do arquivo SGZ...',
      totalRows: 0,
    };
    
    setSgzProgress(initialProgress);
    
    try {
      const result = await handleFileUpload(
        file, 
        user, 
        (progress) => {
          setSgzProgress({
            ...initialProgress,
            processedRows: initialProgress.totalRows ? Math.floor((progress / 100) * initialProgress.totalRows) : 0,
            stage: progress >= 100 ? 'complete' : (progress >= 30 ? 'processing' : 'uploading'),
            message: progress >= 100 
              ? 'Upload concluído!' 
              : (progress >= 30 ? 'Processando registros...' : 'Enviando arquivo...'),
          });
        },
        (stats) => {
          const updatedStats: UploadProgressStats = {
            ...initialProgress,
            totalRows: stats.totalRows || 100,
            newRows: stats.newOrders || 0,
            updatedRows: stats.updatedOrders || 0,
            message: stats.message || initialProgress.message,
            errorCount: stats.errorCount || 0,
            validRows: stats.validRows || 0,
            skippedRows: stats.skippedRows || 0,
            stage: stats.processingStatus === 'processing' 
              ? 'processing' 
              : (stats.processingStatus === 'success' ? 'complete' : stats.processingStatus === 'error' ? 'error' : initialProgress.stage)
          };
          
          // Add estimated time remaining
          if (updatedStats.stage === 'processing') {
            updatedStats.estimatedTimeRemaining = calculateEstimatedTime(updatedStats);
          }
          
          setSgzProgress(updatedStats);
        }
      );
      
      if (result && result.success) {
        const completedStats: UploadProgressStats = {
          stage: 'complete',
          message: `Upload concluído: ${result.recordCount} registros processados`,
          processedRows: result.recordCount,
          totalRows: result.recordCount,
          newRows: result.newOrders || 0,
          updatedRows: result.updatedOrders || 0,
          errorCount: result.errors?.length || 0
        };
        
        setSgzProgress(completedStats);
        
        // Store validation errors for display
        if (result.errors && result.errors.length > 0) {
          setValidationErrors(result.errors);
          setShowErrorDetails(true);
        }
        
        onUploadComplete(result.id!, result.data || []);
      } else {
        const errorStats: UploadProgressStats = {
          ...initialProgress,
          stage: 'error',
          message: `Erro no upload: ${result?.message || 'Erro desconhecido'}`,
          errorCount: result?.errors?.length || 0
        };
        
        setSgzProgress(errorStats);
        
        // Store validation errors for display
        if (result?.errors && result.errors.length > 0) {
          setValidationErrors(result.errors);
          setShowErrorDetails(true);
        }
        
        setIsSgzUploading(false);
        showFeedback('error', `Erro no upload: ${result?.message || 'Erro desconhecido'}`, { duration: 3000 });
      }
    } catch (err: any) {
      console.error('Error uploading SGZ file:', err);
      
      const errorStats: UploadProgressStats = {
        ...initialProgress,
        stage: 'error',
        message: 'Erro ao processar arquivo SGZ'
      };
      
      setSgzProgress(errorStats);
      
      setIsSgzUploading(false);
      showFeedback('error', 'Erro ao processar arquivo SGZ', { duration: 3000 });
    } finally {
      // Reset the file input
      event.target.value = '';
    }
  };

  // Handle Painel file upload
  const handlePainelFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadStart();
    setIsPainelUploading(true);
    setIsOpen(true); // Keep the section open during upload
    
    // Initialize progress tracking
    const initialProgress: UploadProgressStats = {
      ...initialProgressState,
      stage: 'uploading',
      message: 'Iniciando upload do arquivo do Painel...',
      totalRows: 0,
    };
    
    setPainelProgress(initialProgress);
    
    try {
      const result = await handlePainelZeladoriaUpload(
        file, 
        user, 
        (progress) => {
          setPainelProgress({
            ...initialProgress,
            processedRows: initialProgress.totalRows ? Math.floor((progress / 100) * initialProgress.totalRows) : 0,
            stage: progress >= 100 ? 'complete' : (progress >= 30 ? 'processing' : 'uploading'),
            message: progress >= 100 
              ? 'Upload concluído!' 
              : (progress >= 30 ? 'Processando registros...' : 'Enviando arquivo...'),
          });
        },
        (stats) => {
          const updatedStats: UploadProgressStats = {
            ...initialProgress,
            totalRows: stats.totalRecords || stats.recordCount || 100,
            newRows: stats.recordCount || 0,
            updatedRows: 0,
            message: stats.message || initialProgress.message,
            stage: stats.processingStatus === 'processing' 
              ? 'processing' 
              : (stats.processingStatus === 'success' ? 'complete' : stats.processingStatus === 'error' ? 'error' : initialProgress.stage)
          };
          
          // Add estimated time remaining
          if (updatedStats.stage === 'processing') {
            updatedStats.estimatedTimeRemaining = calculateEstimatedTime(updatedStats);
          }
          
          setPainelProgress(updatedStats);
        }
      );
      
      if (result && result.success) {
        const completedStats: UploadProgressStats = {
          stage: 'complete',
          message: `Upload concluído: ${result.recordCount} registros processados`,
          processedRows: result.recordCount,
          totalRows: result.recordCount,
          newRows: result.recordCount,
          updatedRows: 0
        };
        
        setPainelProgress(completedStats);
        
        onPainelUploadComplete(result.id!, result.data || []);
      } else {
        const errorStats: UploadProgressStats = {
          ...initialProgress,
          stage: 'error',
          message: `Erro no upload: ${result?.message || 'Erro desconhecido'}`
        };
        
        setPainelProgress(errorStats);
        
        setIsPainelUploading(false);
        showFeedback('error', `Erro no upload: ${result?.message || 'Erro desconhecido'}`, { duration: 3000 });
      }
    } catch (err: any) {
      console.error('Error uploading Painel file:', err);
      
      const errorStats: UploadProgressStats = {
        ...initialProgress,
        stage: 'error',
        message: 'Erro ao processar arquivo do Painel'
      };
      
      setPainelProgress(errorStats);
      
      setIsPainelUploading(false);
      showFeedback('error', 'Erro ao processar arquivo do Painel', { duration: 3000 });
    } finally {
      // Reset the file input
      event.target.value = '';
    }
  };

  // Utility function for estimating time
  const calculateEstimatedTime = (stats: UploadProgressStats): string => {
    if (stats.processedRows === 0 || stats.totalRows === 0) return "Calculando...";
    
    const percentComplete = stats.processedRows / stats.totalRows;
    if (percentComplete >= 0.99) return "Menos de 5 segundos";
    
    // Estimate based on typical processing rate
    const remainingRows = stats.totalRows - stats.processedRows;
    const estimatedSecondsPerRow = 0.05; // Adjust based on actual performance
    const secondsRemaining = Math.ceil(remainingRows * estimatedSecondsPerRow);
    
    if (secondsRemaining < 60) return `${secondsRemaining} segundos`;
    if (secondsRemaining < 3600) {
      const minutes = Math.floor(secondsRemaining / 60);
      return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    return `${hours} ${hours === 1 ? 'hora' : 'horas'} e ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  };

  // Active uploads indicator
  const hasActiveUploads = sgzProgress || painelProgress;

  return (
    <div className="space-y-4">
      {/* Show progress indicators when uploads are active */}
      {hasActiveUploads && (
        <div className="p-3 bg-white rounded-lg border border-gray-200 animate-fade-in">
          <h3 className="text-sm font-medium mb-3">Importação em Andamento</h3>
          
          {sgzProgress && (
            <div className="mb-3">
              <UploadProgressDisplay stats={sgzProgress} type="sgz" />
            </div>
          )}
          
          {painelProgress && (
            <div>
              <UploadProgressDisplay stats={painelProgress} type="painel" />
            </div>
          )}
          
          {/* Show validation error summary if there are errors */}
          {validationErrors.length > 0 && (
            <div className="mt-4">
              <Collapsible 
                open={showErrorDetails} 
                onOpenChange={setShowErrorDetails}
                className="rounded-md"
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-between mb-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                  >
                    <span>
                      {validationErrors.length} {validationErrors.length === 1 ? 'erro' : 'erros'} de validação
                    </span>
                    <span>{showErrorDetails ? '▲ Ocultar' : '▼ Mostrar'}</span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ErrorSummary errors={validationErrors} />
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SGZ Upload */}
        <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Planilha SGZ</h3>
          <input
            type="file"
            id="sgzFile"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleSGZFileUpload}
            disabled={isSgzUploading || isPainelUploading}
          />
          <label htmlFor="sgzFile">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer bg-white shadow-sm text-gray-700 border-gray-300 hover:bg-gray-50"
              disabled={isSgzUploading || isPainelUploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {isSgzUploading ? 'Processando...' : 'Selecionar Arquivo'}
              </span>
            </Button>
          </label>
          <p className="text-xs text-gray-500 mt-2 text-center max-w-xs">
            Selecione uma planilha SGZ (.xlsx ou .xls) com colunas como "Ordem de Serviço", 
            "Classificação de Serviço", "Status", etc.
          </p>
        </div>

        {/* Painel Upload */}
        <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Painel da Zeladoria</h3>
          <input
            type="file"
            id="painelFile"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handlePainelFileUpload}
            disabled={isSgzUploading || isPainelUploading}
          />
          <label htmlFor="painelFile">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer bg-white shadow-sm text-gray-700 border-gray-300 hover:bg-gray-50"
              disabled={isSgzUploading || isPainelUploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {isPainelUploading ? 'Processando...' : 'Selecionar Arquivo'}
              </span>
            </Button>
          </label>
          <p className="text-xs text-gray-500 mt-2 text-center max-w-xs">
            Selecione uma planilha do Painel de Zeladoria (.xlsx ou .xls) com colunas como "Ordem de Serviço", 
            "Tipo de Serviço", "Status", etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
