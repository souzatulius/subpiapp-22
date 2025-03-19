
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

interface TableLoadingStateProps {
  colSpan: number;
}

const TableLoadingState: React.FC<TableLoadingStateProps> = ({ colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent border-[#003570] align-[-0.125em]" />
        <p className="mt-2 text-[#6B7280]">Carregando...</p>
      </TableCell>
    </TableRow>
  );
};

export default TableLoadingState;
