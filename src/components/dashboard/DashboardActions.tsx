
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface DashboardActionsProps {
  onAddNewCard: () => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({ onAddNewCard }) => {
  return (
    <div className="flex justify-end mb-6">
      <Button 
        variant="action" 
        onClick={onAddNewCard}
        className="rounded-xl"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Novo Card
      </Button>
    </div>
  );
};

export default DashboardActions;
