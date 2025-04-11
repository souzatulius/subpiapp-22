
import React from 'react';
import { cn } from '@/lib/utils';
import { StatusConfig, statusIcons, getDemandaStatusConfig, getNotaStatusConfig } from '@/utils/statusLabels';
import { FileText, Tag, AlertTriangle } from 'lucide-react';

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
  // Formatação para primeira letra maiúscula
  const formatStatus = (status: string) => {
    // Se o status contém underscores, substitui por espaços e formata cada palavra
    if (status.includes('_')) {
      return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Caso contrário, apenas capitaliza a primeira letra
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  const config = getDemandaStatusConfig(status);
  
  // Atualiza o label para ter primeira letra maiúscula
  config.label = formatStatus(config.label);
  
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

// We're using these icons for creating our themed badges
export function TemaBadge({
  texto,
  className,
  size = 'sm',
}: {
  texto: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
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
        'bg-blue-50 text-blue-700 border-blue-200',
        sizeClasses[size],
        className
      )}
    >
      <FileText size={iconSizes[size]} className="shrink-0" />
      <span>{texto}</span>
    </span>
  );
}

export function CoordenacaoBadge({
  texto,
  className,
  size = 'sm',
}: {
  texto: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
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
        'bg-gray-100 text-gray-700 border-gray-200',
        sizeClasses[size],
        className
      )}
    >
      <Tag size={iconSizes[size]} className="shrink-0" />
      <span>{texto}</span>
    </span>
  );
}

export function PrioridadeBadge({
  prioridade,
  className,
  size = 'sm',
}: {
  prioridade: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
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

  // Formatação correta da prioridade
  const formatarPrioridade = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return prioridade;
    }
  };

  const getBadgeColors = () => {
    switch (prioridade.toLowerCase()) {
      case 'alta':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'media':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      default:
        return 'bg-green-50 text-green-700 border border-green-200';
    }
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        getBadgeColors(),
        sizeClasses[size],
        className
      )}
    >
      <AlertTriangle size={iconSizes[size]} className="shrink-0" />
      <span>{formatarPrioridade(prioridade)}</span>
    </span>
  );
}
