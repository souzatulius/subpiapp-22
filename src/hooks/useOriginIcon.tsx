
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { MessageCircle } from 'lucide-react'; // Default icon

export const useOriginIcon = (origin: { icone?: string }, className = 'h-5 w-5'): React.ReactNode => {
  if (!origin || !origin.icone) {
    // Default icon if none is specified
    return <MessageCircle className={className} />;
  }
  
  // First check if it's a Lucide icon
  const IconComponent = (LucideIcons as any)[origin.icone];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  
  // Then check if it might be a custom SVG icon
  try {
    return (
      <img
        src={`/icons/${origin.icone}.svg`}
        alt={origin.icone}
        className={className}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          console.error(`Icon not found: ${origin.icone}`);
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  } catch (err) {
    console.error(`Error loading icon: ${origin.icone}`, err);
    return <MessageCircle className={className} />;
  }
};
