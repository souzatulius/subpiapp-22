
import React from 'react';
import { cn } from '@/lib/utils';

interface LabelBadgeProps {
  label: string;
  value: string;
  variant?: 'status' | 'priority' | 'theme' | 'area' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LabelBadge({
  label,
  value,
  variant = 'default',
  size = 'md',
  className,
}: LabelBadgeProps) {
  // Format the value with capital first letters for each word
  const formattedValue = value
    .split('_')
    .join(' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Determine style based on variant
  const variantStyles = {
    status: {
      pendente: 'bg-blue-50 text-blue-700 border-blue-200',
      em_analise: 'bg-blue-100 text-blue-800 border-blue-300',
      respondida: 'bg-blue-200 text-blue-900 border-blue-400',
      aprovada: 'bg-green-50 text-green-700 border-green-200',
      publicada: 'bg-green-100 text-green-800 border-green-300',
      recusada: 'bg-orange-50 text-orange-700 border-orange-200',
      cancelada: 'bg-gray-50 text-gray-500 border-gray-200',
      arquivada: 'bg-gray-100 text-gray-600 border-gray-300',
      default: 'bg-gray-50 text-gray-700 border-gray-200'
    },
    priority: {
      alta: 'bg-red-50 text-red-700 border-red-200',
      media: 'bg-orange-50 text-orange-700 border-orange-200',
      baixa: 'bg-green-50 text-green-700 border-green-200',
      default: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    theme: {
      default: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    area: {
      default: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    default: {
      default: 'bg-gray-50 text-gray-700 border-gray-200'
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-2.5',
    lg: 'text-sm py-1.5 px-3'
  };
  
  // Get style based on value and variant, with fallback to default
  const getStyle = () => {
    if (!variantStyles[variant]) return variantStyles.default.default;
    
    const normalizedValue = value.toLowerCase().replace(/\s+/g, '_');
    return variantStyles[variant][normalizedValue] || variantStyles[variant].default;
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        getStyle(),
        sizeClasses[size],
        className
      )}
    >
      {label && <span className="font-medium">{label}:</span>}
      <span>{formattedValue}</span>
    </span>
  );
}

export default LabelBadge;
