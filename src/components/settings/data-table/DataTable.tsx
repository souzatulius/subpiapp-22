
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TableActions from './TableActions';
import TableContent from './TableContent';
import TableAddForm from './TableAddForm';

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

  // Handle add button click
  const handleAddClick = () => {
    setIsFormOpen(true);
    onAdd();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-[#003570] font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TableActions 
            filter={filter}
            setFilter={setFilter}
            onAdd={handleAddClick}
            filterPlaceholder={filterPlaceholder}
            handleExport={handleExport}
            handlePrint={handlePrint}
          />

          <TableContent
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
        
        <TableAddForm
          title={title}
          isOpen={isFormOpen}
          setIsOpen={setIsFormOpen}
          renderForm={renderForm}
        />
      </CardContent>
    </Card>
  );
};

export default DataTable;
