
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
import TableLoadingState from './TableLoadingState';
import TableEmptyState from './TableEmptyState';

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
            <TableLoadingState colSpan={columns.length + 1} />
          ) : data.length === 0 ? (
            <TableEmptyState colSpan={columns.length + 1} />
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
