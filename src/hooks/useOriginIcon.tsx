
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

interface UseOriginIconProps {
  icone?: string | null;
}

export const useOriginIcon = ({ icone }: UseOriginIconProps) => {
  // Map icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    'phone': <Phone className="h-6 w-6" />,
    'mail': <Mail className="h-6 w-6" />,
    'web': <Globe className="h-6 w-6" />,
    'github': <Github className="h-6 w-6" />,
    'twitter': <Twitter className="h-6 w-6" />,
    'facebook': <Facebook className="h-6 w-6" />,
    'instagram': <Instagram className="h-6 w-6" />,
    'pen': <PenTool className="h-6 w-6" />,
    'building': <Building className="h-6 w-6" />,
    'award': <Award className="h-6 w-6" />,
    'radio': <Radio className="h-6 w-6" />,
    'tv': <Tv className="h-6 w-6" />,
    'news': <Newspaper className="h-6 w-6" />,
    'flag': <Flag className="h-6 w-6" />,
    'users': <Users className="h-6 w-6" />,
    'user': <UserCheck className="h-6 w-6" />,
    'message': <MessageCircle className="h-6 w-6" />,
    'file': <FilePlus className="h-6 w-6" />
  };

  if (!icone || !(icone in iconMap)) {
    return <BadgePlus className="h-6 w-6" />;
  }

  return iconMap[icone];
};
