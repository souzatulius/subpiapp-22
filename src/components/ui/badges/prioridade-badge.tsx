
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Zap, Clock } from 'lucide-react';
import { BadgeSize, getSizeClasses, getIconSize } from './badge-utils';

interface PrioridadeBadgeProps {
  prioridade: string;
  className?: string;
  size?: BadgeSize;
}

export function PrioridadeBadge({
  prioridade,
  className,
  size = 'sm',
}: PrioridadeBadgeProps) {
  // Determine styling based on priority level
  const config = {
    alta: {
      icon: Zap,
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200'
    },
    media: {
      icon: AlertCircle,
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200'
    },
    baixa: {
      icon: Clock,
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200'
    }
  }[prioridade?.toLowerCase()] || {
    icon: Clock,
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200'
  };

  const IconComponent = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        config.bg,
        config.text,
        config.border,
        getSizeClasses(size),
        className
      )}
    >
      <IconComponent size={getIconSize(size)} className="shrink-0" />
      <span>{prioridade}</span>
    </span>
  );
}
