
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Sparkles } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { motion } from 'framer-motion';

// Define a type for releases since it might not be in the Supabase types yet
interface Release {
  id: string;
  tipo: 'release' | 'noticia';
  titulo?: string;
  conteudo: string;
  release_origem_id?: string | null;
  criado_em: string;
  autor_id: string;
}

const CadastrarRelease = () => {
  const { user } = useAuth();
  const [releaseContent, setReleaseContent] = useState('');
  const [isGeneratingNews, setIsGeneratingNews] = useState(false);
  const [isSavingRelease, setIsSavingRelease] = useState(false);
  const [generatedNews, setGeneratedNews] = useState<{ titulo: string; conteudo: string } | null>(null);
  const [isEditingNews, setIsEditingNews] = useState(false);

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
      
      // Clear the form after successful save
      setReleaseContent('');
      
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

  const handleGenerateNews = async () => {
    if (!releaseContent.trim()) {
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
          body: { releaseContent }
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
      
      // Then save the generated news with a reference to the release
      const { data: newsData, error: newsError } = await supabase
        .from('releases')
        .insert({
          titulo: generatedNews.titulo,
          conteudo: generatedNews.conteudo,
          tipo: 'noticia',
          autor_id: user?.id,
          release_origem_id: releaseData[0].id
        } as any)
        .select() as any;
      
      if (newsError) throw newsError;
      
      toast({
        title: "Notícia salva com sucesso!",
        description: "A notícia e o release original foram salvos no banco de dados.",
      });
      
      // Reset the form after successful save
      setReleaseContent('');
      setGeneratedNews(null);
      setIsEditingNews(false);
      
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

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeCard
        title="Cadastrar Release"
        description="Transforme releases recebidos por e-mail em notícias editáveis"
        icon={<Sparkles className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-indigo-500 to-indigo-600"
      />

      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
        {!isEditingNews ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Novo Release</h2>
            <Textarea
              className="min-h-[300px] mb-4"
              placeholder="Cole aqui o release recebido por e-mail"
              value={releaseContent}
              onChange={(e) => setReleaseContent(e.target.value)}
            />
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleSaveRelease}
                disabled={isSavingRelease || isGeneratingNews}
              >
                {isSavingRelease ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Release
              </Button>
              <Button 
                onClick={handleGenerateNews}
                disabled={isGeneratingNews || isSavingRelease}
              >
                {isGeneratingNews ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Gerar Notícia
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Editar Notícia Gerada</h2>
            
            <div className="mb-4">
              <label htmlFor="news-title" className="block text-sm font-medium text-gray-700 mb-1">
                Título da Notícia
              </label>
              <input
                id="news-title"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={generatedNews?.titulo || ''}
                onChange={(e) => setGeneratedNews(prev => prev ? {...prev, titulo: e.target.value} : null)}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="news-content" className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo da Notícia
              </label>
              <Textarea
                id="news-content"
                className="min-h-[300px]"
                value={generatedNews?.conteudo || ''}
                onChange={(e) => setGeneratedNews(prev => prev ? {...prev, conteudo: e.target.value} : null)}
              />
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditingNews(false)}
              >
                Voltar
              </Button>
              <Button 
                onClick={handleSaveNews}
                disabled={isSavingRelease}
              >
                {isSavingRelease ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Notícia
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CadastrarRelease;
