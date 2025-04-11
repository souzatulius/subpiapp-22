
import React from 'react';
import { cn } from '@/lib/utils';
import { Building2, HardHat, Lightbulb, Droplet } from 'lucide-react';
import { BadgeSize, getSizeClasses, getIconSize } from './badge-utils';

interface ResponsabilidadeBadgeProps {
  responsavel: string;
  className?: string;
  size?: BadgeSize;
  showText?: boolean;
}

export function ResponsabilidadeBadge({
  responsavel,
  className,
  size = 'sm',
  showText = true,
}: ResponsabilidadeBadgeProps) {
  // Determine styling and text based on responsibility
  const config = {
    dzu: {
      icon: HardHat,
      label: 'DZU',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200'
    },
    enel: {
      icon: Lightbulb,
      label: 'ENEL',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    sabesp: {
      icon: Droplet,
      label: 'SABESP',
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200'
    },
    subprefeitura: {
      icon: Building2,
      label: 'Subprefeitura',
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200'
    }
  }[responsavel?.toLowerCase()] || {
    icon: Building2,
    label: responsavel || 'Outro',
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
      {showText && <span>{config.label}</span>}
    </span>
  );
}
