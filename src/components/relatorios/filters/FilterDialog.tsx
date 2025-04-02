
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import RelatoriosFilters from './RelatoriosFilters';
import { useReportsData, ReportFilters } from '../hooks/useReportsData';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFiltersChange?: (newFilters: ReportFilters) => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({ 
  open, 
  onOpenChange, 
  onFiltersChange 
}) => {
  const { filters, setFilters, resetFilters } = useReportsData();
  
  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
    // Call the external handler if provided
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[450px]" side="right">
        <SheetHeader>
          <SheetTitle>Filtros de relatório</SheetTitle>
          <SheetDescription>
            Customize a visualização dos dados e relatórios.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="py-6">
            <RelatoriosFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onResetFilters={resetFilters}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDialog;
