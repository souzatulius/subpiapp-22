
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
      if (error) throw error;
      
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
    demand.servico?.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
    demand.area_coordenacao?.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (!selectedDemand) return;
    setDeleteLoading(true);
    
    try {
      // First check for approved or published notes
      const { data: relatedNotes, error: checkNotesError } = await supabase
        .from('notas_oficiais')
        .select('id, status')
        .eq('demanda_id', selectedDemand.id);
      
      if (checkNotesError) throw checkNotesError;
      
      if (relatedNotes && relatedNotes.length > 0) {
        const hasApprovedNotes = relatedNotes.some(note => 
          note.status === 'aprovado' || note.status === 'publicado'
        );
        
        if (hasApprovedNotes) {
          toast({
            title: "Não é possível excluir a demanda",
            description: "Esta demanda possui notas oficiais aprovadas ou publicadas associadas.",
            variant: "destructive"
          });
          setIsDeleteDialogOpen(false);
          setDeleteLoading(false);
          return;
        }
        
        toast({
          title: "Atenção",
          description: "Esta demanda possui notas oficiais associadas que também serão excluídas.",
          variant: "default" // Changed from "warning" to "default" as "warning" is not a supported variant
        });
      }
      
      // First delete related responses to avoid the foreign key constraint error
      const { error: deleteResponsesError } = await supabase
        .from('respostas_demandas')
        .delete()
        .eq('demanda_id', selectedDemand.id);
        
      if (deleteResponsesError) throw deleteResponsesError;
        
      // Then delete related notes if they exist
      if (relatedNotes && relatedNotes.length > 0) {
        const { error: deleteNotesError } = await supabase
          .from('notas_oficiais')
          .delete()
          .eq('demanda_id', selectedDemand.id);
          
        if (deleteNotesError) throw deleteNotesError;
      }
      
      // Finally delete the demand itself
      const { error } = await supabase
        .from('demandas')
        .delete()
        .eq('id', selectedDemand.id);
        
      if (error) throw error;
      
      toast({
        title: "Demanda excluída",
        description: "A demanda foi excluída com sucesso."
      });
      
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
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
