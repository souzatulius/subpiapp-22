
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { ESICProcesso } from '@/types/esic';
import ProcessoItem from './ProcessoItem';
import ProcessoListEmpty from './ProcessoListEmpty';
import ProcessoListSkeleton from './ProcessoListSkeleton';

interface ProcessoListProps {
  searchTerm?: string;
  onAddJustificativa?: (processoId: string, processoTexto: string) => void;
  onViewClick?: (processo: ESICProcesso) => void;
  onEditClick?: (processo: ESICProcesso) => void;
  onDeleteClick?: (processo: ESICProcesso) => void;
  showEmptyState?: boolean;
  processos?: ESICProcesso[];
  isLoading?: boolean;
}

const ProcessoList: React.FC<ProcessoListProps> = ({
  searchTerm = '',
  onAddJustificativa,
  onViewClick,
  onEditClick,
  onDeleteClick,
  showEmptyState = false,
  processos: externalProcessos,
  isLoading: externalLoading,
}) => {
  const { user } = useAuth();
  const [processos, setProcessos] = useState<ESICProcesso[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If processos are provided externally, use those instead of fetching
    if (externalProcessos) {
      setProcessos(externalProcessos);
      return;
    }
    
    const fetchProcessos = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching ESIC processos...');
        
        const { data, error } = await supabase
          .from('esic_processos')
          .select(`
            *,
            autor:usuarios(nome_completo)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching ESIC processos:', error);
          throw error;
        }
        
        console.log('ESIC processos fetched:', data);
        
        // Cast the data to the correct type, handling the autor relationship
        const formattedProcessos = data.map((processo: any) => {
          // Handle the case where autor is null or not properly fetched
          const autorNome = processo.autor?.nome_completo || 'Usuário';
          
          return {
            ...processo,
            autor_nome: autorNome,
          } as ESICProcesso;
        });
        
        setProcessos(formattedProcessos);
      } catch (error) {
        console.error('Error fetching processos:', error);
        toast({
          title: 'Erro ao carregar processos',
          description: 'Não foi possível carregar a lista de processos.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProcessos();
  }, [externalProcessos]);

  // Filter processos based on search term
  const filteredProcessos = processos.filter(processo => {
    return processo.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           processo.protocolo?.toString().includes(searchTerm.toLowerCase()) ||
           (processo.solicitante?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  });

  const handleAddJustificativa = (processo: ESICProcesso) => {
    if (onAddJustificativa) {
      onAddJustificativa(processo.id, processo.assunto);
    }
  };

  const isLoadingState = externalLoading !== undefined ? externalLoading : loading;

  if (isLoadingState) {
    return <ProcessoListSkeleton />;
  }

  if ((filteredProcessos.length === 0 && !showEmptyState) || (showEmptyState && processos.length === 0)) {
    return <ProcessoListEmpty searchTerm={searchTerm} />;
  }

  return (
    <div className="space-y-4 py-0">
      {filteredProcessos.map((processo) => (
        <ProcessoItem
          key={processo.id}
          processo={processo}
          onViewClick={onViewClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onAddJustificativa={onAddJustificativa ? () => handleAddJustificativa(processo) : undefined}
        />
      ))}
    </div>
  );
};

export default ProcessoList;
