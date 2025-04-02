
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import NotaDetail from './components/NotaDetail';
import NotaEditForm from './components/NotaEditForm';
import NotasListView from './components/NotasListView';
import { NotaOficial } from '@/types/nota';
import { useApprovalForm } from '@/hooks/consultar-notas/useApprovalForm';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface AprovarNotaFormProps {}

const AprovarNotaForm: React.FC<AprovarNotaFormProps> = () => {
  const { session, user } = useAuth();

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
    handleAprovarNota,
    handleRejeitarNota,
    setEditedTitle,
    setEditedText
  } = useApprovalForm(refetch);

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

  // Render list view UI - Fix the hideHeaderButton prop
  return (
    <NotasListView 
      notas={notas || []} 
      isLoading={isLoading}
      onSelectNota={handleSelectNota}
      selectedNota={selectedNota}
    />
  );
};

export default AprovarNotaForm;
