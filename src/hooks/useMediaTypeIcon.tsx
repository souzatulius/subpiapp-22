
import React from 'react';
import { MediaType } from '@/hooks/useMediaTypes';
import { 
  Newspaper, Radio, Tv, Smartphone, Mail, MessageSquare, Globe, 
  Instagram, Facebook, Twitter, Youtube, Image, FileText,
  LucideIcon
} from 'lucide-react';

// Map of icon names to icon components
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
  'Image': Image,
  'FileText': FileText,
};

export function useMediaTypeIcon(mediaType: MediaType, className: string = "h-6 w-6") {
  const IconComponent = mediaType.icone ? iconMap[mediaType.icone] : Newspaper;
  
  if (!IconComponent) {
    return <Newspaper className={className} />;
  }
  
  return <IconComponent className={className} />;
}
