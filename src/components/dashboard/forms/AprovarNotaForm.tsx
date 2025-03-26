import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import NotasList from './components/NotasList';
import NotaDetail from './components/NotaDetail';
import { NotaOficial } from '@/types/nota';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AprovarNotaFormProps {}

const AprovarNotaForm: React.FC<AprovarNotaFormProps> = () => {
  const { user } = useAuth();
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedText, setEditedText] = useState('');

  const { data: notas, isLoading, refetch } = useQuery({
    queryKey: ['notas-pendentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor:autor_id (id, nome_completo),
          aprovador:aprovador_id (id, nome_completo),
          problema:problema_id (id, descricao),
          supervisao_tecnica:supervisao_tecnica_id (id, descricao),
          demanda:demanda_id (id, titulo)
        `)
        .eq('status', 'pendente')
        .order('criado_em', { ascending: false });
        
      if (error) throw error;
      return data as unknown as NotaOficial[];
    }
  });

  const handleSelectNota = (nota: NotaOficial) => {
    setSelectedNota(nota);
    setEditedTitle(nota.titulo);
    setEditedText(nota.texto);
    setEditMode(false);
  };

  const handleBackToList = () => {
    setSelectedNota(null);
    setEditMode(false);
  };

  const handleEditMode = () => {
    if (!selectedNota) return;
    setEditedTitle(selectedNota.titulo);
    setEditedText(selectedNota.texto);
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedNota || !user) return;
    
    setIsSubmitting(true);
    try {
      const { error: historyError } = await supabase
        .from('notas_historico_edicoes')
        .insert({
          nota_id: selectedNota.id,
          editor_id: user.id,
          texto_anterior: selectedNota.texto,
          texto_novo: editedText,
          titulo_anterior: selectedNota.titulo,
          titulo_novo: editedTitle
        });
      
      if (historyError) throw historyError;
      
      const { error: updateError } = await supabase
        .from('notas_oficiais')
        .update({
          titulo: editedTitle,
          texto: editedText,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', selectedNota.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Nota atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
      
      refetch();
      setEditMode(false);
      
      if (selectedNota) {
        setSelectedNota({
          ...selectedNota,
          titulo: editedTitle,
          texto: editedText,
          atualizado_em: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erro ao salvar edições:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAprovarNota = async () => {
    if (!selectedNota || !user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('notas_oficiais')
        .update({
          status: 'aprovado',
          aprovador_id: user.id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', selectedNota.id);
      
      if (error) throw error;
      
      toast({
        title: "Nota aprovada",
        description: "A nota oficial foi aprovada com sucesso.",
      });
      
      refetch();
      setSelectedNota(null);
    } catch (error) {
      console.error('Erro ao aprovar nota:', error);
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar a nota oficial.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejeitarNota = async () => {
    if (!selectedNota || !user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('notas_oficiais')
        .update({
          status: 'rejeitado',
          aprovador_id: user.id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', selectedNota.id);
      
      if (error) throw error;
      
      toast({
        title: "Nota rejeitada",
        description: "A nota oficial foi rejeitada.",
      });
      
      refetch();
      setSelectedNota(null);
    } catch (error) {
      console.error('Erro ao rejeitar nota:', error);
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar a nota oficial.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (editMode && selectedNota) {
    return (
      <Card className="p-6">
        <div>
          <button 
            onClick={() => setEditMode(false)} 
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← Voltar para visualização
          </button>
          
          <h3 className="text-lg font-medium mb-4">Editar Nota Oficial</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo
              </label>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={10}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (selectedNota) {
    return (
      <NotaDetail 
        nota={selectedNota}
        onBack={handleBackToList}
        onAprovar={handleAprovarNota}
        onRejeitar={handleRejeitarNota}
        onEditar={handleEditMode}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Aprovar Notas Oficiais</h2>
        <p className="text-sm text-gray-600">
          Revise e aprove notas oficiais criadas pela equipe.
        </p>
      </div>
      
      <Tabs defaultValue="pendentes">
        <TabsList className="mb-4">
          <TabsTrigger value="pendentes">Pendentes de Aprovação</TabsTrigger>
        </TabsList>
        <TabsContent value="pendentes">
          <NotasList 
            notas={notas || []}
            isLoading={isLoading}
            onSelectNota={handleSelectNota}
            selectedNota={selectedNota}
            emptyMessage="Nenhuma nota pendente de aprovação no momento."
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AprovarNotaForm;
