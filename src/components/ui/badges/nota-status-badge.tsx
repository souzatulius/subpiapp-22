
import React from 'react';
import { getNotaStatusConfig } from '@/utils/statusLabels';
import { StatusBadge } from './status-badge-base';
import { BadgeSize } from './badge-utils';

interface NotaStatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
  size?: BadgeSize;
}

export function NotaStatusBadge({
  status,
  className,
  showIcon = true,
  size,
}: NotaStatusBadgeProps) {
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
