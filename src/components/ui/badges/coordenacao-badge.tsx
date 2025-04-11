
import React from 'react';
import { cn } from '@/lib/utils';
import { Tag } from 'lucide-react';
import { BadgeSize, getSizeClasses, getIconSize } from './badge-utils';

interface CoordenacaoBadgeProps {
  texto: string;
  className?: string;
  size?: BadgeSize;
}

export function CoordenacaoBadge({
  texto,
  className,
  size = 'sm',
}: CoordenacaoBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        'bg-gray-100 text-gray-700 border-gray-200',
        getSizeClasses(size),
        className
      )}
    >
      <Tag size={getIconSize(size)} className="shrink-0" />
      <span>{texto}</span>
    </span>
  );
}
