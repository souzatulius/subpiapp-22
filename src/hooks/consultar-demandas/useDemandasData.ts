
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
      // First fetch all demandas
      const {
        data: allDemandas,
        error: demandasError
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
      
      if (demandasError) {
        console.error('Error fetching demandas:', demandasError);
        throw demandasError;
      }
      
      // Now fetch all notas to update the demandas that have notas
      const { data: notasData, error: notasError } = await supabase
        .from('notas_oficiais')
        .select('id, demanda_id, status');
        
      if (notasError) {
        console.error('Error fetching notas:', notasError);
        throw notasError;
      }
      
      // Create a map of demanda_id to nota status for quick lookup
      const demandaToNotaStatus = new Map();
      notasData?.forEach(nota => {
        if (nota.demanda_id) {
          // If there are multiple notas for a demanda, use the most "advanced" status
          // Priority: aprovada > pendente > rejeitada
          const currentStatus = demandaToNotaStatus.get(nota.demanda_id);
          if (!currentStatus || 
              (currentStatus !== 'aprovado' && nota.status === 'aprovado') ||
              (currentStatus === 'rejeitado' && nota.status === 'pendente')) {
            demandaToNotaStatus.set(nota.demanda_id, nota.status);
          }
        }
      });
      
      // Update demanda status based on nota status
      const updatedDemandas = allDemandas?.map(demanda => {
        const notaStatus = demandaToNotaStatus.get(demanda.id);
        
        // If this demanda has a nota, update its status based on the nota's status
        if (notaStatus) {
          let updatedStatus = demanda.status;
          
          if (notaStatus === 'aprovado') {
            updatedStatus = 'nota_aprovada';
          } else if (notaStatus === 'pendente') {
            updatedStatus = 'nota_criada';
          } else if (notaStatus === 'rejeitado') {
            updatedStatus = 'nota_rejeitada';
          }
          
          return {
            ...demanda,
            status: updatedStatus
          };
        }
        
        return demanda;
      });
      
      console.log('Demandas data:', updatedDemandas);
      const processedData = updatedDemandas?.map(item => {
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
    console.log('Excluindo demanda principal:', selectedDemand.id);
    
    try {
      // A exclusão dos dados relacionados já foi feita no DeleteDemandDialog
      // Agora podemos excluir com segurança a demanda principal
      const { error: deleteDemandError } = await supabase
        .from('demandas')
        .delete()
        .eq('id', selectedDemand.id);
        
      if (deleteDemandError) {
        console.error('Erro ao excluir demanda principal:', deleteDemandError);
        throw deleteDemandError;
      }
      
      toast({
        title: "Demanda excluída",
        description: "A demanda e todos os dados associados foram excluídos com sucesso."
      });
      
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Erro completo na exclusão:', error);
      toast({
        title: "Erro ao excluir demanda",
        description: error.message || "Ocorreu um erro desconhecido ao excluir a demanda.",
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
