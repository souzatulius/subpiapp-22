
import React, { useState } from 'react';
import NotasFilter from './NotasFilter';
import NotasTable from './NotasTable';
import NotasCards from './NotasCards';
import { useNotasData } from '@/hooks/consultar-notas/useNotasData';
import { useExportPDF } from '@/hooks/consultar-notas/useExportPDF';
import { Button } from '@/components/ui/button';
import { List, Grid } from 'lucide-react';
import { NotaOficial } from '@/hooks/consultar-notas/types';

const NotasContent: React.FC = () => {
  const {
    notas,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    formatDate,
    filteredNotas,
    areaFilter,
    setAreaFilter,
    dataInicioFilter,
    setDataInicioFilter,
    dataFimFilter,
    setDataFimFilter,
    deleteNota,
    deleteLoading,
    isAdmin,
    updateNotaStatus
  } = useNotasData();
  
  const { handleExportPDF } = useExportPDF();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const handleApproveNota = (notaId: string) => {
    updateNotaStatus(notaId, 'aprovado');
  };

  const handleRejectNota = (notaId: string) => {
    updateNotaStatus(notaId, 'rejeitado');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Consultar Notas Oficiais</h1>
      </div>
      
      {/* Separate filter box with rounded borders and shadow */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Filtros e Pesquisa</h2>
            <p className="text-sm text-gray-500">Use os filtros abaixo para encontrar notas específicas</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className={viewMode === 'table' ? 'bg-gray-100' : ''}
              onClick={() => setViewMode('table')}
              aria-label="Visualização em tabela"
            >
              <List className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={viewMode === 'cards' ? 'bg-gray-100' : ''}
              onClick={() => setViewMode('cards')}
              aria-label="Visualização em cards"
            >
              <Grid className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <NotasFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          areaFilter={areaFilter}
          setAreaFilter={setAreaFilter}
          dataInicioFilter={dataInicioFilter}
          setDataInicioFilter={setDataInicioFilter}
          dataFimFilter={dataFimFilter}
          setDataFimFilter={setDataFimFilter}
          handleExportPDF={handleExportPDF}
        />
      </div>
        
      {/* Results container */}
      <div className="bg-white rounded-xl shadow p-6">
        {viewMode === 'table' ? (
          <NotasTable
            notas={filteredNotas as any}
            loading={isLoading}
            formatDate={formatDate}
            onDeleteNota={deleteNota}
            deleteLoading={deleteLoading}
            onApproveNota={isAdmin ? handleApproveNota : undefined}
            onRejectNota={isAdmin ? handleRejectNota : undefined}
            isAdmin={isAdmin}
          />
        ) : (
          <NotasCards 
            notas={filteredNotas as any}
            loading={isLoading}
            formatDate={formatDate}
            onDeleteNota={deleteNota}
            deleteLoading={deleteLoading}
          />
        )}
      </div>
    </div>
  );
};

export default NotasContent;
