
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { handleFileUpload, handlePainelZeladoriaUpload } from '@/hooks/ranking/services/uploadService';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { UploadProgressStats, UploadStats } from './types';
import UploadProgressDisplay from './UploadProgressDisplay';
import { useUploadState } from '@/hooks/ranking/useUploadState';

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
  
  const { 
    sgzProgress, 
    painelProgress, 
    setSgzProgress, 
    setPainelProgress, 
    setLastRefreshTime 
  } = useUploadState();

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
    
    // Initialize progress tracking
    setSgzProgress({
      ...initialProgressState,
      stage: 'uploading',
      message: 'Iniciando upload do arquivo SGZ...',
      totalRows: 0,
    });
    
    try {
      const result = await handleFileUpload(
        file, 
        user, 
        (progress) => {
          setSgzProgress(prev => 
            prev ? ({
              ...prev,
              processedRows: prev.totalRows ? Math.floor((progress / 100) * prev.totalRows) : 0,
              stage: progress >= 100 ? 'complete' : (progress >= 30 ? 'processing' : 'uploading'),
              message: progress >= 100 
                ? 'Upload concluído!' 
                : (progress >= 30 ? 'Processando registros...' : 'Enviando arquivo...'),
            }) : null
          );
        },
        (stats) => {
          setSgzProgress(prev => {
            if (!prev) return null;
            
            const newSgzStats = {
              ...prev,
              totalRows: stats.totalRows || stats.totalServiceOrders || 100,
              newRows: stats.newOrders || 0,
              updatedRows: stats.updatedOrders || 0,
              message: stats.message || prev.message,
              stage: stats.processingStatus === 'processing' 
                ? 'processing' 
                : (stats.processingStatus === 'success' ? 'complete' : stats.processingStatus === 'error' ? 'error' : prev.stage)
            };
            
            // Add estimated time remaining
            if (newSgzStats.stage === 'processing') {
              newSgzStats.estimatedTimeRemaining = calculateEstimatedTime(newSgzStats);
            }
            
            return newSgzStats;
          });
        }
      );
      
      if (result && result.success) {
        setSgzProgress(prev => 
          prev ? ({
            ...prev,
            stage: 'complete',
            message: `Upload concluído: ${result.recordCount} registros processados`,
            processedRows: result.recordCount,
            totalRows: result.recordCount,
            newRows: result.newOrders || 0,
            updatedRows: result.updatedOrders || 0
          }) : null
        );
        
        showFeedback('success', `Upload da planilha SGZ concluído: ${result.recordCount} registros processados`, { duration: 3000 });
        
        onUploadComplete(result.id!, result.data || []);
      } else {
        setSgzProgress(prev => 
          prev ? ({
            ...prev,
            stage: 'error',
            message: `Erro no upload: ${result?.message || 'Erro desconhecido'}`
          }) : null
        );
        
        setIsSgzUploading(false);
        showFeedback('error', `Erro no upload: ${result?.message || 'Erro desconhecido'}`, { duration: 3000 });
      }
    } catch (err: any) {
      console.error('Error uploading SGZ file:', err);
      
      setSgzProgress(prev => 
        prev ? ({
          ...prev,
          stage: 'error',
          message: 'Erro ao processar arquivo SGZ'
        }) : null
      );
      
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
    
    // Initialize progress tracking
    setPainelProgress({
      ...initialProgressState,
      stage: 'uploading',
      message: 'Iniciando upload do arquivo do Painel...',
      totalRows: 0,
    });
    
    try {
      const result = await handlePainelZeladoriaUpload(
        file, 
        user, 
        (progress) => {
          setPainelProgress(prev => 
            prev ? ({
              ...prev,
              processedRows: prev.totalRows ? Math.floor((progress / 100) * prev.totalRows) : 0,
              stage: progress >= 100 ? 'complete' : (progress >= 30 ? 'processing' : 'uploading'),
              message: progress >= 100 
                ? 'Upload concluído!' 
                : (progress >= 30 ? 'Processando registros...' : 'Enviando arquivo...'),
            }) : null
          );
        },
        (stats) => {
          setPainelProgress(prev => {
            if (!prev) return null;
            
            const newPainelStats = {
              ...prev,
              totalRows: stats.totalRecords || stats.recordCount || 100,
              newRows: stats.recordCount || 0,
              updatedRows: 0,
              message: stats.message || prev.message,
              stage: stats.processingStatus === 'processing' 
                ? 'processing' 
                : (stats.processingStatus === 'success' ? 'complete' : stats.processingStatus === 'error' ? 'error' : prev.stage)
            };
            
            // Add estimated time remaining
            if (newPainelStats.stage === 'processing') {
              newPainelStats.estimatedTimeRemaining = calculateEstimatedTime(newPainelStats);
            }
            
            return newPainelStats;
          });
        }
      );
      
      if (result && result.success) {
        setPainelProgress(prev => 
          prev ? ({
            ...prev,
            stage: 'complete',
            message: `Upload concluído: ${result.recordCount} registros processados`,
            processedRows: result.recordCount,
            totalRows: result.recordCount,
            newRows: result.recordCount,
            updatedRows: 0
          }) : null
        );
        
        showFeedback('success', `Upload da planilha do Painel concluído: ${result.recordCount} registros processados`, { duration: 3000 });
        
        onPainelUploadComplete(result.id!, result.data || []);
      } else {
        setPainelProgress(prev => 
          prev ? ({
            ...prev,
            stage: 'error',
            message: `Erro no upload: ${result?.message || 'Erro desconhecido'}`
          }) : null
        );
        
        setIsPainelUploading(false);
        showFeedback('error', `Erro no upload: ${result?.message || 'Erro desconhecido'}`, { duration: 3000 });
      }
    } catch (err: any) {
      console.error('Error uploading Painel file:', err);
      
      setPainelProgress(prev => 
        prev ? ({
          ...prev,
          stage: 'error',
          message: 'Erro ao processar arquivo do Painel'
        }) : null
      );
      
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

  return (
    <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
