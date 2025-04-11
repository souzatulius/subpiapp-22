
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ListStart, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { handleFileUpload, handlePainelZeladoriaUpload } from '@/hooks/ranking/services/uploadService';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { UploadProgressStats, UploadStats } from './types';
import UploadProgressDisplay from './UploadProgressDisplay';

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
  const [uploadStats, setUploadStats] = useState<UploadStats>({});
  const { showFeedback } = useAnimatedFeedback();

  // Auto refresh data when uploads are complete
  useEffect(() => {
    const sgzComplete = uploadStats.sgz?.stage === 'complete';
    const painelComplete = uploadStats.painel?.stage === 'complete';
    
    if ((sgzComplete || painelComplete) && !uploadStats.lastRefreshed) {
      // Set a small delay before refreshing to ensure all data is committed
      const timer = setTimeout(() => {
        onRefreshData().then(() => {
          setUploadStats(prev => ({ 
            ...prev, 
            lastRefreshed: new Date() 
          }));
          
          showFeedback('success', 'Dados atualizados com sucesso');
        });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [uploadStats, onRefreshData, showFeedback]);

  // Calculate estimated time remaining for processing
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

  // Handle SGZ file upload
  const handleSGZFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadStart();
    
    // Initialize progress tracking
    setUploadStats(prev => ({
      ...prev,
      sgz: {
        ...initialProgressState,
        stage: 'uploading',
        message: 'Iniciando upload do arquivo SGZ...',
        totalRows: 0,
      },
      lastRefreshed: undefined
    }));
    
    try {
      const result = await handleFileUpload(
        file, 
        user, 
        (progress) => {
          setUploadStats(prev => ({
            ...prev,
            sgz: {
              ...prev.sgz!,
              processedRows: Math.floor((progress / 100) * (prev.sgz?.totalRows || 100)),
              stage: progress >= 100 ? 'complete' : (progress >= 30 ? 'processing' : 'uploading'),
              message: progress >= 100 
                ? 'Upload concluído!' 
                : (progress >= 30 ? 'Processando registros...' : 'Enviando arquivo...'),
            }
          }));
        },
        (stats) => {
          setUploadStats(prev => {
            const newSgzStats = {
              ...prev.sgz!,
              totalRows: stats.totalRows || stats.totalServiceOrders || 100,
              newRows: stats.newOrders || 0,
              updatedRows: stats.updatedOrders || 0,
              message: stats.message || prev.sgz?.message,
              stage: stats.processingStatus === 'processing' 
                ? 'processing' 
                : (stats.processingStatus === 'success' ? 'complete' : stats.processingStatus === 'error' ? 'error' : prev.sgz?.stage)
            };
            
            // Add estimated time remaining
            if (newSgzStats.stage === 'processing') {
              newSgzStats.estimatedTimeRemaining = calculateEstimatedTime(newSgzStats);
            }
            
            return {
              ...prev,
              sgz: newSgzStats
            };
          });
        }
      );
      
      if (result && result.success) {
        setUploadStats(prev => ({
          ...prev,
          sgz: {
            ...prev.sgz!,
            stage: 'complete',
            message: `Upload concluído: ${result.recordCount} registros processados`,
            processedRows: result.recordCount,
            totalRows: result.recordCount,
            newRows: result.newOrders || 0,
            updatedRows: result.updatedOrders || 0
          }
        }));
        
        showFeedback('success', `Upload da planilha SGZ concluído: ${result.recordCount} registros processados`);
        
        onUploadComplete(result.id!, result.data || []);
        
        // Data will be refreshed automatically via the useEffect
      } else {
        setUploadStats(prev => ({
          ...prev,
          sgz: {
            ...prev.sgz!,
            stage: 'error',
            message: `Erro no upload: ${result?.message || 'Erro desconhecido'}`
          }
        }));
        
        showFeedback('error', `Erro no upload: ${result?.message || 'Erro desconhecido'}`);
        toast.error(`Erro no upload: ${result?.message || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error('Error uploading SGZ file:', err);
      
      setUploadStats(prev => ({
        ...prev,
        sgz: {
          ...prev.sgz!,
          stage: 'error',
          message: 'Erro ao processar arquivo SGZ'
        }
      }));
      
      showFeedback('error', 'Erro ao processar arquivo SGZ');
      toast.error('Erro ao processar arquivo SGZ');
    } finally {
      // Reset the file input
      event.target.value = '';
    }
  };

  // Handle Painel file upload with similar improvements
  const handlePainelFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadStart();
    
    // Initialize progress tracking
    setUploadStats(prev => ({
      ...prev,
      painel: {
        ...initialProgressState,
        stage: 'uploading',
        message: 'Iniciando upload do arquivo do Painel...',
        totalRows: 0,
      },
      lastRefreshed: undefined
    }));
    
    try {
      const result = await handlePainelZeladoriaUpload(
        file, 
        user, 
        (progress) => {
          setUploadStats(prev => ({
            ...prev,
            painel: {
              ...prev.painel!,
              processedRows: Math.floor((progress / 100) * (prev.painel?.totalRows || 100)),
              stage: progress >= 100 ? 'complete' : (progress >= 30 ? 'processing' : 'uploading'),
              message: progress >= 100 
                ? 'Upload concluído!' 
                : (progress >= 30 ? 'Processando registros...' : 'Enviando arquivo...'),
            }
          }));
        },
        (stats) => {
          setUploadStats(prev => {
            const newPainelStats = {
              ...prev.painel!,
              totalRows: stats.totalRecords || stats.recordCount || 100,
              newRows: stats.recordCount || 0,
              updatedRows: 0,
              message: stats.message || prev.painel?.message,
              stage: stats.processingStatus === 'processing' 
                ? 'processing' 
                : (stats.processingStatus === 'success' ? 'complete' : stats.processingStatus === 'error' ? 'error' : prev.painel?.stage)
            };
            
            // Add estimated time remaining
            if (newPainelStats.stage === 'processing') {
              newPainelStats.estimatedTimeRemaining = calculateEstimatedTime(newPainelStats);
            }
            
            return {
              ...prev,
              painel: newPainelStats
            };
          });
        }
      );
      
      if (result && result.success) {
        setUploadStats(prev => ({
          ...prev,
          painel: {
            ...prev.painel!,
            stage: 'complete',
            message: `Upload concluído: ${result.recordCount} registros processados`,
            processedRows: result.recordCount,
            totalRows: result.recordCount,
            newRows: result.recordCount,
            updatedRows: 0
          }
        }));
        
        showFeedback('success', `Upload da planilha do Painel concluído: ${result.recordCount} registros processados`);
        
        onPainelUploadComplete(result.id!, result.data || []);
        
        // Data will be refreshed automatically via the useEffect
      } else {
        setUploadStats(prev => ({
          ...prev,
          painel: {
            ...prev.painel!,
            stage: 'error',
            message: `Erro no upload: ${result?.message || 'Erro desconhecido'}`
          }
        }));
        
        showFeedback('error', `Erro no upload: ${result?.message || 'Erro desconhecido'}`);
        toast.error(`Erro no upload: ${result?.message || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error('Error uploading Painel file:', err);
      
      setUploadStats(prev => ({
        ...prev,
        painel: {
          ...prev.painel!,
          stage: 'error',
          message: 'Erro ao processar arquivo do Painel'
        }
      }));
      
      showFeedback('error', 'Erro ao processar arquivo do Painel');
      toast.error('Erro ao processar arquivo do Painel');
    } finally {
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress Bars for Active Uploads */}
      {(uploadStats.sgz || uploadStats.painel) && (
        <div className="space-y-4">
          {uploadStats.sgz && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-sm text-blue-800 mb-2">Upload SGZ</h4>
              <UploadProgressDisplay stats={uploadStats.sgz} type="sgz" />
            </div>
          )}
          
          {uploadStats.painel && (
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <h4 className="font-medium text-sm text-indigo-800 mb-2">Upload Painel</h4>
              <UploadProgressDisplay stats={uploadStats.painel} type="painel" />
            </div>
          )}
        </div>
      )}
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SGZ Upload */}
        <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <ListStart className="h-8 w-8 text-blue-600 mb-2" />
          <h3 className="text-sm font-medium text-gray-700 mb-1">Planilha SGZ</h3>
          <p className="text-xs text-gray-500 mb-3 text-center">
            Upload do arquivo Excel exportado do SGZ
          </p>
          <input
            type="file"
            id="sgzFile"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleSGZFileUpload}
            disabled={isUploading}
          />
          <label htmlFor="sgzFile">
            <Button
              variant="outline"
              size="sm"
              className={`cursor-pointer ${isUploading ? 'bg-gray-200' : 'bg-gray-100'} text-gray-700 border-gray-300 hover:bg-gray-200`}
              disabled={isUploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading && (!uploadStats.sgz || uploadStats.sgz.stage !== 'complete') ? 'Processando...' : 'Selecionar Arquivo'}
              </span>
            </Button>
          </label>
        </div>

        {/* Painel Upload */}
        <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <CalendarDays className="h-8 w-8 text-blue-600 mb-2" />
          <h3 className="text-sm font-medium text-gray-700 mb-1">Painel da Zeladoria</h3>
          <p className="text-xs text-gray-500 mb-3 text-center">
            Upload do arquivo Excel do Painel da Zeladoria
          </p>
          <input
            type="file"
            id="painelFile"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handlePainelFileUpload}
            disabled={isUploading}
          />
          <label htmlFor="painelFile">
            <Button
              variant="outline"
              size="sm"
              className={`cursor-pointer ${isUploading ? 'bg-gray-200' : 'bg-gray-100'} text-gray-700 border-gray-300 hover:bg-gray-200`}
              disabled={isUploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading && (!uploadStats.painel || uploadStats.painel.stage !== 'complete') ? 'Processando...' : 'Selecionar Arquivo'}
              </span>
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
