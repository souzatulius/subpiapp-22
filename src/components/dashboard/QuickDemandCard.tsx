
import React, { KeyboardEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface QuickDemandCardProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const QuickDemandCard: React.FC<QuickDemandCardProps> = ({ 
  title, 
  value, 
  onChange, 
  onSubmit 
}) => {
  // Handle Enter key press
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col justify-between transition-all hover:shadow-lg">
      <div className="space-y-4">
        <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="Digite o título da demanda..."
            className="flex-1 border border-gray-300"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button" 
            onClick={onSubmit}
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
