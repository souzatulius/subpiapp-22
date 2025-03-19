
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import DataTable from './DataTable';
import DataEntryForm from './DataEntryForm';
import EditModal from './EditModal';
import { Input } from '@/components/ui/input';

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
      console.log('Adicionando cargo:', data);
      
      const { data: result, error } = await supabase.rpc('insert_cargo', {
        p_descricao: data.descricao
      });
      
      if (error) throw error;
      
      console.log('Cargo adicionado com sucesso:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Cargo adicionado com sucesso',
      });
      
      await fetchPositions();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar cargo:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar o cargo',
        variant: 'destructive',
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingPosition) return Promise.reject(new Error('Nenhum cargo selecionado'));
    
    setIsSubmitting(true);
    try {
      console.log('Editando cargo:', editingPosition.id, data);
      
      const { data: result, error } = await supabase.rpc('update_cargo', {
        p_id: editingPosition.id,
        p_descricao: data.descricao
      });
      
      if (error) throw error;
      
      console.log('Cargo atualizado com sucesso:', result);
      
      toast({
        title: 'Sucesso',
        description: 'Cargo atualizado com sucesso',
      });
      
      await fetchPositions();
      setIsEditFormOpen(false);
      setEditingPosition(null);
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao editar cargo:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o cargo',
        variant: 'destructive',
      });
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
      
      console.log('Excluindo cargo:', position.id);
      
      const { error } = await supabase.rpc('delete_cargo', {
        p_id: position.id
      });
      
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
            <Input
              id="descricao"
              name="descricao"
              className="w-full"
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
      
      <EditModal 
        isOpen={isEditFormOpen} 
        onClose={closeEditForm}
        title="Editar Cargo"
      >
        <DataEntryForm
          schema={positionSchema}
          onSubmit={handleEdit}
          onCancel={closeEditForm}
          defaultValues={{
            descricao: editingPosition?.descricao || '',
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
                  defaultValue={editingPosition?.descricao || ''}
                  className="w-full"
                  placeholder="Nome do cargo"
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

export default Positions;
