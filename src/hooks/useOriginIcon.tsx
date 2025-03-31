
import React from 'react';
import { 
  Newspaper, 
  Building, 
  MessageSquare, 
  Phone, 
  Mail, 
  Users, 
  Flag, 
  Globe, 
  AlertCircle,
  FileText,
  Smartphone
} from 'lucide-react';

interface Origin {
  id?: string;
  descricao?: string;
  icone?: string;
}

export const useOriginIcon = (origin: Origin, className: string = 'h-6 w-6') => {
  // If we have an explicit icon, use it
  if (origin?.icone) {
    switch (origin.icone) {
      case 'Newspaper': return <Newspaper className={className} />;
      case 'Building': return <Building className={className} />;
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'Phone': return <Phone className={className} />;
      case 'Mail': return <Mail className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Flag': return <Flag className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'AlertCircle': return <AlertCircle className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      default: return <Flag className={className} />;
    }
  }
  
  // If no explicit icon, guess based on description
  const description = origin?.descricao?.toLowerCase() || '';
  
  if (description.includes('imprensa')) return <Newspaper className={className} />;
  if (description.includes('smsub')) return <Building className={className} />;
  if (description.includes('secom')) return <MessageSquare className={className} />;
  if (description.includes('telefone')) return <Phone className={className} />;
  if (description.includes('email')) return <Mail className={className} />;
  if (description.includes('ouvidoria')) return <Users className={className} />;
  
  // Default icon
  return <Flag className={className} />;
};

export default useOriginIcon;
