
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface KPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  percentageChange?: number;
  suffix?: string;
  loading?: boolean;
  secondaryValue?: number;
  secondaryLabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  previousValue,
  percentageChange,
  suffix = '',
  loading = false,
  secondaryValue,
  secondaryLabel,
  variant = 'default',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Determine color based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'success': 
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      case 'warning': 
        return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200';
      case 'danger': 
        return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
      default: 
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
    }
  };

  // Animate the value when it changes
  useEffect(() => {
    if (loading) return;
    
    // Reset if we're loading
    if (value !== displayValue) {
      const animateValue = () => {
        const start = displayValue;
        const end = value;
        const duration = 1000;
        const startTime = performance.now();
        
        const updateValue = (currentTime: number) => {
          const elapsedTime = currentTime - startTime;
          if (elapsedTime >= duration) {
            setDisplayValue(end);
            return;
          }
          
          const progress = elapsedTime / duration;
          // Use easeOutExpo for smoother ending
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.round(start + (end - start) * easeProgress);
          
          setDisplayValue(currentValue);
          requestAnimationFrame(updateValue);
        };
        
        requestAnimationFrame(updateValue);
      };
      
      animateValue();
    }
  }, [value, loading]);

  // Determine if change is positive, negative, or neutral
  const isPositiveChange = percentageChange && percentageChange > 0;
  const isNegativeChange = percentageChange && percentageChange < 0;
  const hasChange = isPositiveChange || isNegativeChange;

  return (
    <div className={cn(
      "rounded-xl border p-4 shadow-sm h-40 flex flex-col justify-between transition-all",
      getVariantClasses()
    )}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-700">{title}</h3>
        {hasChange && (
          <div className={cn(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full",
            isPositiveChange ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {isPositiveChange ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            <span>{Math.abs(percentageChange).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Skeleton className="h-10 w-24 bg-gray-200/70" />
            </motion.div>
          ) : (
            <motion.div
              key="value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              <div className="text-3xl font-bold">
                {displayValue}{suffix}
              </div>
              
              {previousValue !== undefined && (
                <div className="text-xs text-gray-500">
                  Ontem: {previousValue}{suffix}
                </div>
              )}
              
              {secondaryValue !== undefined && secondaryLabel && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">{secondaryValue}</span> {secondaryLabel}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KPICard;
