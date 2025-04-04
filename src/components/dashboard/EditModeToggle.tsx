
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';

interface EditModeToggleProps {
  isEditMode: boolean;
  onToggle: () => void;
}

const EditModeToggle: React.FC<EditModeToggleProps> = ({ isEditMode, onToggle }) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onToggle}
        variant={isEditMode ? "default" : "ghost"}
        size="icon"
        className={`${
          isEditMode 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title={isEditMode ? 'Concluir edição' : 'Personalizar dashboard'}
      >
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default EditModeToggle;
