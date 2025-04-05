
import { useMemo } from 'react';

export const useChartConfigs = () => {
  // Enhanced color palette with standardized colors
  const chartColors = useMemo(() => ['#0066FF', '#1D4ED8', '#66FF66', '#F25C05', '#D4D4D4'], []);
  
  // Color sets for different chart types
  const pieChartColors = useMemo(() => {
    return {
      default: ['#0066FF', '#1D4ED8', '#66FF66', '#F25C05', '#D4D4D4'],
      blue: ['#0066FF', '#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD'],
      lightBlue: ['#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF'],
      status: ['#22c55e', '#0066FF', '#ef4444', '#71717a', '#27272a']
    };
  }, []);
  
  return {
    chartColors,
    pieChartColors
  };
};
