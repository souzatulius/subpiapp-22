
import React from 'react';
import { ClipboardList, FileCheck, MessageSquareReply, BarChart2 } from 'lucide-react';

interface IconRendererProps {
  icon: React.ReactNode;
  title?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ icon, title }) => {
  // Handle case when icon is already a valid React element
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement, {
      className: 'h-12 w-12'
    });
  }
  
  // Fallback based on title for standard cards
  if (title === 'Nova Demanda') {
    return <ClipboardList className="h-12 w-12" />;
  } else if (title === 'Aprovar Nota') {
    return <FileCheck className="h-12 w-12" />;
  } else if (title === 'Responder Demandas') {
    return <MessageSquareReply className="h-12 w-12" />;
  } else if (title === 'Números da Comunicação') {
    return <BarChart2 className="h-12 w-12" />;
  }
  
  // Fallback for empty or invalid icon
  return <ClipboardList className="h-12 w-12" />;
};

export default IconRenderer;
