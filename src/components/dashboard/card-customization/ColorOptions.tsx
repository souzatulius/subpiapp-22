
import React from 'react';
import { colorOptions } from './utils';
import { CardColor } from '@/types/dashboard';

interface ColorOptionsProps {
  value: string;
  onChange: (color: CardColor) => void;
}

const ColorOptions: React.FC<ColorOptionsProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-5 gap-2 my-3">
      {colorOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`h-10 rounded-md transition-all ${option.class}
            ${value === option.value ? 'ring-2 ring-blue-400 ring-offset-2' : 'hover:ring-1 hover:ring-gray-400'}
          `}
          title={option.label}
        />
      ))}
    </div>
  );
};

export default ColorOptions;
