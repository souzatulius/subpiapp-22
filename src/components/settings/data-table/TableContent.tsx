
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface Column {
  key: string;
  header: string;
  render?: (row: any) => React.ReactNode;
}

interface TableContentProps {
  columns: Column[];
  data: any[];
  isLoading: boolean;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

const TableContent: React.FC<TableContentProps> = ({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete
}) => {
  return (
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
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-8 text-[#6B7280]">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
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
  );
};

export default TableContent;
