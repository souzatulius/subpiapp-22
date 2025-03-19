
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import DataTable from './DataTable';
import DataEntryForm from './DataEntryForm';
import EditModal from './EditModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const mediaTypeSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
});

const MediaTypes = () => {
  const [mediaTypes, setMediaTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMediaType, setEditingMediaType] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    fetchMediaTypes();
  }, []);

  const fetchMediaTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tipos_midia')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      setMediaTypes(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar tipos de mídia:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os tipos de mídia',
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
        .from('tipos_midia')
        .insert({
          descricao: data.descricao,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Tipo de mídia adicionado com sucesso',
      });
      await fetchMediaTypes();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar tipo de mídia:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar o tipo de mídia',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingMediaType) return Promise.reject(new Error('Nenhum tipo de mídia selecionado'));
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('tipos_midia')
        .update({
          descricao: data.descricao,
        })
        .eq('id', editingMediaType.id);
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Tipo de mídia atualizado com sucesso',
      });
      await fetchMediaTypes();
      setIsEditFormOpen(false);
      setEditingMediaType(null);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar tipo de mídia:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o tipo de mídia',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (mediaType: any) => {
    try {
      // Check if there are dependent records
      const { count, error: countError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('tipo_midia_id', mediaType.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem demandas associadas a este tipo de mídia',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('tipos_midia')
        .delete()
        .eq('id', mediaType.id);
      
      if (error) throw error;
      
      toast({
        title: 'Tipo de mídia excluído',
        description: 'O tipo de mídia foi excluído com sucesso',
      });
      
      await fetchMediaTypes();
    } catch (error: any) {
      console.error('Erro ao excluir tipo de mídia:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o tipo de mídia',
        variant: 'destructive',
      });
    }
  };

  const openEditForm = (mediaType: any) => {
    setEditingMediaType(mediaType);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingMediaType(null);
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
      schema={mediaTypeSchema}
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
              placeholder="Nome do tipo de mídia"
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
        title="Tipos de Mídia"
        data={mediaTypes}
        columns={columns}
        onAdd={() => {}}
        onEdit={openEditForm}
        onDelete={handleDelete}
        filterPlaceholder="Filtrar tipos de mídia..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      <EditModal 
        isOpen={isEditFormOpen} 
        onClose={closeEditForm}
        title="Editar Tipo de Mídia"
      >
        <DataEntryForm
          schema={mediaTypeSchema}
          onSubmit={handleEdit}
          onCancel={closeEditForm}
          defaultValues={{
            descricao: editingMediaType?.descricao || '',
          }}
          renderFields={() => (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  defaultValue={editingMediaType?.descricao || ''}
                  placeholder="Nome do tipo de mídia"
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

export default MediaTypes;
