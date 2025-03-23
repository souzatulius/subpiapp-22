
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ColorOption {
  value: string;
  label: string;
  bgClass: string;
  textClass: string;
}

interface ColorOptionsProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorOptions: React.FC<ColorOptionsProps> = ({ selectedColor, onSelectColor }) => {
  // Core institutional colors
  const colorOptions: ColorOption[] = [
    { value: 'blue', label: 'Azul', bgClass: 'bg-blue-50', textClass: 'text-blue-950' },
    { value: 'orange', label: 'Laranja', bgClass: 'bg-orange-50', textClass: 'text-orange-500' },
    { value: 'gray-light', label: 'Cinza', bgClass: 'bg-gray-25', textClass: 'text-gray-400' },
    // Secondary colors
    { value: 'green', label: 'Verde', bgClass: 'bg-green-50', textClass: 'text-green-600' },
    { value: 'blue-dark', label: 'Azul Escuro', bgClass: 'bg-blue-900', textClass: 'text-white' },
    { value: 'orange-light', label: 'Laranja Claro', bgClass: 'bg-amber-50', textClass: 'text-amber-600' },
    { value: 'gray-dark', label: 'Cinza Escuro', bgClass: 'bg-gray-700', textClass: 'text-white' },
    { value: 'gray-ultra-light', label: 'Cinza Suave', bgClass: 'bg-gray-50', textClass: 'text-gray-600' },
  ];

  return (
    <RadioGroup 
      value={selectedColor}
      onValueChange={onSelectColor}
      className="grid grid-cols-4 gap-2 pt-1"
    >
      {colorOptions.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem 
            value={option.value} 
            id={`color-${option.value}`} 
            className="sr-only"
          />
          <Label
            htmlFor={`color-${option.value}`}
            className={`flex items-center justify-center w-full py-2 px-3 rounded-md cursor-pointer border transition-all ${
              selectedColor === option.value 
                ? 'ring-2 ring-offset-2 ring-blue-500' 
                : 'hover:border-gray-400'
            } ${option.bgClass} ${option.textClass}`}
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default ColorOptions;
