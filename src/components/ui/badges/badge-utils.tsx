
import { cn } from "@/lib/utils";

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeStyleConfig {
  text: string;
  bg: string;
  borderColor: string;
  iconName: string;
}

export const getSizeClasses = (size: BadgeSize) => {
  const sizeClasses = {
    xs: 'text-[10px] py-0 px-1.5 h-4',
    sm: 'text-xs py-0.5 px-2 h-5',
    md: 'text-sm py-1 px-2.5 h-6',
    lg: 'text-sm py-1.5 px-3 h-7',
  };
  return sizeClasses[size];
};

export const getIconSize = (size: BadgeSize) => {
  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
  };
  return iconSizes[size];
};

// Helper for priority badge
export const formatarPrioridade = (prioridade: string) => {
  switch (prioridade.toLowerCase()) {
    case 'alta': return 'Alta';
    case 'media': return 'Média';
    case 'baixa': return 'Baixa';
    default: return prioridade;
  }
};

export const getPriorityBadgeColors = (prioridade: string) => {
  switch (prioridade.toLowerCase()) {
    case 'alta':
      return 'bg-orange-50 text-orange-700 border border-orange-200';
    case 'media':
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    default:
      return 'bg-green-50 text-green-700 border border-green-200';
  }
};

// Helper for formatting status labels with capitalization
export const formatStatusLabel = (status: string): string => {
  // If the status contains underscores, replace with spaces and format each word
  if (status.includes('_')) {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Otherwise, just capitalize the first letter
  return status.charAt(0).toUpperCase() + status.slice(1);
};
