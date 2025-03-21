
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

interface NewCardButtonProps {
  onClick: () => void;
}

const NewCardButton: React.FC<NewCardButtonProps> = ({ onClick }) => {
  return (
    <Card 
      className="cursor-pointer transition-all duration-300 border border-gray-200 
        rounded-xl shadow-md hover:shadow-xl overflow-hidden 
        bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 group"
      onClick={onClick}
    >
      <CardContent className="relative flex flex-col items-center justify-center p-6 md:p-4 h-full transform-gpu hover:scale-[1.03] overflow-hidden">
        <div className="mb-4">
          <PlusCircle className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-center">Adicionar Novo Card</h3>
      </CardContent>
    </Card>
  );
};

export default NewCardButton;
