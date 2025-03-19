
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface TableAddFormProps {
  title: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  renderForm: (onClose: () => void) => React.ReactNode;
}

const TableAddForm: React.FC<TableAddFormProps> = ({
  title,
  isOpen,
  setIsOpen,
  renderForm
}) => {
  const handleClose = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-[#003570]">Adicionar {title}</SheetTitle>
        </SheetHeader>
        {renderForm(handleClose)}
        <SheetFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TableAddForm;
