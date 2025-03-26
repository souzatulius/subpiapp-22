
import React, { useState, useEffect } from 'react';
import { useServices } from '@/hooks/services/useServices';
import { useAuth } from '@/hooks/useSupabaseAuth';
import DataTable from './data-table/DataTable';
import ServiceForm from './services/ServiceForm';
import ServiceEditDialog from './services/ServiceEditDialog'; 
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Service, Area } from '@/hooks/services/types';
import { supabase } from "@/integrations/supabase/client";

const Services = () => {
  const { user } = useAuth();
  const { services, loading, fetchServices, addService, updateService, deleteService } = useServices();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchAreas();
  }, [fetchServices]);

  useEffect(() => {
    // Log services data to debug
    console.log('Services data:', services);
  }, [services]);

  const fetchAreas = async () => {
    try {
      console.log('Fetching areas for services component...');
      const { data, error } = await supabase
        .from('supervisoes_tecnicas')
        .select('id, descricao, sigla, coordenacao_id')
        .order('descricao');

      if (error) throw error;
      
      // Filter out areas with empty IDs
      const validAreas = (data || []).filter(area => area.id && area.id.trim() !== '');
      console.log('Areas fetched for services:', validAreas);
      setAreas(validAreas);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as supervisões técnicas.',
        variant: 'destructive'
      });
    }
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição do Serviço',
    },
    {
      key: 'supervisao_tecnica',
      header: 'Supervisão Técnica',
      render: (row: any) => row.supervisao_tecnica?.descricao || '-',
    }
  ];

  const handleAdd = async (data: { descricao: string; supervisao_tecnica_id: string }) => {
    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    console.log('Editing service:', service);
    setEditingService(service);
  };

  const handleUpdate = async (data: { descricao: string; supervisao_tecnica_id: string }) => {
    if (!editingService?.id) return;
    
    try {
      setIsSubmitting(true);
      await updateService(editingService.id, data);
      setEditingService(null);
      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso.",
      });
      // Refresh the services list after updating
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o serviço.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = (onClose: () => void) => (
    <ServiceForm
      onSubmit={handleAdd}
      onCancel={onClose}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div>
      <DataTable
        title="Serviços"
        data={services}
        columns={columns}
        onAdd={() => setIsAddFormOpen(true)}
        onEdit={handleEdit}
        onDelete={deleteService}
        filterPlaceholder="Filtrar serviços..."
        renderForm={renderForm}
        isLoading={loading}
      />

      {/* Edit Dialog */}
      <ServiceEditDialog
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        service={editingService}
        areas={areas}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Services;
