
import React from 'react';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';
import { BadgeSize, getSizeClasses, getIconSize } from './badge-utils';

interface TemaBadgeProps {
  texto: string;
  className?: string;
  size?: BadgeSize;
}

export function TemaBadge({
  texto,
  className,
  size = 'sm',
}: TemaBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        'bg-blue-50 text-blue-700 border-blue-200',
        getSizeClasses(size),
        className
      )}
    >
      <FileText size={getIconSize(size)} className="shrink-0" />
      <span>{texto}</span>
    </span>
  );
}
