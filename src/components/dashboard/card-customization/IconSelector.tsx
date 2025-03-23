
import React from 'react';
import { iconsData } from './utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IconSelectorProps {
  selectedIconId: string;
  onSelectIcon: (id: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ 
  selectedIconId, 
  onSelectIcon 
}) => {
  return (
    <ScrollArea className="h-64 border rounded-md p-2">
      <div className="grid grid-cols-5 gap-2">
        {iconsData.map((icon) => (
          <div
            key={icon.id}
            onClick={() => onSelectIcon(icon.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all hover:bg-gray-100
              ${selectedIconId === icon.id ? 'bg-blue-50 border border-blue-200' : ''}
            `}
          >
            <div className="mb-1">
              {icon.component}
            </div>
            <span className="text-xs text-center truncate w-full">{icon.label}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default IconSelector;
