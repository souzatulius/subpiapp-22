
import React from 'react';
import { 
  LayoutDashboard, Droplet, Trash2, Trees, AlertTriangle, MessageSquare, 
  Briefcase, Book, Users, Mail, Heart, Home, Code, Lightbulb,
  Landmark, Globe, Building, FileText, Phone, Map, Activity, FileCheck,
  Truck, BusFront, TentTree, Waves, CloudRain, Radiation
} from 'lucide-react';

export const renderIcon = (iconName?: string) => {
  if (!iconName) return <div className="w-5 h-5 bg-gray-100 rounded-full"></div>;

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

  return icons[iconName] || <div className="w-5 h-5 bg-gray-100 rounded-full"></div>;
};
