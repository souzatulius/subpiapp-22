
import { useMemo } from 'react';

export const useChartConfigs = () => {
  // Enhanced color palette with standardized colors for gray theme
  const chartColors = useMemo(() => ['#444444', '#666666', '#888888', '#AAAAAA', '#D3D3D3'], []);
  
  // Color sets for different chart types
  const pieChartColors = useMemo(() => {
    return {
      default: ['#444444', '#666666', '#888888', '#AAAAAA', '#D3D3D3'],
      blue: ['#444444', '#555555', '#666666', '#777777', '#888888'],
      lightBlue: ['#777777', '#888888', '#999999', '#AAAAAA', '#CCCCCC'],
      gray: ['#333333', '#555555', '#777777', '#999999', '#BBBBBB'],
      status: ['#555555', '#666666', '#777777', '#888888', '#999999']
    };
  }, []);
  
  return {
    chartColors,
    pieChartColors
  };
};
