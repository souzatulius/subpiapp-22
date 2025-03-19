
import React, { useState } from 'react';
import DataTable from './data-table/DataTable';
import DemandOriginForm from './demand-origins/DemandOriginForm';
import DemandOriginEditDialog from './demand-origins/DemandOriginEditDialog';
import { useDemandOrigins, DemandOrigin } from '@/hooks/useDemandOrigins';

const DemandOrigins = () => {
  const {
    origins,
    loading,
    isSubmitting,
    addDemandOrigin,
    updateDemandOrigin,
    deleteDemandOrigin
  } = useDemandOrigins();
  
  const [editingOrigin, setEditingOrigin] = useState<DemandOrigin | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const openEditForm = (origin: DemandOrigin) => {
    setEditingOrigin(origin);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingOrigin(null);
  };

  const handleEdit = async (data: { descricao: string }) => {
    if (!editingOrigin) return Promise.reject(new Error('Nenhuma origem de demanda selecionada'));
    
    await updateDemandOrigin(editingOrigin.id, data);
    closeEditForm();
    return Promise.resolve();
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];

  const renderForm = (onClose: () => void) => (
    <DemandOriginForm
      onSubmit={addDemandOrigin}
      onCancel={onClose}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div>
      <DataTable
        title="Origens de Demandas"
        data={origins}
        columns={columns}
        onAdd={() => {}}
        onEdit={openEditForm}
        onDelete={deleteDemandOrigin}
        filterPlaceholder="Filtrar origens de demandas..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      <DemandOriginEditDialog
        isOpen={isEditFormOpen}
        onClose={closeEditForm}
        demandOrigin={editingOrigin}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default DemandOrigins;
