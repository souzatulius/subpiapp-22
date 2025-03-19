
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Printer, Plus } from 'lucide-react';

interface TableActionsProps {
  filter: string;
  setFilter: (value: string) => void;
  onAdd: () => void;
  filterPlaceholder: string;
  handleExport: () => void;
  handlePrint: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  filter,
  setFilter,
  onAdd,
  filterPlaceholder,
  handleExport,
  handlePrint
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder={filterPlaceholder}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleExport}
            title="Exportar CSV"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrint}
            title="Imprimir"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button 
            variant="action" 
            onClick={onAdd}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableActions;
