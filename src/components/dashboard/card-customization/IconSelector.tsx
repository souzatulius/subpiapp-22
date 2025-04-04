
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconSelectorProps {
  selectedIconId: string;
  onIconSelect: (iconId: string) => void;
  maxIcons?: number;
}

const IconSelector: React.FC<IconSelectorProps> = ({ 
  selectedIconId, 
  onIconSelect,
  maxIcons = 25
}) => {
  const renderIconComponent = (iconId: string) => {
    const IconComponent = (LucideIcons as any)[iconId];
    if (!IconComponent) return null;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <div className="grid grid-cols-5 gap-2 h-40 overflow-y-auto p-2 border rounded-md">
      {Object.keys(LucideIcons)
        .filter(key => 
          typeof (LucideIcons as any)[key] === 'function' && 
          !['createLucideIcon', 'default'].includes(key)
        )
        .slice(0, maxIcons)
        .map((key) => (
          <div
            key={key}
            className={`flex items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-gray-100 ${
              selectedIconId === key ? 'bg-blue-100 border-blue-500' : ''
            }`}
            onClick={() => onIconSelect(key)}
          >
            {renderIconComponent(key)}
          </div>
        ))}
    </div>
  );
};

export default IconSelector;
