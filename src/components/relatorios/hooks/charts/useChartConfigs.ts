
import { useMemo } from 'react';

export const useChartConfigs = () => {
  // Enhanced color palette with orange, blue, and gray
  const chartColors = useMemo(() => ['#F97316', '#0066FF', '#1E40AF', '#64748B', '#94A3B8'], []);
  
  // Color sets for different chart types
  const pieChartColors = useMemo(() => {
    return {
      default: ['#F97316', '#0066FF', '#1E40AF', '#64748B', '#94A3B8'],
      blue: ['#0066FF', '#1E40AF', '#60A5FA', '#93C5FD', '#BFDBFE'],
      orange: ['#F97316', '#EA580C', '#FB923C', '#FDBA74', '#FED7AA'],
      gray: ['#64748B', '#334155', '#94A3B8', '#CBD5E1', '#F1F5F9'],
      status: ['#0066FF', '#F97316', '#64748B', '#10B981', '#EF4444'],
      mixed: ['#F97316', '#EA580C', '#0066FF', '#1E40AF', '#64748B', '#334155']
    };
  }, []);
  
  return {
    chartColors,
    pieChartColors
  };
};
