
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

interface TableEmptyStateProps {
  colSpan: number;
  message?: string;
}

const TableEmptyState: React.FC<TableEmptyStateProps> = ({ 
  colSpan, 
  message = "Nenhum registro encontrado" 
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8 text-[#6B7280]">
        {message}
      </TableCell>
    </TableRow>
  );
};

export default TableEmptyState;
