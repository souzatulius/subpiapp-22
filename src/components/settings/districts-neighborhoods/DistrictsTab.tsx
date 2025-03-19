
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DataTable from '../data-table/DataTable';
import DistrictForm, { districtSchema } from './DistrictForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DistrictAddForm from './district-forms/DistrictAddForm';

interface DistrictsTabProps {
  districts: any[];
  loadingDistricts: boolean;
  fetchDistricts: () => Promise<void>;
  fetchNeighborhoods: () => Promise<void>;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const DistrictsTab: React.FC<DistrictsTabProps> = ({
  districts,
  loadingDistricts,
  fetchDistricts,
  fetchNeighborhoods,
  isSubmitting,
  setIsSubmitting,
}) => {
  const [isEditDistrictOpen, setIsEditDistrictOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<any>(null);

  // District handlers
  const handleAddDistrict = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('distritos')
        .insert({
          nome: data.nome,
        });
      
      if (error) throw error;
      
      await fetchDistricts();
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao adicionar distrito:', error);
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditDistrict = async (data: any) => {
    if (!editingDistrict) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('distritos')
        .update({
          nome: data.nome,
        })
        .eq('id', editingDistrict.id);
      
      if (error) throw error;
      
      toast({
        title: 'Distrito atualizado',
        description: 'O distrito foi atualizado com sucesso',
      });
      
      setIsEditDistrictOpen(false);
      await fetchDistricts();
      await fetchNeighborhoods(); // Refresh to update district names in neighborhoods
    } catch (error: any) {
      console.error('Erro ao editar distrito:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o distrito',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteDistrict = async (district: any) => {
    try {
      // Check if there are dependent neighborhoods
      const { count, error: countError } = await supabase
        .from('bairros')
        .select('*', { count: 'exact', head: true })
        .eq('distrito_id', district.id);
        
      if (countError) throw countError;
        
      if ((count || 0) > 0) {
        toast({
          title: 'Não é possível excluir',
          description: 'Existem bairros associados a este distrito',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('distritos')
        .delete()
        .eq('id', district.id);
      
      if (error) throw error;
      
      toast({
        title: 'Distrito excluído',
        description: 'O distrito foi excluído com sucesso',
      });
      
      await fetchDistricts();
    } catch (error: any) {
      console.error('Erro ao excluir distrito:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o distrito',
        variant: 'destructive',
      });
    }
  };

  // Districts table configuration
  const districtColumns = [
    {
      key: 'nome',
      header: 'Nome',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];

  // Render district form - now using the extracted component
  const renderDistrictForm = (onClose: () => void) => (
    <DistrictAddForm
      onSubmit={handleAddDistrict}
      onCancel={onClose}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <>
      <DataTable
        title="Distritos"
        data={districts}
        columns={districtColumns}
        onAdd={() => {}}
        onEdit={(district) => {
          setEditingDistrict(district);
          setIsEditDistrictOpen(true);
        }}
        onDelete={handleDeleteDistrict}
        filterPlaceholder="Filtrar distritos..."
        renderForm={renderDistrictForm}
        isLoading={loadingDistricts}
      />
      
      {/* Edit District Dialog */}
      <Dialog open={isEditDistrictOpen} onOpenChange={setIsEditDistrictOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Distrito</DialogTitle>
          </DialogHeader>
          
          <DistrictForm
            onSubmit={handleEditDistrict}
            isSubmitting={isSubmitting}
            defaultValues={editingDistrict ? { nome: editingDistrict.nome } : undefined}
            onCancel={() => setIsEditDistrictOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DistrictsTab;
