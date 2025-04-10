
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

interface IconRendererProps {
  iconId: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
}

export const getIconSize = (size?: 'sm' | 'md' | 'lg' | 'xl'): string => {
  switch (size) {
    case 'sm': return 'w-6 h-6';
    case 'lg': return 'w-12 h-12';
    case 'xl': return 'w-16 h-16';
    case 'md':
    default: return 'w-12 h-12';
  }
};

export const IconRenderer: React.FC<IconRendererProps> = ({ iconId, iconSize = 'md' }) => {
  if (!iconId) return null;
  
  // Direct check for Lucide icon by name
  const LucideIcon = (LucideIcons as any)[iconId];
  if (LucideIcon) {
    return <LucideIcon className={getIconSize(iconSize)} />;
  }
  
  // Fallback to our custom icon loader
  const FallbackIcon = getIconComponentFromId(iconId);
  return FallbackIcon ? <FallbackIcon className={getIconSize(iconSize)} /> : null;
};

export default IconRenderer;
