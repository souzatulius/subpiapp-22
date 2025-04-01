
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ColorOptionsProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorOptions: React.FC<ColorOptionsProps> = ({ selectedColor, onSelectColor }) => {
  // Updated color options with all available colors
  const colorOptions = [
    { value: 'blue', display: 'blue-50', className: 'bg-blue-50 border-blue-100' },
    { value: 'blue-dark', display: 'blue-950', className: 'bg-blue-950 border-blue-900' },
    { value: 'blue-light', display: 'blue-400', className: 'bg-blue-400 border-blue-500' },
    { value: 'orange', display: 'orange-50', className: 'bg-orange-50 border-orange-100' },
    { value: 'orange-light', display: 'orange-500', className: 'bg-orange-500 border-orange-600' },
    { value: 'orange-600', display: 'orange-600', className: 'bg-orange-600 border-orange-700 text-white' },
    { value: 'gray-light', display: 'gray-25', className: 'bg-gray-25 border-gray-100' },
    { value: 'gray-dark', display: 'gray-400', className: 'bg-gray-400 border-gray-500' },
    { value: 'green', display: 'lime-50', className: 'bg-lime-50 border-lime-100' },
    { value: 'green-light', display: 'green-400', className: 'bg-green-400 border-green-500' },
    { value: 'lime', display: 'lime-500', className: 'bg-lime-500 border-lime-600' },
    { value: 'purple-light', display: 'purple-400', className: 'bg-purple-400 border-purple-500' },
  ];

  return (
    <RadioGroup 
      value={selectedColor}
      onValueChange={onSelectColor}
      className="flex flex-wrap gap-3"
    >
      {colorOptions.map((option) => (
        <div key={option.value} className="flex flex-col items-center">
          <RadioGroupItem 
            value={option.value} 
            id={`color-${option.value}`} 
            className="sr-only"
          />
          <Label
            htmlFor={`color-${option.value}`}
            className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer border transition-all ${
              selectedColor === option.value 
                ? 'ring-2 ring-offset-2 ring-blue-500' 
                : 'hover:scale-110'
            } ${option.className}`}
            aria-label={option.display}
          />
        </div>
      ))}
    </RadioGroup>
  );
};

export default ColorOptions;
