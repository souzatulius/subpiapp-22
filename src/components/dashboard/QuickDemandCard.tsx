
import React, { KeyboardEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface QuickDemandCardProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const QuickDemandCard: React.FC<QuickDemandCardProps> = ({ 
  value, 
  onChange, 
  onSubmit 
}) => {
  // Handle Enter key press without any prevention for spaces
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  // Direct handler for input changes to ensure spaces are captured
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Stop propagation to avoid triggering drag when interacting with input/button
  const handleInputMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleButtonMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col justify-between transition-all hover:shadow-lg">
      <div className="space-y-4 w-full">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="Digite o título de uma nova demanda..."
            className="flex-1 border border-gray-300"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onMouseDown={handleInputMouseDown}
          />
          <Button
            type="button" 
            onClick={onSubmit}
            onMouseDown={handleButtonMouseDown}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Iniciar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickDemandCard;
