
import React, { KeyboardEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface QuickDemandCardProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  title?: string; // Added this prop to match usage
  demandTitle?: string; // This prop is used instead of value in the parent component
  onDemandTitleChange?: (value: string) => void; // This prop is used instead of onChange in the parent
  isEditMode?: boolean; // Added this prop to match usage
}

const QuickDemandCard: React.FC<QuickDemandCardProps> = ({ 
  value, 
  onChange, 
  onSubmit,
  title = 'Nova Demanda', // Default title
  demandTitle, // Support new prop naming
  onDemandTitleChange, // Support new prop naming
  isEditMode = false
}) => {
  // Use either the new prop naming or the old one
  const currentValue = demandTitle !== undefined ? demandTitle : value;
  const handleChange = onDemandTitleChange || onChange;

  // Handle Enter key press without any prevention for spaces
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Stop propagation to isolate input from drag-and-drop
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  // Direct handler for input changes to ensure spaces are captured
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);
  };

  // Stop propagation to avoid triggering drag when interacting with input/button
  const handleInputMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleButtonMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-xl shadow-md p-6 flex items-center justify-center transition-all hover:shadow-lg">
      <div className="w-full space-y-4">
        {title && (
          <div className="text-lg font-medium text-center mb-2">{title}</div>
        )}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="Digite o título de uma nova demanda..."
            className="flex-1 border border-gray-300"
            value={currentValue}
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
