
import React from 'react';
import { cn } from '@/lib/utils';
import { StatusConfig, statusIcons } from '@/utils/statusLabels';

interface StatusBadgeProps {
  status: string;
  config: StatusConfig;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({
  status,
  config,
  showIcon = true,
  className,
  size = 'md',
}: StatusBadgeProps) {
  const Icon = statusIcons[config.iconName];
  
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-2.5',
    lg: 'text-sm py-1.5 px-3',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        config.text,
        config.bg,
        config.borderColor,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && Icon && <Icon size={iconSizes[size]} className="shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}

export function DemandaStatusBadge({
  status,
  className,
  showIcon = true,
  size,
}: {
  status: string;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { getDemandaStatusConfig } = require('@/utils/statusLabels');
  const config = getDemandaStatusConfig(status);
  
  return (
    <StatusBadge
      status={status}
      config={config}
      showIcon={showIcon}
      className={className}
      size={size}
    />
  );
}

export function NotaStatusBadge({
  status,
  className,
  showIcon = true,
  size,
}: {
  status: string;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { getNotaStatusConfig } = require('@/utils/statusLabels');
  const config = getNotaStatusConfig(status);
  
  return (
    <StatusBadge
      status={status}
      config={config}
      showIcon={showIcon}
      className={className}
      size={size}
    />
  );
}
