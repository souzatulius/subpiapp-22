
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save } from 'lucide-react';

interface DashboardActionsProps {
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  onAddNew: () => void;
  onSave?: () => Promise<boolean>;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({ 
  isEditMode, 
  setIsEditMode, 
  onAddNew, 
  onSave 
}) => {
  return (
    <div className="flex justify-between mb-6">
      {isEditMode ? (
        <div className="flex gap-2">
          <Button 
            variant="default" 
            onClick={() => onSave && onSave()}
            className="rounded-xl"
          >
            <Save className="mr-2 h-5 w-5" />
            Salvar Alterações
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsEditMode(false)}
            className="rounded-xl"
          >
            Cancelar
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setIsEditMode(true)}
          className="rounded-xl"
        >
          Editar Dashboard
        </Button>
      )}
      
      {isEditMode && (
        <Button 
          variant="action" 
          onClick={onAddNew}
          className="rounded-xl"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Card
        </Button>
      )}
    </div>
  );
};

export default DashboardActions;
