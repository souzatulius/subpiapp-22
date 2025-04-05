
import { cva } from 'class-variance-authority';

export const getBackgroundColorClass = (color: string): string => {
  const colorMapping: Record<string, string> = {
    'blue': 'bg-blue-50',
    'green': 'bg-green-50',
    'red': 'bg-red-50',
    'yellow': 'bg-yellow-50',
    'orange': 'bg-orange-50',
    'purple': 'bg-purple-50',
    'pink': 'bg-pink-50',
    'indigo': 'bg-indigo-50',
    'gray': 'bg-gray-50',
    'white': 'bg-white',
    // Gradients
    'gradient-blue': 'bg-gradient-to-br from-blue-50 to-blue-100',
    'gradient-green': 'bg-gradient-to-br from-green-50 to-green-100',
    'gradient-red': 'bg-gradient-to-br from-red-50 to-red-100',
    'gradient-orange': 'bg-gradient-to-br from-orange-50 to-orange-100',
    'gradient-yellow': 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    'gradient-purple': 'bg-gradient-to-br from-purple-50 to-purple-100',
    'gradient-communication': 'bg-gradient-to-r from-blue-700 to-blue-800',
    // Default
    'default': 'bg-white',
  };

  return colorMapping[color] || colorMapping.default;
};

export const getCardHeightClass = (height: string): string => {
  const heightMapping: Record<string, string> = {
    '1': 'h-32',
    '2': 'h-60',
    '3': 'h-80',
    'auto': 'h-auto',
    // Default
    'default': 'h-32',
  };

  return heightMapping[height] || heightMapping.default;
};
