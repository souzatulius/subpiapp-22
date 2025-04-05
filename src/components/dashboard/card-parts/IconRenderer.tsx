
import React from 'react';
import { ClipboardList, FileCheck, MessageSquareReply, BarChart2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  icon: React.ReactNode;
  title?: string;
  iconId?: string;
  size?: number;
}

const IconRenderer: React.FC<IconRendererProps> = ({ icon, title, iconId, size = 12 }) => {
  // Handle case when icon is already a valid React element
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement, {
      className: `h-${size} w-${size}`
    });
  }
  
  // Try to render from iconId if available (using Lucide)
  if (iconId && (LucideIcons as any)[iconId]) {
    const LucideIcon = (LucideIcons as any)[iconId];
    return <LucideIcon className={`h-${size} w-${size}`} />;
  }
  
  // Fallback based on title for standard cards
  if (title === 'Nova Demanda') {
    return <ClipboardList className={`h-${size} w-${size}`} />;
  } else if (title === 'Aprovar Nota') {
    return <FileCheck className={`h-${size} w-${size}`} />;
  } else if (title === 'Responder Demandas') {
    return <MessageSquareReply className={`h-${size} w-${size}`} />;
  } else if (title === 'Números da Comunicação') {
    return <BarChart2 className={`h-${size} w-${size}`} />;
  }
  
  // Fallback for empty or invalid icon
  return <ClipboardList className={`h-${size} w-${size}`} />;
};

export default IconRenderer;
