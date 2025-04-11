
import React from 'react';
import { UploadProgressStats } from '@/hooks/ranking/types/uploadTypes';
import { Progress } from '@/components/ui/progress';
import { Loader } from 'lucide-react';

interface UploadProgressDisplayProps {
  stats: UploadProgressStats | null;
  type: 'sgz' | 'painel';
}

const UploadProgressDisplay: React.FC<UploadProgressDisplayProps> = ({ stats, type }) => {
  if (!stats) return null;
  
  const progress = stats.processedRows && stats.totalRows 
    ? Math.floor((stats.processedRows / stats.totalRows) * 100) 
    : 10;
    
  const typeLabel = type === 'sgz' ? 'SGZ' : 'Painel da Zeladoria';
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{typeLabel}</span>
        <span className="text-xs text-gray-500">
          {stats.stage === 'complete' 
            ? 'Concluído' 
            : stats.stage === 'processing' 
              ? 'Processando' 
              : stats.stage === 'uploading' 
                ? 'Enviando' 
                : stats.stage === 'error' 
                  ? 'Erro' 
                  : 'Aguardando'
          }
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
        <div 
          className={`h-1.5 rounded-full ${
            stats.stage === 'complete' 
              ? 'bg-green-500' 
              : stats.stage === 'error' 
                ? 'bg-red-500' 
                : 'bg-orange-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>
          {stats.stage === 'complete' 
            ? `${stats.processedRows || 0} registros processados` 
            : stats.stage === 'error' 
              ? stats.message || 'Erro de processamento' 
              : stats.message || 'Processando dados...'
          }
        </span>
        
        {stats.stage === 'processing' && stats.estimatedTimeRemaining && (
          <span className="flex items-center">
            <Loader className="inline h-3 w-3 mr-1 animate-spin" />
            {stats.estimatedTimeRemaining}
          </span>
        )}
      </div>
    </div>
  );
};

export default UploadProgressDisplay;
