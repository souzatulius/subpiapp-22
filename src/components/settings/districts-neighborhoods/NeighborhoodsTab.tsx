
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
import NeighborhoodAddForm from './neighborhood-forms/NeighborhoodAddForm';

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
      
      toast({
        title: 'Bairro adicionado',
        description: 'O bairro foi adicionado com sucesso',
      });
      
      await fetchNeighborhoods();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar bairro:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao adicionar o bairro',
        variant: 'destructive',
      });
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
  
  // Render neighborhood form - now using the extracted component
  const renderNeighborhoodForm = (onClose: () => void) => (
    <NeighborhoodAddForm
      onSubmit={async (data) => {
        try {
          await handleAddNeighborhood(data);
          onClose();
        } catch (error) {
          console.error('Error in form submission:', error);
        }
      }}
      onCancel={onClose}
      isSubmitting={isSubmitting}
      districts={districts}
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
          
          {isEditNeighborhoodOpen && editingNeighborhood && (
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NeighborhoodsTab;
