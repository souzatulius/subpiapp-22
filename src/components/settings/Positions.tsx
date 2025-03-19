
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import DataTable from './DataTable';
import DataEntryForm from './DataEntryForm';

const positionSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
});

const Positions = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPosition, setEditingPosition] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cargos')
        .select('*')
        .order('descricao', { ascending: true });
      
      if (error) throw error;
      setPositions(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar cargos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os cargos',
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
        .from('cargos')
        .insert({
          descricao: data.descricao,
        });
      
      if (error) throw error;
      
      await fetchPositions();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar cargo:', error);
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingPosition) return Promise.reject(new Error('Nenhum cargo selecionado'));
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('cargos')
        .update({
          descricao: data.descricao,
        })
        .eq('id', editingPosition.id);
      
      if (error) throw error;
      
      await fetchPositions();
      setIsEditFormOpen(false);
      setEditingPosition(null);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar cargo:', error);
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (position: any) => {
    try {
      // Check if there are dependent records
      const { count, error: countError } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('cargo_id', position.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem usuários associados a este cargo',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('cargos')
        .delete()
        .eq('id', position.id);
      
      if (error) throw error;
      
      toast({
        title: 'Cargo excluído',
        description: 'O cargo foi excluído com sucesso',
      });
      
      await fetchPositions();
    } catch (error: any) {
      console.error('Erro ao excluir cargo:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o cargo',
        variant: 'destructive',
      });
    }
  };

  const openEditForm = (position: any) => {
    setEditingPosition(position);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingPosition(null);
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
      schema={positionSchema}
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
              placeholder="Nome do cargo"
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
        title="Cargos"
        data={positions}
        columns={columns}
        onAdd={() => {}}
        onEdit={openEditForm}
        onDelete={handleDelete}
        filterPlaceholder="Filtrar cargos..."
        renderForm={renderForm}
        isLoading={loading}
      />
      
      {/* Edit form modal */}
      {isEditFormOpen && editingPosition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Editar Cargo</h3>
            
            <DataEntryForm
              schema={positionSchema}
              onSubmit={handleEdit}
              onCancel={closeEditForm}
              defaultValues={{
                descricao: editingPosition.descricao,
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
                      defaultValue={editingPosition.descricao}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Nome do cargo"
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

export default Positions;
