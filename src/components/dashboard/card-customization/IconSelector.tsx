
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
    <div className="border rounded-md h-48 overflow-hidden">
      <ScrollArea className="h-full p-2">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {iconsData.map((icon) => {
            return (
              <div
                key={icon.id}
                onClick={() => onSelectIcon(icon.id)}
                className={`flex items-center justify-center p-2 rounded-md cursor-pointer transition-all hover:bg-gray-50
                  ${selectedIconId === icon.id ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''}
                `}
                title={icon.label}
              >
                {icon.component}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default IconSelector;
