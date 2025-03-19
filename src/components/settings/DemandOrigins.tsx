
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import DataTable from './DataTable';
import DataEntryForm from './DataEntryForm';

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
      const { error } = await supabase
        .from('origens_demandas')
        .insert({
          descricao: data.descricao,
        });
      
      if (error) throw error;
      
      await fetchOrigins();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar origem de demanda:', error);
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingOrigin) return Promise.reject(new Error('Nenhuma origem de demanda selecionada'));
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('origens_demandas')
        .update({
          descricao: data.descricao,
        })
        .eq('id', editingOrigin.id);
      
      if (error) throw error;
      
      await fetchOrigins();
      setIsEditFormOpen(false);
      setEditingOrigin(null);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar origem de demanda:', error);
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
      
      const { error } = await supabase
        .from('origens_demandas')
        .delete()
        .eq('id', origin.id);
      
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
            <input
              id="descricao"
              name="descricao"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
      
      {/* Edit form modal */}
      {isEditFormOpen && editingOrigin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Editar Origem de Demanda</h3>
            
            <DataEntryForm
              schema={originSchema}
              onSubmit={handleEdit}
              onCancel={closeEditForm}
              defaultValues={{
                descricao: editingOrigin.descricao,
              }}
              renderFields={() => (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="descricao" className="text-sm font-medium">
                      Descrição
                    </label>
                    <input
                      id="descricao"
                      name="descricao"
                      defaultValue={editingOrigin.descricao}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Nome da origem de demanda"
                    />
                  </div>
                </div>
              )}
              isSubmitting={isSubmitting}
              submitText="Salvar Alterações"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandOrigins;
