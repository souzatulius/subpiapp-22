
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash, Plus, Search, Download, Printer } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataTableProps {
  title: string;
  data: any[];
  columns: {
    key: string;
    header: string;
    render?: (row: any) => React.ReactNode;
  }[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  filterPlaceholder?: string;
  renderForm: (onClose: () => void) => React.ReactNode;
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  filterPlaceholder = "Filtrar...",
  renderForm,
  isLoading = false,
}) => {
  const [filter, setFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const filteredData = data.filter(item => {
    return columns.some(column => {
      const value = item[column.key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(filter.toLowerCase());
      }
      return false;
    });
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const headers = columns.map(col => col.header);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        columns.map(col => {
          const value = row[col.key];
          // Handle commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, '_')}_export.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-[#003570] font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                  onClick={() => setIsFormOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key} className="text-[#003570] font-medium">{column.header}</TableHead>
                  ))}
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center py-8">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent border-[#003570] align-[-0.125em]" />
                      <p className="mt-2 text-[#6B7280]">Carregando...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center py-8 text-[#6B7280]">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id || index} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <TableCell key={`${item.id || index}-${column.key}`}>
                          {column.render ? column.render(item) : item[column.key]}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => onEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500 hover:border-red-200" 
                            onClick={() => onDelete(item)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-[#003570]">Adicionar {title}</SheetTitle>
            </SheetHeader>
            {renderForm(() => setIsFormOpen(false))}
            <SheetFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default DataTable;
