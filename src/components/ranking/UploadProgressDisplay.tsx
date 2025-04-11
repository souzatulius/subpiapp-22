
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UploadProgressStats } from './types';
import { CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
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
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'Concluído'
        };
      case 'uploading':
        return { 
          icon: <Clock className="h-4 w-4 text-blue-600 animate-spin" />, 
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          text: 'Enviando'
        };
      case 'processing':
        return { 
          icon: <FileText className="h-4 w-4 text-amber-600 animate-pulse" />, 
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          text: 'Processando'
        };
      case 'error':
        return { 
          icon: <AlertCircle className="h-4 w-4 text-red-600" />, 
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'Erro'
        };
      default:
        return { 
          icon: null, 
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          text: 'Aguardando'
        };
    }
  };
  
  const stageDisplay = getStageDisplay();
  
  return (
    <motion.div 
      className={`space-y-2 p-3 rounded-lg border ${stageDisplay.borderColor} ${stageDisplay.bgColor}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {stageDisplay.icon && (
            <motion.div 
              animate={stats.stage === 'processing' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {stageDisplay.icon}
            </motion.div>
          )}
          <span className={`font-medium ${stageDisplay.textColor}`}>
            {stageDisplay.text}: {progressPercent}%
          </span>
        </div>
        {stats.estimatedTimeRemaining && stats.stage === 'processing' && (
          <motion.span 
            className="text-xs text-gray-500 bg-white/80 px-2 py-0.5 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Tempo restante: {stats.estimatedTimeRemaining}
          </motion.span>
        )}
      </div>
      
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Progress 
          value={progressPercent} 
          className={`h-2.5 ${stats.stage === 'error' ? 'bg-red-100' : 'bg-gray-100'}`}
          indicatorClassName={
            stats.stage === 'complete' ? 'bg-green-500' : 
            stats.stage === 'error' ? 'bg-red-500' : 
            stats.stage === 'processing' ? 'bg-amber-500' :
            'bg-blue-500'
          }
        />
      </motion.div>
      
      <div className="flex justify-between text-xs">
        <span className={`${stageDisplay.textColor} font-medium`}>
          {stats.processedRows} / {stats.totalRows} linhas
        </span>
        <motion.div 
          className="space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">+{stats.newRows} novas</span>
          <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">~{stats.updatedRows} atualizadas</span>
        </motion.div>
      </div>
      
      {stats.message && (
        <motion.p 
          className={`text-xs ${stats.stage === 'error' ? 'text-red-600' : 'text-gray-600'}`}
          initial={{ opacity: 0, y: 5 }}
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
