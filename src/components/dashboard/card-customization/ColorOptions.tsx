
import React from 'react';
import { FormControl } from '@/components/ui/form';
import { colorData } from './utils';

interface ColorOptionsProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorOptions: React.FC<ColorOptionsProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <FormControl>
      <div className="grid grid-cols-4 gap-2">
        {colorData.map((color) => (
          <div
            key={color.id}
            className={`h-10 rounded-md cursor-pointer transition-all duration-200 ${color.class} 
              ${selectedColor === color.id ? 'ring-2 ring-offset-2 ring-subpi-blue' : 'hover:opacity-80'}`}
            onClick={() => onSelectColor(color.id)}
          />
        ))}
      </div>
    </FormControl>
  );
};

export default ColorOptions;
