
import React, { useState, useEffect } from 'react';
import { useServices } from '@/hooks/services/useServices';
import { useAuth } from '@/hooks/useSupabaseAuth';
import DataTable from './data-table/DataTable';
import ServiceForm from './services/ServiceForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Services = () => {
  const { user } = useAuth();
  const { services, loading, fetchServices, addService, deleteService } = useServices();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    // Log services data to debug
    console.log('Services data:', services);
  }, [services]);

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição do Serviço',
    },
    {
      key: 'supervisao_tecnica',
      header: 'Coordenação',
      render: (row: any) => row.supervisao_tecnica?.descricao || '-',
    }
  ];

  const handleAdd = async (data: { descricao: string; supervisao_tecnica_id: string }) => {
    try {
      await addService(data);
      setIsAddFormOpen(false);
      toast({
        title: "Serviço adicionado",
        description: "O serviço foi cadastrado com sucesso.",
      });
      // Refresh the services list after adding
      fetchServices();
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o serviço.",
        variant: "destructive"
      });
    }
  };

  const renderForm = (onClose: () => void) => (
    <ServiceForm
      onSubmit={handleAdd}
      onCancel={onClose}
      isSubmitting={false}
    />
  );

  return (
    <div>
      <DataTable
        title="Serviços"
        data={services}
        columns={columns}
        onAdd={() => setIsAddFormOpen(true)}
        onEdit={() => {}} // Implement edit functionality if needed
        onDelete={deleteService}
        filterPlaceholder="Filtrar serviços..."
        renderForm={renderForm}
        isLoading={loading}
      />
    </div>
  );
};

export default Services;
