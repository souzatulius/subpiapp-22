
import { useMemo } from 'react';

export const useChartConfigs = () => {
  // New color palette
  const chartColors = useMemo(() => ['#f97316', '#0ea5e9', '#1e40af', '#71717a', '#27272a'], []);
  
  return {
    chartColors
  };
};
