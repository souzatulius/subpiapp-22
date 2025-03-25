
import React from 'react';
import { 
  LayoutDashboard, Droplet, Trash2, Trees, AlertTriangle, MessageSquare, 
  Briefcase, Book, Users, Mail, Heart, Home, Code, Lightbulb
} from 'lucide-react';

interface AreaIconProps {
  descricao: string;
}

export const AreaIcon: React.FC<AreaIconProps> = ({ descricao }) => {
  const iconMap: {
    [key: string]: React.ReactNode;
  } = {
    "Manutenção Viária": <LayoutDashboard className="h-6 w-6" />,
    "Drenagem": <Droplet className="h-6 w-6" />,
    "Limpeza Pública": <Trash2 className="h-6 w-6" />,
    "Áreas Verdes": <Trees className="h-6 w-6" />,
    "Fiscalização": <AlertTriangle className="h-6 w-6" />,
    "Comunicação": <MessageSquare className="h-6 w-6" />,
    "Administrativa": <Briefcase className="h-6 w-6" />,
    "Educação": <Book className="h-6 w-6" />,
    "Saúde": <Heart className="h-6 w-6" />,
    "Habitação": <Home className="h-6 w-6" />,
    "Tecnologia": <Code className="h-6 w-6" />,
    "Inovação": <Lightbulb className="h-6 w-6" />,
    "Social": <Users className="h-6 w-6" />
  };

  return iconMap[descricao] || <LayoutDashboard className="h-6 w-6" />;
};
