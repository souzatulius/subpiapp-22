
import React from 'react';
import { cn } from '@/lib/utils';
import { StatusConfig } from '@/utils/statusLabels';
import { getSizeClasses, getIconSize, BadgeSize } from './badge-utils';
import * as Icons from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  config: StatusConfig;
  showIcon?: boolean;
  className?: string;
  size?: BadgeSize;
}

export function StatusBadge({
  status,
  config,
  showIcon = true,
  className,
  size = 'md',
}: StatusBadgeProps) {
  // Get the icon component dynamically from lucide-react
  // Fix: Use proper type checking and casting for icon components
  const IconComponent = config.iconName ? 
    (Icons[config.iconName as keyof typeof Icons] as React.ElementType) : 
    undefined;
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        config.text,
        config.bg,
        config.borderColor,
        getSizeClasses(size),
        className
      )}
    >
      {showIcon && IconComponent && (
        <IconComponent size={getIconSize(size)} className="shrink-0" />
      )}
      <span>{config.label}</span>
    </span>
  );
}
