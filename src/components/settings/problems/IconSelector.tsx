
import React from 'react';
import { 
  LayoutDashboard, Droplet, Trash2, Trees, AlertTriangle, MessageSquare, 
  Briefcase, Book, Users, Mail, Heart, Home, Code, Lightbulb,
  Landmark, Globe, Building, FileText, Phone, Map, Activity, FileCheck,
  Truck, BusFront, TentTree, Waves, CloudRain, Radiation, LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelectIcon }) => {
  const icons: { [key: string]: React.ReactElement } = {
    "LayoutDashboard": <LayoutDashboard className="h-5 w-5" />,
    "Droplet": <Droplet className="h-5 w-5" />,
    "Trash2": <Trash2 className="h-5 w-5" />,
    "Trees": <Trees className="h-5 w-5" />,
    "AlertTriangle": <AlertTriangle className="h-5 w-5" />,
    "MessageSquare": <MessageSquare className="h-5 w-5" />,
    "Briefcase": <Briefcase className="h-5 w-5" />,
    "Book": <Book className="h-5 w-5" />,
    "Users": <Users className="h-5 w-5" />,
    "Mail": <Mail className="h-5 w-5" />,
    "Heart": <Heart className="h-5 w-5" />,
    "Home": <Home className="h-5 w-5" />,
    "Code": <Code className="h-5 w-5" />,
    "Lightbulb": <Lightbulb className="h-5 w-5" />,
    "Landmark": <Landmark className="h-5 w-5" />,
    "Globe": <Globe className="h-5 w-5" />,
    "Building": <Building className="h-5 w-5" />,
    "FileText": <FileText className="h-5 w-5" />,
    "Phone": <Phone className="h-5 w-5" />,
    "Map": <Map className="h-5 w-5" />,
    "Activity": <Activity className="h-5 w-5" />,
    "FileCheck": <FileCheck className="h-5 w-5" />,
    "Truck": <Truck className="h-5 w-5" />,
    "BusFront": <BusFront className="h-5 w-5" />,
    "TentTree": <TentTree className="h-5 w-5" />,
    "Waves": <Waves className="h-5 w-5" />,
    "CloudRain": <CloudRain className="h-5 w-5" />,
    "Radiation": <Radiation className="h-5 w-5" />
  };
  
  return (
    <div className="grid grid-cols-7 gap-2">
      {Object.entries(icons).map(([iconName, iconComponent]) => (
        <Button
          key={iconName}
          type="button"
          variant={selectedIcon === iconName ? "default" : "outline"}
          className={`h-10 w-10 p-2 flex items-center justify-center ${
            selectedIcon === iconName ? "bg-blue-600" : ""
          }`}
          onClick={() => onSelectIcon(iconName)}
        >
          {iconComponent}
        </Button>
      ))}
    </div>
  );
};

export default IconSelector;
