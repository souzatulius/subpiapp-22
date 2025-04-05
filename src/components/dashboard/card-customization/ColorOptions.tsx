
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CardColor } from '@/types/dashboard';

interface ColorOptionsProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorOptions: React.FC<ColorOptionsProps> = ({ selectedColor, onSelectColor }) => {
  // Updated color options with the specified colors
  const colorOptions: Array<{value: string; display: string; className: string}> = [
    { value: 'blue-vivid', display: 'Azul Vivo', className: 'bg-[#0066FF] border-blue-600 text-white' },
    { value: 'blue-light', display: 'Azul Claro', className: 'bg-[#66B2FF] border-blue-400 text-white' },
    { value: 'blue-dark', display: 'Azul Escuro', className: 'bg-[#1D4ED8] border-blue-900 text-white' },
    { value: 'green-neon', display: 'Verde Neon', className: 'bg-[#66FF66] border-green-600 text-gray-800' },
    { value: 'green-dark', display: 'Verde Escuro', className: 'bg-[#00CC00] border-green-800 text-gray-800' },
    { value: 'gray-light', display: 'Cinza Claro', className: 'bg-[#F5F5F5] border-gray-300 text-gray-800' },
    { value: 'gray-lighter', display: 'Cinza Mais Claro', className: 'bg-[#FAFAFA] border-gray-200 text-gray-800' },
    { value: 'gray-medium', display: 'Cinza Médio', className: 'bg-[#D4D4D4] border-gray-400 text-gray-800' },
    { value: 'orange-dark', display: 'Laranja Escuro', className: 'bg-[#F25C05] border-orange-600 text-white' },
    { value: 'orange-light', display: 'Laranja Claro', className: 'bg-[#F89E66] border-orange-400 text-white' },
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
