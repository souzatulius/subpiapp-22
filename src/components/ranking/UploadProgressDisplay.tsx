
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UploadProgressStats } from './types';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
          icon: <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />, 
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
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {stageDisplay.icon}
          </motion.div>
          <span className={stageDisplay.textColor}>
            {stageDisplay.text}: {progressPercent}%
          </span>
        </div>
        {stats.estimatedTimeRemaining && stats.stage === 'processing' && (
          <motion.span 
            className="text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Tempo restante: {stats.estimatedTimeRemaining}
          </motion.span>
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
        <motion.div 
          className="space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-green-600">+{stats.newRows} novas</span>
          <span className="text-amber-600">~{stats.updatedRows} atualizadas</span>
        </motion.div>
      </div>
      
      {stats.message && (
        <motion.p 
          className={`text-xs ${stats.stage === 'error' ? 'text-red-600' : 'text-gray-600'}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {stats.message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default UploadProgressDisplay;
