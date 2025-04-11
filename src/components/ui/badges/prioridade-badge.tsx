
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import { BadgeSize, getSizeClasses, getIconSize, formatarPrioridade, getPriorityBadgeColors } from './badge-utils';

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
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        getPriorityBadgeColors(prioridade),
        getSizeClasses(size),
        className
      )}
    >
      <AlertTriangle size={getIconSize(size)} className="shrink-0" />
      <span>{formatarPrioridade(prioridade)}</span>
    </span>
  );
}
