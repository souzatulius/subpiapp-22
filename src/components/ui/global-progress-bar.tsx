
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
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
  const [value, setValue] = useState(0); // Initialize to 0 instead of propValue
  const location = useLocation();
  
  // Only show the progress bar on the ranking-subs page with exact path check
  const shouldShowProgressBar = location.pathname.includes('/dashboard/zeladoria/ranking-subs');
  
  useEffect(() => {
    // If not on the correct page, ensure progress is reset
    if (!shouldShowProgressBar) {
      setValue(0);
      return;
    }
    
    // Only handle progress logic when on correct page
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
    } else if (!isLoading) {
      // When loading completes, quickly go to 100% then reset
      if (value > 0) {
        setValue(100);
        const timer = setTimeout(() => {
          setValue(0);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, autoIncrement, value, propValue, shouldShowProgressBar]);

  // Don't render anything if not on the ranking-subs page or if progress is 0
  if (!shouldShowProgressBar || (!isLoading && value === 0)) {
    return null;
  }

  return (
    <motion.div 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 py-2 bg-orange-100 shadow-md",
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
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
  );
};

export default GlobalProgressBar;
