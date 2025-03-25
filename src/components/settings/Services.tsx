
import React, { useState } from 'react';
import DataTable from './data-table/DataTable';
import ServiceForm from './services/ServiceForm';
import ServiceEditDialog from './services/ServiceEditDialog';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/service';

const Services = () => {
  const {
    services,
    areas,
    loading,
    isSubmitting,
    addService,
    updateService,
    deleteService
  } = useServices();
  
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const openEditForm = (service: Service) => {
    setEditingService(service);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingService(null);
  };

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };

  const handleEdit = async (data: { descricao: string; supervisao_tecnica_id: string }) => {
    if (!editingService) return Promise.reject(new Error('Nenhum problema selecionado'));
    
    await updateService(editingService.id, data);
    closeEditForm();
    return Promise.resolve();
  };

  const handleAdd = async (data: { descricao: string; supervisao_tecnica_id: string }) => {
    await addService(data);
    closeAddForm();
    return Promise.resolve();
  };

  const handleDelete = (service: Service) => {
    return deleteService(service.id);
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'supervisao_tecnica',
      header: 'Supervisão Técnica',
      render: (row: any) => row.supervisao_tecnica?.descricao || '-',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];

  const renderForm = (onClose: () => void) => (
    <ServiceForm
      onSubmit={handleAdd}
      onCancel={onClose}
      areas={areas}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div>
      <DataTable
        title="Problemas"
        data={services}
        columns={columns}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={handleDelete}
        filterPlaceholder="Filtrar problemas..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      <ServiceEditDialog
        isOpen={isEditFormOpen}
        onClose={closeEditForm}
        service={editingService}
        areas={areas}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Services;
