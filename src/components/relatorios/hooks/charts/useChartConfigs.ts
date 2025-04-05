
import { useState } from 'react';

export const useChartConfigs = () => {
  // These color palettes can be used for different charts
  const chartColors = [
    '#f97316', // orange-500
    '#0ea5e9', // sky-500
    '#10b981', // emerald-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#f59e0b', // amber-500
    '#6366f1', // indigo-500
    '#14b8a6', // teal-500
  ];

  const colorSets = {
    blue: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'],
    orange: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'],
    green: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
    purple: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    mixed: chartColors
  };

  // Add pieChartColors for the pie charts
  const pieChartColors = [
    '#f97316', // orange-500
    '#0ea5e9', // sky-500
    '#10b981', // emerald-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
  ];

  return {
    chartColors,
    colorSets,
    pieChartColors
  };
};
