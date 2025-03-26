
import React from 'react';
import { 
  AlertTriangle, 
  Map, 
  MapPin, 
  Trash2, 
  Droplets, 
  Building2, 
  Trees, 
  Lightbulb, 
  HardHat, 
  Shield 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const renderIcon = (iconPath?: string) => {
  if (!iconPath) {
    return <Map className="h-5 w-5" />;
  }

  // Check if it's a Lucide icon name
  if (Object.keys(LucideIcons).includes(iconPath)) {
    const IconComponent = LucideIcons[iconPath as keyof typeof LucideIcons] as React.FC<{ className?: string }>;
    return <IconComponent className="h-5 w-5" />;
  }

  // If not a Lucide icon name, render as image
  try {
    return (
      <div className="w-5 h-5 flex items-center justify-center">
        <img 
          src={iconPath} 
          alt="Icon" 
          className="max-w-full max-h-full"
          onError={() => {
            console.error('Failed to load icon:', iconPath);
          }}
        />
      </div>
    );
  } catch (e) {
    console.error('Error rendering icon:', e);
    return <Map className="h-5 w-5" />;
  }
};

export const getProblemIcon = (problema: any) => {
  if (problema.icone) {
    return renderIcon(problema.icone);
  }
  
  const iconMap: Record<string, React.ReactNode> = {
    "Buraco": <HardHat className="h-8 w-8" />,
    "Iluminação": <Lightbulb className="h-8 w-8" />,
    "Árvore": <Trees className="h-8 w-8" />,
    "Esgoto": <Droplets className="h-8 w-8" />,
    "Calçada": <Building2 className="h-8 w-8" />,
    "Lixo": <Trash2 className="h-8 w-8" />,
    "Sinalização": <MapPin className="h-8 w-8" />,
    "Segurança": <Shield className="h-8 w-8" />,
    "Outros": <AlertTriangle className="h-8 w-8" />
  };
  
  // Try to match by keywords in the description
  const description = problema.descricao.toLowerCase();
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (description.includes(keyword.toLowerCase())) {
      return icon;
    }
  }
  
  return <Map className="h-8 w-8" />;
};
