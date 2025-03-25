
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
    <DialogFooter className="mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
        className="rounded-xl"
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="rounded-xl bg-subpi-blue hover:bg-subpi-blue-dark"
      >
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
