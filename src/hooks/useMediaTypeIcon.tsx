
import React from 'react';
import { 
  Newspaper, Radio, Tv, Smartphone, Mail, MessageSquare, Globe, 
  Instagram, Facebook, Twitter, Youtube, Image, FileText,
  LucideIcon
} from 'lucide-react';

export interface MediaType {
  id: string;
  descricao: string;
  criado_em: string;
  icone?: string;
}

export const useMediaTypeIcon = (mediaType: MediaType | null | undefined, className?: string): React.ReactElement | null => {
  if (!mediaType) return null;
  
  // Mapeamento de ícones para componentes Lucide
  const iconMap: Record<string, LucideIcon> = {
    'Newspaper': Newspaper,
    'Radio': Radio,
    'Tv': Tv,
    'Smartphone': Smartphone,
    'Mail': Mail,
    'MessageSquare': MessageSquare,
    'Globe': Globe,
    'Instagram': Instagram,
    'Facebook': Facebook,
    'Twitter': Twitter,
    'Youtube': Youtube,
    'FileText': FileText,
    'Image': Image,
  };

  const IconComponent = mediaType.icone ? iconMap[mediaType.icone] : null;
  
  if (IconComponent) {
    return <IconComponent className={className || 'h-5 w-5'} />;
  }
  
  // Fallback para um ícone padrão se o ícone não for encontrado
  return <Globe className={className || 'h-5 w-5'} />;
};
