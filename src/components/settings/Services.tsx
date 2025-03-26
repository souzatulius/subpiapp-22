
import React, { useState, useEffect } from 'react';
import { useServices } from '@/hooks/services/useServices';
import { useAuth } from '@/hooks/useSupabaseAuth';
import DataTable from './data-table/DataTable';
import ServiceForm from './services/ServiceForm';
import ServiceEditDialog from './services/ServiceEditDialog'; 
import DeleteServiceDialog from './services/DeleteServiceDialog';
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
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleAdd = async (data: { 
    supervisao_tecnica_id: string; 
    services: { descricao: string }[] 
  }) => {
    try {
      setIsSubmitting(true);
      
      // Track success and failure counts
      let successCount = 0;
      let failureCount = 0;
      
      // Submit each service one by one
      for (const serviceItem of data.services) {
        if (serviceItem.descricao.trim()) {
          try {
            await addService({
              descricao: serviceItem.descricao,
              supervisao_tecnica_id: data.supervisao_tecnica_id
            });
            successCount++;
          } catch (error) {
            console.error('Error adding service:', error);
            failureCount++;
          }
        }
      }
      
      setIsAddFormOpen(false);
      
      // Show appropriate toast message based on results
      if (successCount > 0 && failureCount === 0) {
        toast({
          title: "Serviços adicionados",
          description: `${successCount} serviço(s) cadastrado(s) com sucesso.`,
        });
      } else if (successCount > 0 && failureCount > 0) {
        toast({
          title: "Parcialmente concluído",
          description: `${successCount} serviço(s) cadastrado(s) com sucesso. ${failureCount} falha(s).`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar os serviços.",
          variant: "destructive"
        });
      }
      
      // Refresh the services list after adding
      fetchServices();
    } catch (error) {
      console.error('Error in batch service add:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar os serviços.",
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
  
  const handleDeleteClick = (service: Service) => {
    setDeletingService(service);
  };

  const handleConfirmDelete = async () => {
    if (!deletingService) return;
    
    try {
      setIsDeleting(true);
      await deleteService(deletingService.id);
      await fetchServices(); // Refresh the services list after deletion
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o serviço.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeletingService(null);
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
        onDelete={handleDeleteClick}
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

      {/* Delete Confirmation Dialog */}
      <DeleteServiceDialog
        isOpen={!!deletingService}
        onOpenChange={(open) => !open && setDeletingService(null)}
        onConfirm={handleConfirmDelete}
        serviceName={deletingService?.descricao || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Services;
