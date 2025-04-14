
import { useMemo } from 'react';

export const useChartConfigs = () => {
  const chartColors = useMemo(() => [
    '#0066FF', // Blue
    '#F97316', // Orange
    '#10B981', // Green
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#64748B', // Slate
    '#0EA5E9', // Sky
  ], []);

  // Add pieChartColors to match what's being used in useMainChartComponents
  const pieChartColors = useMemo(() => [
    '#0066FF', // Blue
    '#F97316', // Orange
    '#10B981', // Green
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#64748B', // Slate
    '#0EA5E9', // Sky
  ], []);

  return { chartColors, pieChartColors };
};
