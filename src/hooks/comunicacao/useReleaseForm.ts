
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

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
  const { showFeedback } = useAnimatedFeedback();
  
  const handleSaveRelease = async () => {
    if (!releaseContent.trim()) {
      showFeedback('error', 'Insira o conteúdo do release para continuar');
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
          tipo: 'release',  // We're saving it as a release
          autor_id: userId,
          status: 'pendente'
        });
      
      if (error) throw error;
      
      showFeedback('success', 'Release salvo com sucesso!');
      
      // Show confirmation dialog to create news
      setShowConfirmDialog(true);
      
    } catch (error: any) {
      console.error('Erro ao salvar release:', error);
      showFeedback('error', 'Não foi possível salvar o release');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGenerateNews = async () => {
    if (!releaseContent.trim()) {
      showFeedback('error', 'Insira o conteúdo do release para gerar a notícia');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Call the new unified edge function
      const { data, error } = await supabase.functions.invoke('generate-with-gpt', {
        body: { 
          tipo: 'release',
          dados: { releaseTexto: releaseContent }
        }
      });
      
      if (error) throw error;
      
      if (data?.resultado) {
        // Extract title and content from the generated text
        const lines = data.resultado.split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        
        const generatedData = {
          titulo: title,
          conteudo: content
        };
        
        setGeneratedContent(generatedData);
        setEditedTitle(generatedData.titulo);
        setEditedContent(generatedData.conteudo);
        setShowGeneratedContent(true);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
      
    } catch (error: any) {
      console.error('Erro ao gerar notícia:', error);
      showFeedback('error', 'Não foi possível gerar a notícia');
    } finally {
      setIsGenerating(false);
      setShowConfirmDialog(false);
    }
  };
  
  const handleCreateNote = async () => {
    if (editedTitle && editedContent) {
      try {
        // Get the current authenticated user ID
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id || 'sistema';
        
        // Save the original release first to get its ID
        const { data: releaseData, error: releaseError } = await supabase
          .from('releases')
          .insert({ 
            conteudo: releaseContent,
            tipo: 'release',  // This is the original release
            autor_id: userId,
            status: 'pendente'
          })
          .select()
          .single();
        
        if (releaseError) throw releaseError;
        
        // Create the news with reference to the original release
        const { error: newsError } = await supabase
          .from('releases')
          .insert({
            titulo: editedTitle,
            conteudo: editedContent,
            tipo: 'noticia',  // This is the generated news
            autor_id: userId,
            release_origem_id: releaseData?.id, // Link to the original release
            status: 'pendente'
          });
          
        if (newsError) throw newsError;
        
        showFeedback('success', 'Notícia criada com sucesso!');
        
        // Redirect to releases list
        navigate('/dashboard/comunicacao/releases');
      } catch (error: any) {
        console.error('Erro ao criar notícia:', error);
        showFeedback('error', 'Não foi possível criar a notícia');
      }
    }
    
    setShowConfirmDialog(false);
    setShowGeneratedContent(false);
  };

  const handleCancelGeneration = () => {
    setShowConfirmDialog(false);
    // Redirect to releases list when user clicks "No"
    navigate('/dashboard/comunicacao/releases');
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
    handleCreateNote,
    handleCancelGeneration
  };
};
