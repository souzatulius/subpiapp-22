
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface AnimatedNotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number; // in milliseconds
}

export const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({
  type = 'info',
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const [isActive, setIsActive] = useState(isVisible);
  
  useEffect(() => {
    setIsActive(isVisible);
    
    let timer: NodeJS.Timeout | undefined;
    
    if (isVisible && autoClose) {
      timer = setTimeout(() => {
        setIsActive(false);
        if (onClose) {
          setTimeout(onClose, 300); // Give time for exit animation
        }
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, duration, onClose, autoClose]);
  
  const getIconByType = () => {
    switch (type) {
      case 'success':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <CheckCircle className="h-6 w-6 text-green-500" />
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            animate={{ rotate: [-3, 3, -3], transition: { repeat: 2, duration: 0.2 } }}
          >
            <XCircle className="h-6 w-6 text-red-500" />
          </motion.div>
        );
      case 'warning':
        return (
          <motion.div
            animate={{ rotate: [-2, 2, -2], transition: { repeat: 2, duration: 0.2 } }}
          >
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </motion.div>
        );
      default:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              i
            </div>
          </motion.div>
        );
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-100';
      case 'error': return 'bg-red-50 border-red-100';
      case 'warning': return 'bg-amber-50 border-amber-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };
  
  const getTextColor = () => {
    switch (type) {
      case 'success': return 'text-green-800';
      case 'error': return 'text-red-800';
      case 'warning': return 'text-amber-800';
      default: return 'text-blue-800';
    }
  };
  
  const handleClose = () => {
    setIsActive(false);
    if (onClose) {
      setTimeout(onClose, 300); // Give time for exit animation
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 350, damping: 25 }}
          className={cn(
            "fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg border",
            getBgColor()
          )}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIconByType()}
              </div>
              <div className="ml-3 flex-1">
                <h3 className={cn("text-sm font-medium", getTextColor())}>{title}</h3>
                <div className={cn("mt-1 text-sm", getTextColor())}>{message}</div>
              </div>
              <button 
                type="button" 
                className={cn(
                  "ml-4 flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  type === 'success' ? "focus:ring-green-500" : 
                  type === 'error' ? "focus:ring-red-500" : 
                  type === 'warning' ? "focus:ring-amber-500" : 
                  "focus:ring-blue-500"
                )}
                onClick={handleClose}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          {autoClose && (
            <motion.div 
              initial={{ width: '100%' }} 
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className={cn(
                "h-1 rounded-b-lg",
                type === 'success' ? "bg-green-500" : 
                type === 'error' ? "bg-red-500" : 
                type === 'warning' ? "bg-amber-500" : 
                "bg-blue-500"
              )}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedNotification;
