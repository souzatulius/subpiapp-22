
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DataTable from '../data-table/DataTable';
import NeighborhoodForm, { neighborhoodSchema } from './NeighborhoodForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DataEntryForm from '../DataEntryForm';

interface NeighborhoodsTabProps {
  neighborhoods: any[];
  districts: any[];
  loadingNeighborhoods: boolean;
  fetchNeighborhoods: () => Promise<void>;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const NeighborhoodsTab: React.FC<NeighborhoodsTabProps> = ({
  neighborhoods,
  districts,
  loadingNeighborhoods,
  fetchNeighborhoods,
  isSubmitting,
  setIsSubmitting,
}) => {
  const [isEditNeighborhoodOpen, setIsEditNeighborhoodOpen] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<any>(null);

  // Neighborhood handlers
  const handleAddNeighborhood = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bairros')
        .insert({
          nome: data.nome,
          distrito_id: data.distrito_id,
        });
      
      if (error) throw error;
      
      await fetchNeighborhoods();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar bairro:', error);
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditNeighborhood = async (data: any) => {
    if (!editingNeighborhood) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bairros')
        .update({
          nome: data.nome,
          distrito_id: data.distrito_id,
        })
        .eq('id', editingNeighborhood.id);
      
      if (error) throw error;
      
      toast({
        title: 'Bairro atualizado',
        description: 'O bairro foi atualizado com sucesso',
      });
      
      setIsEditNeighborhoodOpen(false);
      await fetchNeighborhoods();
    } catch (error: any) {
      console.error('Erro ao editar bairro:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o bairro',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteNeighborhood = async (neighborhood: any) => {
    try {
      // Check if there are dependent records
      const { count, error: countError } = await supabase
        .from('demandas')
        .select('*', { count: 'exact', head: true })
        .eq('bairro_id', neighborhood.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem demandas associadas a este bairro',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('bairros')
        .delete()
        .eq('id', neighborhood.id);
      
      if (error) throw error;
      
      toast({
        title: 'Bairro excluído',
        description: 'O bairro foi excluído com sucesso',
      });
      
      await fetchNeighborhoods();
    } catch (error: any) {
      console.error('Erro ao excluir bairro:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o bairro',
        variant: 'destructive',
      });
    }
  };

  // Neighborhoods table configuration
  const neighborhoodColumns = [
    {
      key: 'nome',
      header: 'Nome',
    },
    {
      key: 'distritos',
      header: 'Distrito',
      render: (row: any) => row.distritos?.nome || '-',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];
  
  // Render neighborhood form
  const renderNeighborhoodForm = (onClose: () => void) => (
    <DataEntryForm
      schema={neighborhoodSchema}
      onSubmit={handleAddNeighborhood}
      onCancel={onClose}
      defaultValues={{
        nome: '',
        distrito_id: '',
      }}
      renderFields={(form) => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              {...form.register('nome')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nome do bairro"
            />
            {form.formState.errors.nome && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.nome.message}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="distrito_id" className="text-sm font-medium">
              Distrito
            </label>
            <select
              id="distrito_id"
              {...form.register('distrito_id')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione um distrito</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.nome}
                </option>
              ))}
            </select>
            {form.formState.errors.distrito_id && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.distrito_id.message}
              </p>
            )}
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <>
      <DataTable
        title="Bairros"
        data={neighborhoods}
        columns={neighborhoodColumns}
        onAdd={() => {}}
        onEdit={(neighborhood) => {
          setEditingNeighborhood(neighborhood);
          setIsEditNeighborhoodOpen(true);
        }}
        onDelete={handleDeleteNeighborhood}
        filterPlaceholder="Filtrar bairros..."
        renderForm={renderNeighborhoodForm}
        isLoading={loadingNeighborhoods}
      />
      
      {/* Edit Neighborhood Dialog */}
      <Dialog open={isEditNeighborhoodOpen} onOpenChange={setIsEditNeighborhoodOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Bairro</DialogTitle>
          </DialogHeader>
          
          <NeighborhoodForm
            onSubmit={handleEditNeighborhood}
            isSubmitting={isSubmitting}
            defaultValues={
              editingNeighborhood 
                ? { 
                    nome: editingNeighborhood.nome,
                    distrito_id: editingNeighborhood.distrito_id,
                  } 
                : undefined
            }
            onCancel={() => setIsEditNeighborhoodOpen(false)}
            districts={districts}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NeighborhoodsTab;
