
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import DataTable from './DataTable';
import DataEntryForm from './DataEntryForm';
import EditModal from './EditModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const areaSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
});

const CoordinationAreas = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArea, setEditingArea] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('areas_coordenacao')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      setAreas(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar áreas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as áreas de coordenação',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('areas_coordenacao')
        .insert({
          descricao: data.descricao,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Área de coordenação adicionada com sucesso',
      });
      
      await fetchAreas();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar área:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar a área',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingArea) return Promise.reject(new Error('Nenhuma área selecionada'));
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('areas_coordenacao')
        .update({
          descricao: data.descricao,
        })
        .eq('id', editingArea.id);
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Área de coordenação atualizada com sucesso',
      });
      
      await fetchAreas();
      setIsEditFormOpen(false);
      setEditingArea(null);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar área:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar a área',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (area: any) => {
    try {
      // Check if there are dependent records
      const { count: usersCount, error: usersError } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('area_coordenacao_id', area.id);
        
      if (usersError) throw usersError;
        
      const { count: servicesCount, error: servicesError } = await supabase
        .from('servicos')
        .select('*', { count: 'exact', head: true })
        .eq('area_coordenacao_id', area.id);
        
      if (servicesError) throw servicesError;
        
      if ((usersCount || 0) > 0 || (servicesCount || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem usuários ou serviços associados a esta área',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('areas_coordenacao')
        .delete()
        .eq('id', area.id);
      
      if (error) throw error;
      
      toast({
        title: 'Área excluída',
        description: 'A área de coordenação foi excluída com sucesso',
      });
      
      await fetchAreas();
    } catch (error: any) {
      console.error('Erro ao excluir área:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir a área',
        variant: 'destructive',
      });
    }
  };

  const openEditForm = (area: any) => {
    setEditingArea(area);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingArea(null);
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
    <DataEntryForm
      schema={areaSchema}
      onSubmit={handleAdd}
      onCancel={onClose}
      defaultValues={{
        descricao: '',
      }}
      renderFields={() => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              placeholder="Nome da área de coordenação"
            />
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div>
      <DataTable
        title="Áreas de Coordenação"
        data={areas}
        columns={columns}
        onAdd={() => {}}
        onEdit={openEditForm}
        onDelete={handleDelete}
        filterPlaceholder="Filtrar áreas..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      <EditModal 
        isOpen={isEditFormOpen} 
        onClose={closeEditForm}
        title="Editar Área de Coordenação"
      >
        <DataEntryForm
          schema={areaSchema}
          onSubmit={handleEdit}
          onCancel={closeEditForm}
          defaultValues={{
            descricao: editingArea?.descricao || '',
          }}
          renderFields={() => (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  defaultValue={editingArea?.descricao || ''}
                  placeholder="Nome da área de coordenação"
                />
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

export default CoordinationAreas;
