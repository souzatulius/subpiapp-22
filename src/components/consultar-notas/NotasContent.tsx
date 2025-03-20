
import React from 'react';
import NotasFilter from './NotasFilter';
import NotasTable from './NotasTable';
import { useNotasData } from '@/hooks/consultar-notas/useNotasData';
import { useExportPDF } from '@/hooks/consultar-notas/useExportPDF';

const NotasContent: React.FC = () => {
  const {
    notas,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    formatDate
  } = useNotasData();
  
  const { handleExportPDF } = useExportPDF();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultar Notas Oficiais</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <NotasFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          handleExportPDF={handleExportPDF}
        />
        
        <NotasTable
          notas={notas}
          loading={loading}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};

export default NotasContent;
