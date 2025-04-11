
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export type FeedbackType = 'success' | 'error' | 'warning';

interface AnimatedFeedbackProps {
  type: FeedbackType;
  message: string;
  visible: boolean;
  onClose?: () => void;
  duration?: number; // in milliseconds
}

export const AnimatedFeedback: React.FC<AnimatedFeedbackProps> = ({
  type = 'success',
  message,
  visible,
  onClose,
  duration = 2000,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  
  useEffect(() => {
    setIsVisible(visible);
    
    let timer: NodeJS.Timeout;
    if (visible) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, duration, onClose]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className={cn(
            "rounded-xl shadow-lg px-6 py-4 flex items-center gap-3",
            type === 'success' ? "bg-green-100 text-green-800 border border-green-200" : 
            type === 'warning' ? "bg-orange-100 text-orange-800 border border-orange-200" :
            "bg-red-100 text-red-800 border border-red-200"
          )}>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedFeedback;
