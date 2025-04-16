
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export type FeedbackType = 'success' | 'error' | 'warning' | 'loading';

interface AnimatedFeedbackProps {
  type: FeedbackType;
  message: string;
  visible: boolean;
  onClose?: () => void;
  duration?: number; // in milliseconds
  progress?: number; // for progress indicator
  options?: {
    progress?: number;
    stage?: string;
    animate?: boolean;
    duration?: number;
    [key: string]: any;
  };
}

export const AnimatedFeedback: React.FC<AnimatedFeedbackProps> = ({
  type = 'success',
  message,
  visible,
  onClose,
  duration = 3000, // Increased default duration for better visibility
  options = {}
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const { progress, stage, animate = true, duration: optionsDuration } = options;
  
  // Use duration from options if provided, otherwise use the prop
  const effectiveDuration = optionsDuration !== undefined ? optionsDuration : duration;
  
  useEffect(() => {
    setIsVisible(visible);
    
    let timer: NodeJS.Timeout;
    // Only auto-hide if duration is greater than 0 and not loading type
    if (visible && type !== 'loading' && effectiveDuration > 0) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, effectiveDuration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, effectiveDuration, onClose, type]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-md w-full px-4"
        >
          <div className={cn(
            "rounded-xl shadow-lg px-6 py-4 flex flex-col gap-3 mx-auto",
            type === 'success' ? "bg-green-100 text-green-800 border border-green-200" : 
            type === 'warning' ? "bg-orange-100 text-orange-800 border border-orange-200" :
            type === 'loading' ? "bg-blue-100 text-blue-800 border border-blue-200" :
            "bg-red-100 text-red-800 border border-red-200"
          )}>
            <div className="flex items-center gap-3">
              {type === 'success' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.1
                  }}
                >
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </motion.div>
              ) : type === 'warning' ? (
                <motion.div
                  animate={{ 
                    rotate: [-2, 2, -2], 
                    transition: { 
                      repeat: 2, 
                      duration: 0.2
                    } 
                  }}
                >
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                </motion.div>
              ) : type === 'loading' ? (
                <motion.div
                  animate={{ 
                    rotate: 360,
                    transition: {
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear"
                    }
                  }}
                >
                  <Loader2 className="h-6 w-6 text-blue-600" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ 
                    rotate: [-3, 3, -3], 
                    transition: { 
                      repeat: 2, 
                      duration: 0.2
                    } 
                  }}
                >
                  <XCircle className="h-6 w-6 text-red-600" />
                </motion.div>
              )}
              <p className="text-base font-medium">{message}</p>
            </div>
            
            {typeof progress === 'number' && (
              <div className="w-full space-y-1">
                <Progress 
                  value={progress} 
                  className={cn(
                    "h-2",
                    type === 'success' ? "bg-green-50" : 
                    type === 'warning' ? "bg-orange-50" :
                    type === 'loading' ? "bg-blue-50" :
                    "bg-red-50"
                  )}
                  indicatorClassName={
                    type === 'success' ? "bg-green-500" : 
                    type === 'warning' ? "bg-orange-500" :
                    type === 'loading' ? "bg-blue-500" :
                    "bg-red-500"
                  }
                />
                <div className="flex justify-between text-xs opacity-70">
                  <span>
                    {stage || "Processando"}
                  </span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}
            
            {/* Add a close button for user to dismiss */}
            {type !== 'loading' && (
              <button 
                onClick={() => {
                  setIsVisible(false);
                  if (onClose) onClose();
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Fechar"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedFeedback;
