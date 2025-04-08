
import React from 'react';
import { cn } from '@/lib/utils';
import { StatusConfig, statusIcons, getDemandaStatusConfig, getNotaStatusConfig } from '@/utils/statusLabels';

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
    sm: 'text-xs py-0.5 px-2 h-5',
    md: 'text-sm py-1 px-2.5 h-6',
    lg: 'text-sm py-1.5 px-3 h-7',
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
  const config = getDemandaStatusConfig(status);
  
  // Special override for "Em análise" to ensure consistent height
  if (status.toLowerCase() === 'em_analise' || status.toLowerCase() === 'em análise') {
    config.label = "Em análise";
  }
  
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
  const config = getNotaStatusConfig(status);
  
  // Override rejeitada to use orange-500 background
  if (status.toLowerCase() === 'rejeitada') {
    config.bg = 'bg-orange-500';
    config.text = 'text-white';
    config.borderColor = 'border-orange-600';
  }
  
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
