
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import DataTable from './DataTable';
import DataEntryForm from './DataEntryForm';
import EditModal from './EditModal';
import { Input } from '@/components/ui/input';

const originSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
});

const DemandOrigins = () => {
  const [origins, setOrigins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrigin, setEditingOrigin] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    fetchOrigins();
  }, []);

  const fetchOrigins = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('origens_demandas')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      setOrigins(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar origens de demandas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as origens de demandas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log('Adicionando origem de demanda:', data);
      
      const { data: result, error } = await supabase.rpc('insert_origem_demanda', {
        p_descricao: data.descricao
      });
      
      if (error) throw error;
      
      console.log('Origem de demanda adicionada com sucesso:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Origem de demanda adicionada com sucesso',
      });
      
      await fetchOrigins();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar origem de demanda:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar a origem de demanda',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingOrigin) return Promise.reject(new Error('Nenhuma origem de demanda selecionada'));
    
    setIsSubmitting(true);
    try {
      console.log('Editando origem de demanda:', editingOrigin.id, data);
      
      const { data: result, error } = await supabase.rpc('update_origem_demanda', {
        p_id: editingOrigin.id,
        p_descricao: data.descricao
      });
      
      if (error) throw error;
      
      console.log('Origem de demanda atualizada com sucesso:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Origem de demanda atualizada com sucesso',
      });
      
      await fetchOrigins();
      setIsEditFormOpen(false);
      setEditingOrigin(null);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar origem de demanda:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar a origem de demanda',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (origin: any) => {
    try {
      // Check if there are dependent records
      const { count, error: countError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('origem_id', origin.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem demandas associadas a esta origem',
          variant: 'destructive',
        });
        return;
      }
      
      console.log('Excluindo origem de demanda:', origin.id);
      
      const { error } = await supabase.rpc('delete_origem_demanda', {
        p_id: origin.id
      });
      
      if (error) throw error;
      
      toast({
        title: 'Origem de demanda excluída',
        description: 'A origem de demanda foi excluída com sucesso',
      });
      
      await fetchOrigins();
    } catch (error: any) {
      console.error('Erro ao excluir origem de demanda:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir a origem de demanda',
        variant: 'destructive',
      });
    }
  };

  const openEditForm = (origin: any) => {
    setEditingOrigin(origin);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingOrigin(null);
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
      schema={originSchema}
      onSubmit={handleAdd}
      onCancel={onClose}
      defaultValues={{
        descricao: '',
      }}
      renderFields={() => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="descricao" className="text-sm font-medium">
              Descrição
            </label>
            <Input
              id="descricao"
              name="descricao"
              className="w-full"
              placeholder="Nome da origem de demanda"
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
        title="Origens de Demandas"
        data={origins}
        columns={columns}
        onAdd={() => {}}
        onEdit={openEditForm}
        onDelete={handleDelete}
        filterPlaceholder="Filtrar origens de demandas..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      <EditModal 
        isOpen={isEditFormOpen} 
        onClose={closeEditForm}
        title="Editar Origem de Demanda"
      >
        <DataEntryForm
          schema={originSchema}
          onSubmit={handleEdit}
          onCancel={closeEditForm}
          defaultValues={{
            descricao: editingOrigin?.descricao || '',
          }}
          renderFields={() => (
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="descricao" className="text-sm font-medium">
                  Descrição
                </label>
                <Input
                  id="descricao"
                  name="descricao"
                  defaultValue={editingOrigin?.descricao || ''}
                  className="w-full"
                  placeholder="Nome da origem de demanda"
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

export default DemandOrigins;
