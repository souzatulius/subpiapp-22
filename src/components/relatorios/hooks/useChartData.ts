
import { useState, useEffect } from 'react';
import { useChartComponents } from './useChartComponents';

export const useChartData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { chartComponents } = useChartComponents();

  // Here we return the chart components directly instead of extracting data types
  // that don't exist in the useChartComponents return value
  return {
    isLoading,
    chartComponents
  };
};
