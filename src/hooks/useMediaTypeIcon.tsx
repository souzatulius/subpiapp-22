
import React from 'react';
import { Newspaper, Monitor, Globe, MessageCircle, Tv, Radio, FileText } from 'lucide-react';

export const useMediaTypeIcon = (mediaType: { icone?: string, descricao?: string }, className = 'h-5 w-5'): React.ReactNode => {
  if (!mediaType) {
    return <MessageCircle className={className} />;
  }
  
  // Map media type descriptions to icons
  const iconMap: Record<string, React.ReactNode> = {
    'Jornal': <Newspaper className={className} />,
    'Revista': <FileText className={className} />,
    'TV': <Tv className={className} />,
    'Rádio': <Radio className={className} />,
    'Internet': <Globe className={className} />,
    'Site': <Globe className={className} />,
    'Portal': <Globe className={className} />,
    'Blog': <Globe className={className} />,
    'Rede Social': <Globe className={className} />,
    'Monitor': <Monitor className={className} />
  };
  
  // Check if we have a direct icon mapping
  if (mediaType.descricao && iconMap[mediaType.descricao]) {
    return iconMap[mediaType.descricao];
  }
  
  // Try to match by custom icon name if available
  if (mediaType.icone) {
    const iconName = mediaType.icone;
    
    try {
      // Dynamically import the Lucide icon
      const LucideIcons = require('lucide-react');
      if (LucideIcons && (LucideIcons as any)[iconName]) {
        const IconComponent = (LucideIcons as any)[iconName];
        return <IconComponent className={className} />;
      }
    } catch (err) {
      console.error(`Failed to load icon: ${iconName}`, err);
    }
  }
  
  // Default icon
  return <MessageCircle className={className} />;
};
