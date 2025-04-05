
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
              Conteúdo gerado com base no release fornecido. Você pode editar o texto antes de salvar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">Título</h3>
                <Badge variant="warning">Edite conforme necessário</Badge>
              </div>
              <Textarea 
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="p-3 bg-gray-50 rounded-md"
              />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">Conteúdo</h3>
                <Badge variant="warning">Edite conforme necessário</Badge>
              </div>
              <Textarea 
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="p-3 bg-gray-50 rounded-md min-h-[300px]"
              />
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
