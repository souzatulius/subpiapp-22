
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NotaGerada {
  titulo: string;
  conteudo: string;
}

export const useReleaseForm = () => {
  const navigate = useNavigate();
  const [releaseContent, setReleaseContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<NotaGerada | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  
  const handleSaveRelease = async () => {
    if (!releaseContent.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Insira o conteúdo do release para continuar",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get the current authenticated user ID
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id || 'sistema';
      
      // Save release to database
      const { error } = await supabase
        .from('releases')
        .insert({ 
          conteudo: releaseContent,
          tipo: 'imprensa', // Adding required fields
          autor_id: userId // Using the actual user id or fallback
        });
      
      if (error) throw error;
      
      toast({
        title: "Release salvo",
        description: "O conteúdo do release foi salvo com sucesso!"
      });
      
      // Show confirmation dialog to create news
      setShowConfirmDialog(true);
      
    } catch (error) {
      console.error('Erro ao salvar release:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o release. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGenerateNews = async () => {
    if (!releaseContent.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Insira o conteúdo do release para gerar a notícia",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Call OpenAI through Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-news', {
        body: { releaseContent }
      });
      
      if (error) throw error;
      
      if (data?.data) {
        setGeneratedContent(data.data);
        setEditedTitle(data.data.titulo || '');
        setEditedContent(data.data.conteudo || '');
        setShowGeneratedContent(true);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
      
    } catch (error) {
      console.error('Erro ao gerar notícia:', error);
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar a notícia. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCreateNote = async () => {
    // Here you would save the edited content
    if (editedTitle && editedContent) {
      try {
        // Get the current authenticated user ID
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id || 'sistema';
        
        // Create new nota oficial with the edited content
        const { error } = await supabase
          .from('notas_oficiais')
          .insert({
            titulo: editedTitle,
            texto: editedContent,
            autor_id: userId,
            problema_id: '00000000-0000-0000-0000-000000000000', // Using a placeholder, you'll need to update this
            status: 'pendente'
          });
          
        if (error) throw error;
        
        toast({
          title: "Nota criada",
          description: "A nota oficial foi criada com sucesso!"
        });
        
        // Redirect to notas list or another appropriate page
        navigate('/dashboard/comunicacao/consultar-notas');
      } catch (error) {
        console.error('Erro ao criar nota:', error);
        toast({
          title: "Erro ao criar nota",
          description: "Não foi possível criar a nota oficial. Tente novamente.",
          variant: "destructive"
        });
      }
    }
    
    setShowConfirmDialog(false);
    setShowGeneratedContent(false);
  };

  return {
    releaseContent,
    setReleaseContent,
    isSubmitting,
    isGenerating,
    showConfirmDialog,
    setShowConfirmDialog,
    showGeneratedContent,
    setShowGeneratedContent,
    generatedContent,
    editedTitle,
    setEditedTitle,
    editedContent,
    setEditedContent,
    handleSaveRelease,
    handleGenerateNews,
    handleCreateNote
  };
};
