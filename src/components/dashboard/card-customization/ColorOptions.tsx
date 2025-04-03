
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CardColor } from '@/types/dashboard';

interface ColorOptionsProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorOptions: React.FC<ColorOptionsProps> = ({ selectedColor, onSelectColor }) => {
  // Updated color options with all available colors including the newly added ones
  const colorOptions: Array<{value: CardColor; display: string; className: string}> = [
    // Original colors
    { value: 'blue', display: 'blue-500', className: 'bg-blue-500 border-blue-600 text-white' },
    { value: 'green', display: 'green-500', className: 'bg-green-500 border-green-600 text-white' },
    { value: 'orange', display: 'orange-500', className: 'bg-orange-500 border-orange-600 text-white' },
    { value: 'gray-light', display: 'gray-light', className: 'bg-gray-200 border-gray-300' },
    { value: 'gray-dark', display: 'gray-dark', className: 'bg-gray-700 border-gray-800 text-white' },
    { value: 'blue-dark', display: 'blue-dark', className: 'bg-blue-700 border-blue-800 text-white' },
    { value: 'orange-light', display: 'orange-light', className: 'bg-orange-300 border-orange-400' },
    { value: 'gray-ultra-light', display: 'gray-ultra-light', className: 'bg-gray-100 border-gray-200' },
    { value: 'lime', display: 'lime', className: 'bg-lime-500 border-lime-600 text-white' },
    { value: 'orange-600', display: 'orange-600', className: 'bg-orange-600 border-orange-700 text-white' },
    { value: 'blue-light', display: 'blue-light', className: 'bg-blue-300 border-blue-400' },
    { value: 'green-light', display: 'green-light', className: 'bg-green-300 border-green-400' },
    { value: 'purple-light', display: 'purple-light', className: 'bg-purple-300 border-purple-400' },
    
    // New color options
    { value: 'gray-400', display: 'gray-400', className: 'bg-gray-400 border-gray-500 text-white' },
    { value: 'gray-800', display: 'gray-800', className: 'bg-gray-800 border-gray-900 text-white' },
    { value: 'gray-950', display: 'gray-950', className: 'bg-gray-950 border-black text-white' },
    { value: 'blue-700', display: 'blue-700', className: 'bg-blue-700 border-blue-800 text-white' },
    { value: 'blue-900', display: 'blue-900', className: 'bg-blue-900 border-blue-950 text-white' },
    { value: 'blue-960', display: 'blue-960', className: 'bg-blue-900 border-blue-950 text-white' },
    { value: 'orange-400', display: 'orange-400', className: 'bg-orange-400 border-orange-500 text-white' },
    { value: 'orange-500', display: 'orange-500', className: 'bg-orange-500 border-orange-600 text-white' },
    { value: 'gray-200', display: 'gray-200', className: 'bg-gray-200 border-gray-300' },
    { value: 'lime-500', display: 'lime-500', className: 'bg-lime-500 border-lime-600 text-white' },
    { value: 'neutral-200', display: 'neutral-200', className: 'bg-gray-200 border-gray-300' },
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
