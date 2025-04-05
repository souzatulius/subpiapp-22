
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Send } from 'lucide-react';

const CadastrarRelease = () => {
  const [releaseContent, setReleaseContent] = useState('');
  const [isGeneratingNews, setIsGeneratingNews] = useState(false);
  const [generatedNews, setGeneratedNews] = useState<{ titulo: string; conteudo: string } | null>(null);

  const handleSaveRelease = async () => {
    if (!releaseContent.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "O conteúdo do release não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would implement the actual saving logic to your database
      // For demonstration, we'll just show a success message
      toast({
        title: "Release salvo com sucesso",
        description: "O conteúdo do release foi salvo com sucesso.",
        variant: "success",
      });

      // Ask if user wants to generate news
      const shouldGenerate = window.confirm("Release salvo com sucesso. Deseja gerar uma notícia a partir deste release?");
      if (shouldGenerate) {
        await handleGenerateNews();
      }
    } catch (error) {
      console.error("Erro ao salvar release:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o release. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateNews = async () => {
    if (!releaseContent.trim()) {
      toast({
        title: "Erro ao gerar notícia",
        description: "O conteúdo do release não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingNews(true);
    setGeneratedNews(null);

    try {
      // Call the Supabase Edge Function to generate news
      const { data, error } = await supabase.functions.invoke('generate-news', {
        body: { releaseContent }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.success && data.data) {
        setGeneratedNews(data.data);
        toast({
          title: "Notícia gerada com sucesso",
          description: "A notícia foi gerada com base no release fornecido.",
          variant: "success",
        });
      } else {
        throw new Error("Resposta inválida do serviço de geração de notícias");
      }
    } catch (error) {
      console.error("Erro ao gerar notícia:", error);
      toast({
        title: "Erro ao gerar notícia",
        description: "Ocorreu um erro ao gerar a notícia. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingNews(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Cadastrar Novo Release</h1>
        
        <div className="mb-6">
          <label htmlFor="release-content" className="block mb-2 font-medium">
            Conteúdo do Release
          </label>
          <Textarea
            id="release-content"
            value={releaseContent}
            onChange={(e) => setReleaseContent(e.target.value)}
            placeholder="Cole aqui o texto integral do release recebido por e-mail."
            className="min-h-[300px]"
          />
        </div>

        <div className="flex gap-4 mb-8">
          <Button
            onClick={handleSaveRelease}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Salvar Release
          </Button>
          
          <Button
            onClick={handleGenerateNews}
            variant="action"
            disabled={isGeneratingNews || !releaseContent.trim()}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isGeneratingNews ? "Gerando..." : "Gerar Notícia"}
          </Button>
        </div>

        {generatedNews && (
          <div className="border rounded-xl p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Notícia Gerada</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Título</h3>
              <div className="p-4 bg-white border rounded-lg">
                {generatedNews.titulo}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Conteúdo</h3>
              <div className="p-4 bg-white border rounded-lg whitespace-pre-line">
                {generatedNews.conteudo}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadastrarRelease;
