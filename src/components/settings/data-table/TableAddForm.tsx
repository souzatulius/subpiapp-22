import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
  return <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md bg-zinc-100">
        <SheetHeader>
          <SheetTitle className="text-[#003570]">Adicionar {title}</SheetTitle>
        </SheetHeader>
        {isOpen && renderForm(handleClose)}
      </SheetContent>
    </Sheet>;
};
export default TableAddForm;