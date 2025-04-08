
import React from 'react';
import { ClipboardList, FileText, MessageSquare, BarChart2, Bell, TrendingUp, PieChart, Pencil, AlertTriangle } from 'lucide-react';
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
  if (title === 'Nova Demanda' || title === 'Nova Solicitação') {
    return <Pencil className={`h-${size} w-${size}`} />;
  } else if (title === 'Aprovar Nota' || title === 'Aprovar Notas') {
    return <ClipboardList className={`h-${size} w-${size}`} />;
  } else if (title === 'Responder Demandas') {
    return <MessageSquare className={`h-${size} w-${size}`} />;
  } else if (title === 'Relatórios da Comunicação' || title === 'Números da Comunicação') {
    return <PieChart className={`h-${size} w-${size}`} />;
  } else if (title === 'Ações Pendentes') {
    return <AlertTriangle className={`h-${size} w-${size}`} />;
  } else if (title === 'Avisos') {
    return <Bell className={`h-${size} w-${size}`} />;
  } else if (title === 'Demandas') {
    return <FileText className={`h-${size} w-${size}`} />;
  } else if (title === 'Ranking' || title === 'Ranking da Zeladoria') {
    return <TrendingUp className={`h-${size} w-${size}`} />;
  }
  
  // Fallback for empty or invalid icon
  return <FileText className={`h-${size} w-${size}`} />;
};

export default IconRenderer;
