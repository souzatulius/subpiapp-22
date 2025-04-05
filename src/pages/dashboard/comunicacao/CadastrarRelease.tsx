
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { FileText, Save, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReleaseFormData {
  conteudo: string;
}

interface NotaGerada {
  titulo: string;
  conteudo: string;
}

const CadastrarRelease = () => {
  const navigate = useNavigate();
  const [releaseContent, setReleaseContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<NotaGerada | null>(null);
  
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
      // Save release to database
      const { error } = await supabase
        .from('releases')
        .insert({ 
          conteudo: releaseContent,
          tipo: 'imprensa', // Adding required fields
          autor_id: 'sistema' // Using a default value for now
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
      
      setGeneratedContent(data.data);
      setShowGeneratedContent(true);
      
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
    // Navigate to CriarNotaOficial with pre-filled content
    if (generatedContent) {
      // Here you would save the generated content or pass it to the next page
      toast({
        title: "Redirecionando",
        description: "Você será redirecionado para criar a nota oficial."
      });
      // Example: navigate to create note page with state
      // navigate('/dashboard/comunicacao/criar-nota-oficial', { state: { titulo: generatedContent.titulo, conteudo: generatedContent.conteudo } });
    }
    setShowConfirmDialog(false);
    setShowGeneratedContent(false);
  };

  return (
    <div className="space-y-6">
      <WelcomeCard
        title="Cadastro de Releases"
        description="Crie e publique novas notícias e releases para divulgação na imprensa"
        icon={<FileText className="h-6 w-6 mr-2 text-white" />}
        color="bg-gradient-to-r from-orange-500 to-orange-700"
      />

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Novo Release</h2>
        
        <div className="mb-6">
          <Textarea 
            value={releaseContent}
            onChange={(e) => setReleaseContent(e.target.value)}
            placeholder="Cole aqui o texto do release recebido por e-mail"
            className="min-h-[400px]"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 justify-end">
          <Button 
            variant="default" 
            onClick={handleSaveRelease}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          
          <Button 
            variant="action" 
            onClick={handleGenerateNews}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Gerar Notícia
            {isGenerating && (
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin ml-2"></div>
            )}
          </Button>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar notícia</DialogTitle>
            <DialogDescription>
              Deseja criar uma notícia com base neste release?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Não
            </Button>
            <Button variant="action" onClick={handleGenerateNews}>
              Sim, gerar notícia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Generated Content Dialog */}
      <Dialog open={showGeneratedContent} onOpenChange={setShowGeneratedContent}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Notícia Gerada</DialogTitle>
            <DialogDescription>
              Conteúdo gerado com base no release fornecido
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">Título</h3>
                <Badge variant="warning">Sugestão</Badge>
              </div>
              <p className="p-3 bg-gray-50 rounded-md">{generatedContent?.titulo}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">Conteúdo</h3>
                <Badge variant="warning">Sugestão</Badge>
              </div>
              <div className="p-3 bg-gray-50 rounded-md whitespace-pre-line">
                {generatedContent?.conteudo}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowGeneratedContent(false)}>
              Fechar
            </Button>
            <Button variant="action" onClick={handleCreateNote}>
              Criar Nota Oficial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CadastrarRelease;
