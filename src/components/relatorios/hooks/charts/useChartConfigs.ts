
import { useMemo } from 'react';

export const useChartConfigs = () => {
  // Enhanced color palette with orange, blue, and gray shades
  const chartColors = useMemo(() => [
    '#0368fe', // Blue primary
    '#f26812', // Orange secondary
    '#1e40af', // Dark blue
    '#64748e', // Gray
    '#c2410c', // Dark orange/brown
  ], []);
  
  // Color sets for different chart types
  const pieChartColors = useMemo(() => {
    return {
      default: ['#0368fe', '#f26812', '#1e40af', '#64748e', '#c2410c'],
      blue: ['#0368fe', '#1e40af', '#60A5FA', '#93C5FD', '#BFDBFE'],
      orange: ['#f26812', '#c2410c', '#FB923C', '#FDBA74', '#FED7AA'],
      gray: ['#64748e', '#334155', '#94A3B8', '#CBD5E1', '#F1F5F9'],
      status: ['#0368fe', '#f26812', '#64748e', '#10B981', '#EF4444'],
      mixed: ['#0368fe', '#f26812', '#1e40af', '#64748e', '#c2410c']
    };
  }, []);
  
  return {
    chartColors,
    pieChartColors
  };
};
