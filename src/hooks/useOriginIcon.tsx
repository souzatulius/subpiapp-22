
import React from 'react';
import { 
  BadgePlus, 
  Phone, 
  Mail, 
  Globe, 
  Github, 
  Twitter, 
  Facebook, 
  Instagram, 
  PenTool,
  Building,
  Award,
  Radio,
  Tv,
  Newspaper,
  Flag,
  Users,
  UserCheck,
  MessageCircle,
  FilePlus
} from 'lucide-react';

interface OriginWithIcon {
  icone?: string | null;
}

export const useOriginIcon = (origin: any, size?: string) => {
  // Extract icone from origin object
  const icone = origin?.icone;
  
  // Map icon names to components with dynamic size
  const iconMap: Record<string, React.ReactNode> = {
    'phone': <Phone className={size || "h-6 w-6"} />,
    'mail': <Mail className={size || "h-6 w-6"} />,
    'web': <Globe className={size || "h-6 w-6"} />,
    'github': <Github className={size || "h-6 w-6"} />,
    'twitter': <Twitter className={size || "h-6 w-6"} />,
    'facebook': <Facebook className={size || "h-6 w-6"} />,
    'instagram': <Instagram className={size || "h-6 w-6"} />,
    'pen': <PenTool className={size || "h-6 w-6"} />,
    'building': <Building className={size || "h-6 w-6"} />,
    'award': <Award className={size || "h-6 w-6"} />,
    'radio': <Radio className={size || "h-6 w-6"} />,
    'tv': <Tv className={size || "h-6 w-6"} />,
    'news': <Newspaper className={size || "h-6 w-6"} />,
    'flag': <Flag className={size || "h-6 w-6"} />,
    'users': <Users className={size || "h-6 w-6"} />,
    'user': <UserCheck className={size || "h-6 w-6"} />,
    'message': <MessageCircle className={size || "h-6 w-6"} />,
    'file': <FilePlus className={size || "h-6 w-6"} />
  };

  if (!icone || !(icone in iconMap)) {
    return <BadgePlus className={size || "h-6 w-6"} />;
  }

  return iconMap[icone];
};
