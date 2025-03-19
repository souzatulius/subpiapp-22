
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import DataTable from './DataTable';
import DataEntryForm from './DataEntryForm';
import EditModal from './EditModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const serviceSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  area_coordenacao_id: z.string().min(1, 'Selecione uma área de coordenação'),
});

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('servicos')
        .select(`
          *,
          areas_coordenacao(id, descricao)
        `)
        .order('descricao', { ascending: true });
      
      if (servicesError) throw servicesError;
      
      // Fetch areas
      const { data: areasData, error: areasError } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (areasError) throw areasError;
      
      setServices(servicesData || []);
      setAreas(areasData || []);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: z.infer<typeof serviceSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('servicos')
        .insert({
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Serviço adicionado com sucesso',
      });
      
      await fetchData();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar serviço:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar o serviço',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: z.infer<typeof serviceSchema>) => {
    if (!editingService) return Promise.reject(new Error('Nenhum serviço selecionado'));
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('servicos')
        .update({
          descricao: data.descricao,
          area_coordenacao_id: data.area_coordenacao_id,
        })
        .eq('id', editingService.id);
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Serviço atualizado com sucesso',
      });
      
      await fetchData();
      setIsEditFormOpen(false);
      setEditingService(null);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar serviço:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o serviço',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (service: any) => {
    try {
      // Check if there are dependent records
      const { count, error: countError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('servico_id', service.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem demandas associadas a este serviço',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', service.id);
      
      if (error) throw error;
      
      toast({
        title: 'Serviço excluído',
        description: 'O serviço foi excluído com sucesso',
      });
      
      await fetchData();
    } catch (error: any) {
      console.error('Erro ao excluir serviço:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o serviço',
        variant: 'destructive',
      });
    }
  };

  const openEditForm = (service: any) => {
    setEditingService(service);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingService(null);
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'areas_coordenacao',
      header: 'Área de Coordenação',
      render: (row: any) => row.areas_coordenacao?.descricao || '-',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];

  const renderForm = (onClose: () => void) => (
    <DataEntryForm
      schema={serviceSchema}
      onSubmit={handleAdd}
      onCancel={onClose}
      defaultValues={{
        descricao: '',
        area_coordenacao_id: '',
      }}
      renderFields={() => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              placeholder="Nome do serviço"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="area_coordenacao_id">Área de Coordenação</Label>
            <select
              id="area_coordenacao_id"
              name="area_coordenacao_id"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione uma área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.descricao}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div>
      <DataTable
        title="Serviços"
        data={services}
        columns={columns}
        onAdd={() => {}}
        onEdit={openEditForm}
        onDelete={handleDelete}
        filterPlaceholder="Filtrar serviços..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      <EditModal 
        isOpen={isEditFormOpen} 
        onClose={closeEditForm}
        title="Editar Serviço"
      >
        <DataEntryForm
          schema={serviceSchema}
          onSubmit={handleEdit}
          onCancel={closeEditForm}
          defaultValues={{
            descricao: editingService?.descricao || '',
            area_coordenacao_id: editingService?.area_coordenacao_id || '',
          }}
          renderFields={() => (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  defaultValue={editingService?.descricao || ''}
                  placeholder="Nome do serviço"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="area_coordenacao_id">Área de Coordenação</Label>
                <select
                  id="area_coordenacao_id"
                  name="area_coordenacao_id"
                  defaultValue={editingService?.area_coordenacao_id || ''}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione uma área</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.descricao}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          isSubmitting={isSubmitting}
          submitText="Salvar Alterações"
        />
      </EditModal>
    </div>
  );
};

export default Services;
