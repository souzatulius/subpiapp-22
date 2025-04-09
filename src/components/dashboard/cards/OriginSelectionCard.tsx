
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OriginOption {
  id: string;
  title: string;
  icon: React.ReactNode | string;
  path?: string;
}

interface OriginSelectionCardProps {
  title: string;
  options: OriginOption[];
}

const OriginSelectionCard: React.FC<OriginSelectionCardProps> = ({ title, options }) => {
  const navigate = useNavigate();

  // Function to get the correct icon component
  const getIconComponent = (iconName: string | React.ReactNode) => {
    if (React.isValidElement(iconName)) return iconName;
    
    if (typeof iconName === 'string') {
      // Convert string to Lucide icon format (first letter uppercase, rest lowercase)
      const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
      
      // Check if icon exists in Lucide library
      const LucideIcon = (LucideIcons as any)[formattedIconName];
      
      if (LucideIcon && typeof LucideIcon === 'function') {
        return <LucideIcon className="h-5 w-5" />;
      }
    }
    
    // Default icon if not found
    return <LucideIcons.BadgePlus className="h-5 w-5" />;
  };

  const handleOptionClick = (optionId: string, optionPath?: string) => {
    if (optionPath) {
      navigate(optionPath);
    } else {
      navigate(`/cadastrar?origem_id=${optionId}`);
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <h3 className="text-gray-700 font-medium mb-2">
          {title}
        </h3>
        <p className="text-2xl font-semibold text-orange-500 mb-4">
          De onde vem esta demanda?
        </p>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id, option.path)}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors bg-gradient-to-b from-gray-50 to-gray-100"
            >
              <span className="flex justify-center items-center w-10 h-10 rounded-full bg-white text-orange-500 mb-2 shadow-sm">
                {getIconComponent(option.icon)}
              </span>
              <span className="text-xs font-medium text-gray-700 text-center">
                {option.title}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OriginSelectionCard;
