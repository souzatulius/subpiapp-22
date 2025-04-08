
import { useMemo } from 'react';

export const useChartConfigs = () => {
  // Enhanced color palette with blue, orange, and gray
  const chartColors = useMemo(() => ['#0066FF', '#F97316', '#64748B', '#94A3B8', '#CBD5E1'], []);
  
  // Color sets for different chart types
  const pieChartColors = useMemo(() => {
    return {
      default: ['#0066FF', '#F97316', '#64748B', '#94A3B8', '#CBD5E1'],
      blue: ['#0066FF', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
      orange: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5'],
      gray: ['#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9'],
      status: ['#0066FF', '#F97316', '#64748B', '#10B981', '#EF4444'],
      mixed: ['#64748B', '#334155', '#F97316', '#C2410C', '#0066FF', '#0C4A6E']
    };
  }, []);
  
  return {
    chartColors,
    pieChartColors
  };
};
