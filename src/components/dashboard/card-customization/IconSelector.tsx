
import React from 'react';
import { FormControl } from '@/components/ui/form';
import { iconsData } from './utils';

interface IconSelectorProps {
  selectedIconId: string;
  onSelectIcon: (iconId: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIconId, onSelectIcon }) => {
  return (
    <FormControl>
      <div className="grid grid-cols-5 gap-3">
        {iconsData.map((icon) => (
          <div
            key={icon.id}
            className={`flex items-center justify-center h-12 rounded-md cursor-pointer transition-all duration-200
              ${selectedIconId === icon.id 
                ? 'bg-subpi-blue text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => onSelectIcon(icon.id)}
          >
            {icon.component}
          </div>
        ))}
      </div>
    </FormControl>
  );
};

export default IconSelector;
