
import React from 'react';
import { 
  Newspaper, 
  Radio, 
  Tv, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Globe, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Image,
  FileText,
  LucideIcon
} from 'lucide-react';
import { MediaType } from './useMediaTypes';

/**
 * Hook to get the appropriate icon for a media type
 */
export const useMediaTypeIcon = (mediaType: MediaType, className: string = "") => {
  if (!mediaType) return <Image className={className} />;
  
  // If media type has a custom icon string
  if (mediaType.icone) {
    // Check if it's a Lucide icon name
    try {
      const IconComponent = getLucideIconByName(mediaType.icone);
      return <IconComponent className={className} />;
    } catch (e) {
      // If not a Lucide icon, try to render it as an image URL
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <img 
            src={mediaType.icone} 
            alt={mediaType.descricao} 
            className="w-full h-full object-contain"
            onError={(e) => {
              // If image fails to load, show default icon
              e.currentTarget.src = ''; // Clear src to prevent further attempts
              e.currentTarget.style.display = 'none';
              // Note: We can't directly render a React component here in the onError handler
            }}
          />
        </div>
      );
    }
  }

  // Default icons based on media type description (case insensitive)
  const description = mediaType.descricao.toLowerCase();
  
  if (description.includes('jornal') || description.includes('impresso')) {
    return <Newspaper className={className} />;
  } else if (description.includes('rádio') || description.includes('radio')) {
    return <Radio className={className} />;
  } else if (description.includes('tv') || description.includes('televisão') || description.includes('televisao')) {
    return <Tv className={className} />;
  } else if (description.includes('app') || description.includes('aplicativo') || description.includes('móvel') || description.includes('movel')) {
    return <Smartphone className={className} />;
  } else if (description.includes('email') || description.includes('e-mail')) {
    return <Mail className={className} />;
  } else if (description.includes('sms') || description.includes('mensagem')) {
    return <MessageSquare className={className} />;
  } else if (description.includes('site') || description.includes('web') || description.includes('portal')) {
    return <Globe className={className} />;
  } else if (description.includes('instagram')) {
    return <Instagram className={className} />;
  } else if (description.includes('facebook')) {
    return <Facebook className={className} />;
  } else if (description.includes('twitter') || description.includes('x')) {
    return <Twitter className={className} />;
  } else if (description.includes('youtube')) {
    return <Youtube className={className} />;
  } else if (description.includes('documento') || description.includes('ofício') || description.includes('oficio')) {
    return <FileText className={className} />;
  }
  
  // Default fallback
  return <Image className={className} />;
};

// Helper function to get Lucide icon by name
const getLucideIconByName = (iconName: string): LucideIcon => {
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
    'FileText': FileText
    // Add more icons as needed
  };
  
  const Icon = iconMap[iconName];
  if (!Icon) {
    throw new Error(`Icon ${iconName} not found`);
  }
  
  return Icon;
};

export default useMediaTypeIcon;
