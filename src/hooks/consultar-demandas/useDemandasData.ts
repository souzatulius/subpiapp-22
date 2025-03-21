
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  area_coordenacao: {
    descricao: string;
  } | null;
  servico: {
    descricao: string;
  } | null;
  origem: {
    descricao: string;
  } | null;
  tipo_midia: {
    descricao: string;
  } | null;
  bairro: {
    nome: string;
  } | null;
  autor: {
    nome_completo: string;
  } | null;
  endereco: string | null;
  nome_solicitante: string | null;
  email_solicitante: string | null;
  telefone_solicitante: string | null;
  veiculo_imprensa: string | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null | any; // Changed to accept any type to handle JSON
}

export const useDemandasData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    data: demandas = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['demandas'],
    queryFn: async () => {
      console.log('Fetching demandas');
      const {
        data,
        error
      } = await supabase.from('demandas').select(`
          *,
          area_coordenacao:area_coordenacao_id(descricao),
          servico:servico_id(descricao),
          origem:origem_id(descricao),
          tipo_midia:tipo_midia_id(descricao),
          bairro:bairro_id(nome),
          autor:autor_id(nome_completo)
        `).order('horario_publicacao', {
        ascending: false
      });
      if (error) {
        console.error('Error fetching demandas:', error);
        throw error;
      }
      
      console.log('Demandas data:', data);
      const processedData = data?.map(item => {
        if (typeof item.perguntas === 'string') {
          try {
            item.perguntas = JSON.parse(item.perguntas);
          } catch (e) {
            item.perguntas = null;
          }
        }
        return item;
      }) || [];
      
      return processedData;
    },
    meta: {
      onError: (err: any) => {
        console.error('Query error:', err);
        toast({
          title: "Erro ao carregar demandas",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  });

  const filteredDemandas = demandas.filter((demand: any) => 
    demand.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    demand.servico?.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    demand.area_coordenacao?.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (!selectedDemand) return;
    setDeleteLoading(true);
    console.log('Deleting demand:', selectedDemand.id);
    
    try {
      // Delete related notes first
      console.log('Checking for related notes');
      const { data: relatedNotes, error: notesError } = await supabase
        .from('notas_oficiais')
        .select('id')
        .eq('demanda_id', selectedDemand.id);
      
      if (notesError) {
        console.error('Error checking related notes:', notesError);
        throw notesError;
      }
      
      if (relatedNotes && relatedNotes.length > 0) {
        console.log('Found related notes, deleting them first:', relatedNotes);
        
        // Delete related notes
        const { error: deleteNotesError } = await supabase
          .from('notas_oficiais')
          .delete()
          .in('id', relatedNotes.map(note => note.id));
          
        if (deleteNotesError) {
          console.error('Error deleting related notes:', deleteNotesError);
          throw deleteNotesError;
        }
      }
      
      // Delete related responses
      console.log('Deleting related responses');
      const { error: deleteResponsesError } = await supabase
        .from('respostas_demandas')
        .delete()
        .eq('demanda_id', selectedDemand.id);
        
      if (deleteResponsesError) {
        console.error('Error deleting responses:', deleteResponsesError);
        throw deleteResponsesError;
      }
      
      // Finally delete the demand
      console.log('Deleting the demand itself');
      const { error: deleteDemandError } = await supabase
        .from('demandas')
        .delete()
        .eq('id', selectedDemand.id);
        
      if (deleteDemandError) {
        console.error('Error deleting demand:', deleteDemandError);
        throw deleteDemandError;
      }
      
      toast({
        title: "Demanda excluída",
        description: "A demanda e todas as notas associadas foram excluídas com sucesso."
      });
      
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Error in delete process:', error);
      toast({
        title: "Erro ao excluir demanda",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedDemand,
    setSelectedDemand,
    isDetailOpen,
    setIsDetailOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteLoading,
    filteredDemandas,
    isLoading,
    error,
    refetch,
    handleDeleteConfirm
  };
};
