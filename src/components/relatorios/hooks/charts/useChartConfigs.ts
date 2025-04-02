
import { useMemo } from 'react';

export const useChartConfigs = () => {
  // Enhanced color palette with blue, dark blue, gray, and orange
  const chartColors = useMemo(() => ['#f97316', '#0ea5e9', '#1e40af', '#71717a', '#27272a'], []);
  
  // Color sets for different chart types
  const pieChartColors = useMemo(() => {
    return {
      default: ['#0ea5e9', '#1e40af', '#f97316', '#71717a', '#27272a'],
      orange: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'],
      blue: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'],
      status: ['#22c55e', '#f97316', '#ef4444', '#71717a', '#27272a']
    };
  }, []);
  
  return {
    chartColors,
    pieChartColors
  };
};
