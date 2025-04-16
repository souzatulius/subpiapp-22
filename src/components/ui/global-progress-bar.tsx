
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface GlobalProgressBarProps {
  /** Whether the progress bar is currently active */
  isLoading?: boolean;
  /** The value of the progress (0-100) */
  value?: number;
  /** Whether to show the progress value as a label */
  showLabel?: boolean;
  /** Whether to auto-increment progress when no value is provided */
  autoIncrement?: boolean;
  /** Custom className for styling */
  className?: string;
}

/**
 * Global Progress Bar component that can be used to show loading status
 * throughout the application
 */
const GlobalProgressBar = ({
  isLoading = false,
  value: propValue,
  showLabel = false,
  autoIncrement = true,
  className
}: GlobalProgressBarProps) => {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  
  // Use strict path matching for the ranking-subs page
  const shouldShowProgressBar = location.pathname === '/dashboard/zeladoria/ranking-subs';
  
  useEffect(() => {
    // Immediate check to prevent any mounting on irrelevant pages
    if (!shouldShowProgressBar) {
      setVisible(false);
      setValue(0);
      return;
    }
    
    // Add a small delay before showing the progress bar to prevent flashing
    let showTimer: NodeJS.Timeout;
    if (isLoading && shouldShowProgressBar) {
      showTimer = setTimeout(() => {
        setVisible(true);
      }, 100); // Small delay to prevent flashing
    } else {
      // When loading completes, trigger the exit animation
      if (value > 0) {
        setValue(100);
        const completeTimer = setTimeout(() => {
          setVisible(false);
        }, 500);
        return () => clearTimeout(completeTimer);
      } else {
        setVisible(false);
      }
    }
    
    return () => clearTimeout(showTimer);
  }, [isLoading, shouldShowProgressBar]);
  
  useEffect(() => {
    // Only handle progress logic when on correct page and visible
    if (!shouldShowProgressBar || !visible) {
      return;
    }
    
    if (propValue !== undefined) {
      setValue(propValue);
    } else if (isLoading && autoIncrement && value < 90) {
      // Auto increment logic when no specific value is provided
      const timer = setTimeout(() => {
        setValue((prevValue) => {
          // Slow down the increment as it approaches 90%
          const increment = Math.max(1, 10 - Math.floor(prevValue / 10));
          return Math.min(90, prevValue + increment);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, autoIncrement, value, propValue, shouldShowProgressBar, visible]);

  // Don't render anything if not visible
  if (!visible) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className={cn(
            "fixed top-0 left-0 right-0 z-50 px-4 py-2 bg-orange-100 shadow-md",
            className
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3 }}
        >
          <Progress 
            value={value} 
            className="h-1.5 bg-orange-200" 
            indicatorClassName="bg-orange-500" 
          />
          {showLabel && (
            <div className="mt-1 text-xs text-orange-700 text-center">
              {value.toFixed(0)}%
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalProgressBar;
