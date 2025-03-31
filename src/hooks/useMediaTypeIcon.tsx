
import React from 'react';
import { 
  Newspaper, 
  Tv, 
  Radio, 
  Monitor, 
  Globe, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  FileText
} from 'lucide-react';

interface MediaType {
  id?: string;
  descricao?: string;
  icone?: string;
}

export const useMediaTypeIcon = (mediaType: MediaType, className: string = 'h-6 w-6') => {
  // If we have an explicit icon, use it
  if (mediaType?.icone) {
    switch (mediaType.icone) {
      case 'Newspaper': return <Newspaper className={className} />;
      case 'Tv': return <Tv className={className} />;
      case 'Radio': return <Radio className={className} />;
      case 'Monitor': return <Monitor className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'Mail': return <Mail className={className} />;
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'FileText': return <FileText className={className} />;
      default: return <Newspaper className={className} />;
    }
  }
  
  // If no explicit icon, guess based on description
  const description = mediaType?.descricao?.toLowerCase() || '';
  
  if (description.includes('impresso') || description.includes('jornal')) 
    return <Newspaper className={className} />;
  if (description.includes('tv') || description.includes('televisão'))
    return <Tv className={className} />;
  if (description.includes('rádio'))
    return <Radio className={className} />;
  if (description.includes('internet') || description.includes('site'))
    return <Globe className={className} />;
  if (description.includes('portal'))
    return <Monitor className={className} />;
  if (description.includes('app') || description.includes('mobile'))
    return <Smartphone className={className} />;
  
  // Default icon
  return <Newspaper className={className} />;
};

export default useMediaTypeIcon;
