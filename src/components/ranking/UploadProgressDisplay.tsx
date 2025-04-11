
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UploadProgressStats } from '@/hooks/ranking/types/uploadTypes';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadProgressDisplayProps {
  stats: UploadProgressStats;
  type: 'sgz' | 'painel';
}

const UploadProgressDisplay: React.FC<UploadProgressDisplayProps> = ({ stats, type }) => {
  const getProgressValue = () => {
    if (!stats.totalRows || stats.totalRows === 0) return 0;
    const progress = (stats.processedRows / stats.totalRows) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const progressValue = getProgressValue();
  const typeLabel = type === 'sgz' ? 'SGZ' : 'Painel';
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          {stats.stage === 'complete' && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {stats.stage === 'error' && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          {(stats.stage === 'uploading' || stats.stage === 'processing') && (
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          )}
          <span className="font-medium">{typeLabel}</span>
        </div>
        <span className="text-gray-500">
          {stats.stage === 'complete' 
            ? 'Concluído' 
            : stats.stage === 'error'
              ? 'Erro'
              : `${Math.round(progressValue)}%`}
        </span>
      </div>

      <Progress 
        value={progressValue} 
        className="h-2"
        indicatorClassName={
          stats.stage === 'complete' 
            ? "bg-green-500" 
            : stats.stage === 'error'
              ? "bg-red-500"
              : "bg-blue-500"
        }
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>{stats.message || (stats.stage === 'complete' ? 'Processamento concluído' : 'Processando...')}</span>
        {stats.stage === 'processing' && stats.estimatedTimeRemaining && (
          <span>Tempo restante: {stats.estimatedTimeRemaining}</span>
        )}
      </div>

      {stats.stage === 'complete' && (
        <div className="text-xs grid grid-cols-2 gap-x-4 mt-1">
          <div className="flex justify-between">
            <span>Registros processados:</span>
            <span className="font-medium">{stats.processedRows}</span>
          </div>
          <div className="flex justify-between">
            <span>Novos registros:</span>
            <span className="font-medium">{stats.newRows || 0}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadProgressDisplay;
