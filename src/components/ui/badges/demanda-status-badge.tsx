
import React from 'react';
import { getDemandaStatusConfig } from '@/utils/statusLabels';
import { StatusBadge } from './status-badge-base';
import { formatStatusLabel, BadgeSize } from './badge-utils';

interface DemandaStatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
  size?: BadgeSize;
}

export function DemandaStatusBadge({
  status,
  className,
  showIcon = true,
  size,
}: DemandaStatusBadgeProps) {
  const config = getDemandaStatusConfig(status);
  
  // Format the label with first letter capitalized
  config.label = formatStatusLabel(config.label);
  
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
