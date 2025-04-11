
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import NotaDetail from './components/NotaDetail';
import NotaEditForm from './components/NotaEditForm';
import { NotaOficial } from '@/types/nota';
import { useApprovalForm } from '@/hooks/consultar-notas/useApprovalForm';
import { useAuth } from '@/hooks/useSupabaseAuth';
import UnifiedViewContainer from '@/components/shared/unified-view/UnifiedViewContainer';
import NotaCard from './components/NotaCard';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

interface AprovarNotaFormProps {}

const AprovarNotaForm: React.FC<AprovarNotaFormProps> = () => {
  const { session, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pendente');
  const { showFeedback } = useAnimatedFeedback();

  const { data: notas, isLoading, refetch } = useQuery({
    queryKey: ['notas-pendentes'],
    queryFn: async () => {
      if (!session || !user) {
        console.log("Usuário não autenticado ao tentar carregar notas");
        return [];
      }

      console.log("Carregando notas como usuário:", user.id);

      const { data, error } = await supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor:autor_id (id, nome_completo),
          aprovador:aprovador_id (id, nome_completo),
          problema:problema_id (
            id, 
            descricao,
            coordenacao:coordenacao_id (
              id, 
              descricao
            )
          ),
          demanda:demanda_id (id, titulo)
        `)
        .eq('status', 'pendente')
        .order('criado_em', { ascending: false });
        
      if (error) {
        console.error("Erro ao carregar notas:", error);
        throw error;
      }

      console.log(`${data?.length || 0} notas carregadas`);
      return data as unknown as NotaOficial[];
    },
    enabled: !!session && !!user
  });

  const {
    selectedNota,
    isSubmitting,
    editMode,
    editedTitle,
    editedText,
    statusLoading,
    handleSelectNota,
    handleBackToList,
    handleEditMode,
    handleSaveEdit,
    handleAprovarNota: originalHandleAprovarNota,
    handleRejeitarNota: originalHandleRejeitarNota,
    setEditedTitle,
    setEditedText
  } = useApprovalForm(refetch);

  // Wrap the approval handlers to show animated feedback instead of toast
  const handleAprovarNota = async () => {
    try {
      await originalHandleAprovarNota();
      showFeedback('success', 'Nota aprovada com sucesso');
    } catch (error: any) {
      showFeedback('error', error.message || 'Erro ao aprovar nota');
    }
  };

  const handleRejeitarNota = async () => {
    try {
      await originalHandleRejeitarNota();
      showFeedback('success', 'Nota rejeitada com sucesso');
    } catch (error: any) {
      showFeedback('error', error.message || 'Erro ao rejeitar nota');
    }
  };

  // Filter notas based on search term
  const filteredNotas = React.useMemo(() => {
    if (!notas) return [];
    
    return notas.filter(nota => {
      const searchLower = searchTerm.toLowerCase();
      return (
        nota.titulo.toLowerCase().includes(searchLower) ||
        (nota.autor?.nome_completo?.toLowerCase() || '').includes(searchLower) ||
        (nota.problema?.coordenacao?.descricao?.toLowerCase() || '').includes(searchLower) ||
        (nota.texto?.toLowerCase() || '').includes(searchLower)
      );
    });
  }, [notas, searchTerm]);

  const statusOptions = [
    { id: 'pendente', label: 'Pendentes' },
    { id: 'aprovada', label: 'Aprovadas' },
    { id: 'rejeitada', label: 'Rejeitadas' },
    { id: 'todos', label: 'Todas' }
  ];

  if (!session || !user) {
    return (
      <div className="p-6 text-center">
        <p>Você precisa estar autenticado para acessar esta página.</p>
      </div>
    );
  }

  // Render edit mode UI
  if (editMode && selectedNota) {
    return (
      <NotaEditForm
        title={editedTitle}
        text={editedText}
        onTitleChange={setEditedTitle}
        onTextChange={setEditedText}
        onSave={handleSaveEdit}
        onCancel={() => handleBackToList()}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Render detail view UI
  if (selectedNota) {
    return (
      <NotaDetail 
        nota={selectedNota}
        onBack={handleBackToList}
        onAprovar={handleAprovarNota}
        onRejeitar={handleRejeitarNota}
        onEditar={handleEditMode}
        isSubmitting={isSubmitting || statusLoading}
      />
    );
  }

  // Render unified list/grid view UI
  return (
    <UnifiedViewContainer
      items={filteredNotas || []}
      isLoading={isLoading}
      renderListItem={(nota) => (
        <NotaCard
          nota={nota}
          isSelected={false}
          onClick={() => {}}
        />
      )}
      renderGridItem={(nota) => (
        <NotaCard
          nota={nota}
          isSelected={false}
          onClick={() => {}}
        />
      )}
      idExtractor={(nota) => nota.id}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onItemClick={handleSelectNota}
      selectedItemId={selectedNota?.id}
      filterOptions={{
        primaryFilter: {
          value: statusFilter,
          onChange: setStatusFilter,
          options: statusOptions,
          placeholder: 'Status'
        }
      }}
      emptyStateMessage="Nenhuma nota pendente de aprovação no momento."
      searchPlaceholder="Buscar notas..."
      defaultViewMode="list"
      gridColumns={{ sm: 1, md: 2, lg: 3 }}
    />
  );
};

export default AprovarNotaForm;
