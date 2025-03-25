
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

interface DialogFooterActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const DialogFooterActions: React.FC<DialogFooterActionsProps> = ({
  isSubmitting,
  onCancel
}) => {
  return (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Salvando...
          </>
        ) : (
          'Salvar'
        )}
      </Button>
    </DialogFooter>
  );
};

export default DialogFooterActions;
