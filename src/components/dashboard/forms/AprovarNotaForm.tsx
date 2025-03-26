
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { Search, Edit2 } from 'lucide-react';
import { LoadingState, EmptyState } from './components/NotasListStates';
import NotasList from './components/NotasList';
import NotaDetail from './components/NotaDetail';
import { NotaOficial } from '@/types/nota';

interface AprovarNotaFormProps {
  onClose: () => void;
}

const AprovarNotaForm: React.FC<AprovarNotaFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [notas, setNotas] = useState<NotaOficial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedText, setEditedText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotas = async () => {
    setIsLoading(true);
    try {
      // Fetch only pending notes
      const { data: notasData, error: notasError } = await supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor:autor_id(id, nome_completo),
          supervisao_tecnica:supervisao_tecnica_id(id, descricao)
        `)
        .eq('status', 'pendente')
        .order('criado_em', { ascending: false });
      
      if (notasError) throw notasError;
      
      setNotas(notasData || []);
    } catch (error) {
      console.error('Erro ao carregar notas oficiais:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notas oficiais.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, []);

  const handleSelectNota = (nota: NotaOficial) => {
    setSelectedNota(nota);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (selectedNota) {
      setEditedTitle(selectedNota.titulo);
      setEditedText(selectedNota.texto);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedNota || !user) return;
    
    try {
      setIsSubmitting(true);
      
      // Create edit history record
      const { error: historyError } = await supabase
        .from('notas_historico_edicoes')
        .insert({
          nota_id: selectedNota.id,
          texto_anterior: selectedNota.texto,
          texto_novo: editedText,
          titulo_anterior: selectedNota.titulo,
          titulo_novo: editedTitle,
          editor_id: user.id
        });
      
      if (historyError) throw historyError;
      
      // Update the note
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
        description: "A nota oficial foi atualizada com sucesso."
      });
      
      // Refresh and exit edit mode
      fetchNotas();
      setIsEditing(false);
      setSelectedNota(null);
    } catch (error: any) {
      console.error('Erro ao editar nota:', error);
      toast({
        title: "Erro ao editar nota",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedNota || !user) return;
    
    try {
      setIsSubmitting(true);
      
      const { error: notaError } = await supabase
        .from('notas_oficiais')
        .update({ 
          status: 'aprovado',
          aprovador_id: user.id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', selectedNota.id);
      
      if (notaError) throw notaError;
      
      if (selectedNota.demanda_id) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ status: 'aprovada' })
          .eq('id', selectedNota.demanda_id);
        
        if (demandaError) throw demandaError;
      }
      
      toast({
        title: "Nota aprovada com sucesso!",
        description: "A nota oficial foi aprovada e está pronta para divulgação."
      });
      
      fetchNotas();
      setSelectedNota(null);
    } catch (error: any) {
      console.error('Erro ao aprovar nota:', error);
      toast({
        title: "Erro ao aprovar nota",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedNota || !user) return;
    
    try {
      setIsSubmitting(true);
      
      const { error: notaError } = await supabase
        .from('notas_oficiais')
        .update({ 
          status: 'rejeitado',
          aprovador_id: user.id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', selectedNota.id);
      
      if (notaError) throw notaError;
      
      if (selectedNota.demanda_id) {
        const { error: demandaError } = await supabase
          .from('demandas')
          .update({ status: 'rejeitada' })
          .eq('id', selectedNota.demanda_id);
        
        if (demandaError) throw demandaError;
      }
      
      toast({
        title: "Nota rejeitada",
        description: "A nota oficial foi rejeitada e retornada para revisão."
      });
      
      fetchNotas();
      setSelectedNota(null);
    } catch (error: any) {
      console.error('Erro ao rejeitar nota:', error);
      toast({
        title: "Erro ao rejeitar nota",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Aprovar Notas Oficiais</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!selectedNota ? (
            <div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título ou área..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <NotasList 
                notas={notas}
                selectedNota={selectedNota}
                onSelectNota={handleSelectNota}
                isAdmin={true}
                isLoading={isLoading}
              />
            </div>
          ) : isEditing ? (
            <div>
              <Button variant="outline" className="mb-4" onClick={handleCancelEdit}>
                Voltar
              </Button>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <Input
                    id="titulo"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo
                  </label>
                  <Textarea
                    id="texto"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full min-h-[300px]"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={isSubmitting || !editedTitle.trim() || !editedText.trim()}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar Edições"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <NotaDetail 
              nota={selectedNota}
              onBack={() => setSelectedNota(null)}
              onAprovar={handleApprove}
              onRejeitar={handleReject}
              onEditar={handleStartEdit}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AprovarNotaForm;
