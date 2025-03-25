
import React, { useState } from 'react';
import DataTable from './data-table/DataTable';
import ServiceForm from './services/ServiceForm';
import ServiceEditDialog from './services/ServiceEditDialog';
import { useServices, Service } from '@/hooks/useServices';

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

  const handleEdit = async (data: { descricao: string; area_coordenacao_id: string }) => {
    if (!editingService) return Promise.reject(new Error('Nenhum problema selecionado'));
    
    await updateService(editingService.id, data);
    closeEditForm();
    return Promise.resolve();
  };

  const handleAdd = async (data: { descricao: string; area_coordenacao_id: string }) => {
    await addService(data);
    closeAddForm();
    return Promise.resolve();
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'areas_coordenacao',
      header: 'Supervisão Técnica',
      render: (row: any) => row.areas_coordenacao?.descricao || '-',
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
        onDelete={deleteService}
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
