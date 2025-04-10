import React from 'react';
import * as LucideIcons from 'lucide-react';
import { MessageCircle, Newspaper, Mic, Building2, Users, Phone, Mail, Globe } from 'lucide-react'; // Default icon

export const useOriginIcon = (origin: { icone?: string } | undefined, className = 'h-5 w-5'): React.ReactNode => {
  if (!origin || !origin.icone) {
    // Default icon if none is specified
    return <MessageCircle className={className} />;
  }
  
  // Common origin types mapped to icons
  const commonIcons: Record<string, React.ReactNode> = {
    'imprensa': <Newspaper className={className} />,
    'jornal': <Newspaper className={className} />,
    'radio': <Mic className={className} />,
    'gabinete': <Building2 className={className} />,
    'cidadao': <Users className={className} />,
    'telefone': <Phone className={className} />,
    'email': <Mail className={className} />,
    'site': <Globe className={className} />,
    'redes': <Globe className={className} />
  };
  
  // Check if it's a common origin type
  const lowerIconName = origin.icone.toLowerCase();
  if (commonIcons[lowerIconName]) {
    return commonIcons[lowerIconName];
  }
  
  // Otherwise check if it's a Lucide icon
  // First letter uppercase, rest lowercase for Lucide naming convention
  const formattedIconName = origin.icone.charAt(0).toUpperCase() + origin.icone.slice(1).toLowerCase();
  const IconComponent = (LucideIcons as any)[formattedIconName];
  
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  
  // Default icon if not found
  return <MessageCircle className={className} />;
};
