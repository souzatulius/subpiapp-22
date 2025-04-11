
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UploadProgressStats } from './types';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface UploadProgressDisplayProps {
  stats: UploadProgressStats;
  type: 'sgz' | 'painel';
}

const UploadProgressDisplay: React.FC<UploadProgressDisplayProps> = ({ stats, type }) => {
  // Calculate progress percentage
  const progressPercent = stats.totalRows > 0 
    ? Math.min(Math.round((stats.processedRows / stats.totalRows) * 100), 100)
    : (stats.stage === 'complete' ? 100 : 0);
  
  // Determine the right icon and color based on stage
  const getStageDisplay = () => {
    switch (stats.stage) {
      case 'complete':
        return { 
          icon: <CheckCircle className="h-4 w-4 text-green-600" />, 
          textColor: 'text-green-700',
          text: 'Concluído'
        };
      case 'uploading':
        return { 
          icon: <Clock className="h-4 w-4 text-blue-600 animate-spin" />, 
          textColor: 'text-blue-700',
          text: 'Enviando'
        };
      case 'processing':
        return { 
          icon: <Clock className="h-4 w-4 text-amber-600 animate-pulse" />, 
          textColor: 'text-amber-700',
          text: 'Processando'
        };
      case 'error':
        return { 
          icon: <AlertCircle className="h-4 w-4 text-red-600" />, 
          textColor: 'text-red-700',
          text: 'Erro'
        };
      default:
        return { 
          icon: null, 
          textColor: 'text-gray-700',
          text: 'Aguardando'
        };
    }
  };
  
  const stageDisplay = getStageDisplay();
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs">
          {stageDisplay.icon}
          <span className={stageDisplay.textColor}>
            {stageDisplay.text}: {progressPercent}%
          </span>
        </div>
        {stats.estimatedTimeRemaining && stats.stage === 'processing' && (
          <span className="text-xs text-gray-500">
            Tempo restante: {stats.estimatedTimeRemaining}
          </span>
        )}
      </div>
      
      <Progress 
        value={progressPercent} 
        className={`h-2 ${stats.stage === 'error' ? 'bg-red-100' : 'bg-gray-100'}`}
        indicatorClassName={
          stats.stage === 'complete' ? 'bg-green-500' : 
          stats.stage === 'error' ? 'bg-red-500' : 
          'bg-blue-500'
        }
      />
      
      <div className="flex justify-between text-xs text-gray-600">
        <span>
          {stats.processedRows} / {stats.totalRows} linhas
        </span>
        <div className="space-x-2">
          <span className="text-green-600">+{stats.newRows} novas</span>
          <span className="text-amber-600">~{stats.updatedRows} atualizadas</span>
        </div>
      </div>
      
      {stats.message && (
        <p className={`text-xs ${stats.stage === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
          {stats.message}
        </p>
      )}
    </div>
  );
};

export default UploadProgressDisplay;
