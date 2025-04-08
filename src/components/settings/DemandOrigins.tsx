
import React, { useState } from 'react';
import DataTable from './data-table/DataTable';
import DemandOriginForm from './demand-origins/DemandOriginForm';
import DemandOriginEditDialog from './demand-origins/DemandOriginEditDialog';
import { useDemandOrigins, DemandOrigin } from '@/hooks/useDemandOrigins';
import { useOriginIcon } from '@/hooks/useOriginIcon';

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
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const openEditForm = (origin: DemandOrigin) => {
    setEditingOrigin(origin);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingOrigin(null);
  };

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };

  const handleEdit = async (data: { descricao: string, icone: string }) => {
    if (!editingOrigin) return Promise.reject(new Error('Nenhuma origem de demanda selecionada'));
    
    try {
      await updateDemandOrigin(editingOrigin.id, data);
      closeEditForm();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleAdd = async (data: { descricao: string, icone: string }) => {
    try {
      await addDemandOrigin(data);
      closeAddForm();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const columns = [
    {
      key: 'icone',
      header: 'Ícone',
      render: (row: DemandOrigin) => (
        <div className="flex justify-center">
          {useOriginIcon(row, "h-6 w-6")}
        </div>
      ),
    },
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
      onSubmit={handleAdd}
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
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={deleteDemandOrigin}
        filterPlaceholder="Filtrar origens de demandas..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      {editingOrigin && (
        <DemandOriginEditDialog
          isOpen={isEditFormOpen}
          onClose={closeEditForm}
          demandOrigin={editingOrigin}
          onSubmit={handleEdit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default DemandOrigins;
