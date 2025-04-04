
import { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Release, GeneratedNews } from '@/components/release/types';

export const useReleaseForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [releaseContent, setReleaseContent] = useState('');
  const [isGeneratingNews, setIsGeneratingNews] = useState(false);
  const [isSavingRelease, setIsSavingRelease] = useState(false);
  const [generatedNews, setGeneratedNews] = useState<GeneratedNews | null>(null);
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [savedReleaseId, setSavedReleaseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReleaseContent = async (releaseId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('id', releaseId)
        .single() as any;
      
      if (error) throw error;
      
      if (data) {
        setReleaseContent(data.conteudo);
        // Automatically trigger news generation
        handleGenerateNews(data.conteudo);
      }
    } catch (error: any) {
      console.error('Erro ao carregar release:', error);
      toast({
        title: "Erro ao carregar release",
        description: error.message || "Não foi possível carregar o conteúdo do release.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNoticiaContent = async (noticiaId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('id', noticiaId)
        .single() as any;
      
      if (error) throw error;
      
      if (data) {
        // If we're editing a noticia, set it up in the editing form
        setGeneratedNews({
          titulo: data.titulo || '',
          conteudo: data.conteudo
        });
        setIsEditingNews(true);
      }
    } catch (error: any) {
      console.error('Erro ao carregar notícia:', error);
      toast({
        title: "Erro ao carregar notícia",
        description: error.message || "Não foi possível carregar o conteúdo da notícia.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRelease = async () => {
    if (!releaseContent.trim()) {
      toast({
        title: "Conteúdo vazio",
        description: "Por favor, cole o conteúdo do release antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSavingRelease(true);
      
      // Using the custom client approach to avoid TypeScript errors
      const { data, error } = await supabase
        .from('releases')
        .insert({
          conteudo: releaseContent,
          tipo: 'release',
          autor_id: user?.id
        } as any)
        .select() as any;
      
      if (error) throw error;
      
      toast({
        title: "Release salvo com sucesso!",
        description: "O release foi salvo no banco de dados.",
      });
      
      // Store the saved release ID for potential news generation
      setSavedReleaseId(data[0].id);
      
      // Show dialog asking if user wants to generate news
      setShowGenerateDialog(true);
      
    } catch (error: any) {
      console.error('Erro ao salvar release:', error);
      toast({
        title: "Erro ao salvar release",
        description: error.message || "Ocorreu um erro ao salvar o release. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSavingRelease(false);
    }
  };

  const handleGenerateNews = async (content = releaseContent) => {
    if (!content.trim()) {
      toast({
        title: "Conteúdo vazio",
        description: "Por favor, cole o conteúdo do release antes de gerar notícia.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingNews(true);
      
      // Call the Edge Function to generate news
      const { data: generatedData, error: functionError } = await supabase.functions
        .invoke('generate-news', {
          body: { releaseContent: content }
        });

      if (functionError) throw functionError;
      
      if (!generatedData.success || !generatedData.data) {
        throw new Error(generatedData.error || "Falha na geração da notícia");
      }
      
      // Set the generated news and show the editing mode
      setGeneratedNews(generatedData.data);
      setIsEditingNews(true);
      
      toast({
        title: "Notícia gerada com sucesso!",
        description: "Revise e edite a notícia gerada antes de salvar.",
      });
      
    } catch (error: any) {
      console.error('Erro ao gerar notícia:', error);
      toast({
        title: "Erro ao gerar notícia",
        description: error.message || "Ocorreu um erro ao gerar a notícia. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingNews(false);
    }
  };

  const handleSaveNews = async () => {
    if (!generatedNews || !releaseContent.trim()) {
      toast({
        title: "Dados incompletos",
        description: "Não foi possível salvar a notícia. Dados incompletos.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSavingRelease(true);
      
      // Check if we need to save the release first
      let releaseId = savedReleaseId;
      
      if (!releaseId) {
        // First save the release
        const { data: releaseData, error: releaseError } = await supabase
          .from('releases')
          .insert({
            conteudo: releaseContent,
            tipo: 'release',
            autor_id: user?.id
          } as any)
          .select() as any;
        
        if (releaseError) throw releaseError;
        releaseId = releaseData[0].id;
      }
      
      // Then save the generated news with a reference to the release
      const { data: newsData, error: newsError } = await supabase
        .from('releases')
        .insert({
          titulo: generatedNews.titulo,
          conteudo: generatedNews.conteudo,
          tipo: 'noticia',
          autor_id: user?.id,
          release_origem_id: releaseId,
          publicada: false
        } as any)
        .select() as any;
      
      if (newsError) throw newsError;
      
      toast({
        title: "Notícia salva com sucesso!",
        description: "A notícia e o release original foram salvos no banco de dados.",
      });
      
      // Redirect to the news tab of ListarReleases
      navigate('/dashboard/comunicacao/releases?tab=noticias');
      
    } catch (error: any) {
      console.error('Erro ao salvar notícia:', error);
      toast({
        title: "Erro ao salvar notícia",
        description: error.message || "Ocorreu um erro ao salvar a notícia. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSavingRelease(false);
    }
  };

  return {
    releaseContent,
    setReleaseContent,
    isGeneratingNews,
    isSavingRelease,
    generatedNews,
    setGeneratedNews,
    isEditingNews,
    setIsEditingNews,
    showGenerateDialog,
    setShowGenerateDialog,
    isLoading,
    fetchReleaseContent,
    fetchNoticiaContent,
    handleSaveRelease,
    handleGenerateNews,
    handleSaveNews,
  };
};
