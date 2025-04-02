
import { useMemo } from 'react';

export const useChartConfigs = () => {
  // Mixed color palette with orange, blue, dark blue, and gray shades
  const chartColors = useMemo(() => [
    '#f97316', // orange-500
    '#0ea5e9', // blue-500
    '#1e40af', // blue-800
    '#71717a', // gray-500
    '#27272a', // gray-800
    '#fb923c', // orange-400
    '#38bdf8', // blue-400
    '#2563eb', // blue-600
    '#52525b', // gray-600
    '#fdba74', // orange-300
  ], []);
  
  // Theme presets
  const themes = useMemo(() => ({
    orange: {
      name: 'Laranja',
      colors: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5']
    },
    blue: {
      name: 'Azul',
      colors: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe']
    },
    mixed: {
      name: 'Misto',
      colors: ['#f97316', '#0ea5e9', '#1e40af', '#71717a', '#27272a']
    },
    grayscale: {
      name: 'Tons de Cinza',
      colors: ['#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a', '#a1a1aa']
    }
  }), []);

  return {
    chartColors,
    themes
  };
};
