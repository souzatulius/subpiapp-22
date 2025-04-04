import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import WelcomeCard from '@/components/shared/WelcomeCard';
import { FileText, Loader2, Trash, SparklesIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';

interface GeneratedContent {
  titulo: string;
  conteudo: string;
}

const CadastrarRelease = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const releaseId = searchParams.get('releaseId');
  const noticiaId = searchParams.get('noticiaId');

  const [loading, setLoading] = useState(false);
  const [generatingNews, setGeneratingNews] = useState(false);
  const [savingNews, setSavingNews] = useState(false);
  const [content, setContent] = useState('');
  const [originalReleaseId, setOriginalReleaseId] = useState<string | null>(null);
  const [originReleaseContent, setOriginReleaseContent] = useState('');
  const [noticiaContent, setNoticiaContent] = useState<GeneratedContent>({
    titulo: '',
    conteudo: ''
  });
  const [isGeneratedNewsModalOpen, setIsGeneratedNewsModalOpen] = useState(false);
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
  const [isEditingNoticia, setIsEditingNoticia] = useState(false);
  const [isAskToGenerateOpen, setIsAskToGenerateOpen] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (releaseId) {
        await fetchRelease(releaseId);
      } else if (noticiaId) {
        await fetchNoticia(noticiaId);
      }
    };

    initialize();
  }, [releaseId, noticiaId]);

  const fetchRelease = async (id: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setContent(data.conteudo);
        setOriginalReleaseId(data.id);
        setOriginReleaseContent(data.conteudo);
      }
      
    } catch (error: any) {
      console.error('Error fetching release:', error);
      toast({
        title: "Erro ao carregar release",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNoticia = async (id: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setIsEditingNoticia(true);
        setNoticiaContent({
          titulo: data.titulo || '',
          conteudo: data.conteudo
        });
        setOriginalReleaseId(data.release_origem_id);
        
        if (data.release_origem_id) {
          // Fetch the origin release content
          const { data: originData, error: originError } = await supabase
            .from('releases')
            .select('conteudo')
            .eq('id', data.release_origem_id)
            .single();
            
          if (!originError && originData) {
            setOriginReleaseContent(originData.conteudo);
          }
        }
      }
      
    } catch (error: any) {
      console.error('Error fetching noticia:', error);
      toast({
        title: "Erro ao carregar notícia",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRelease = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para salvar um release.",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo do release não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const releaseData = {
        conteudo: content,
        autor_id: user.id,
        tipo: 'release',
      };
      
      const { data, error } = await supabase
        .from('releases')
        .insert([releaseData])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Release salvo com sucesso!",
      });

      setOriginalReleaseId(data.id);
      setOriginReleaseContent(data.conteudo);
      
      // Open dialog asking if user wants to generate a news article
      setIsAskToGenerateOpen(true);
      
    } catch (error: any) {
      console.error('Error saving release:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNews = async () => {
    if (!originalReleaseId) {
      toast({
        title: "Erro",
        description: "Nenhum release original encontrado para gerar notícia.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setGeneratingNews(true);
      
      // Call the edge function to generate news
      const { data: funcData, error: funcError } = await supabase.functions.invoke('generate-news', {
        body: { releaseContent: originReleaseContent }
      });
      
      if (funcError) throw funcError;
      
      if (!funcData.success) {
        throw new Error(funcData.error || "Erro ao gerar notícia");
      }
      
      setNoticiaContent(funcData.data);
      setIsGeneratedNewsModalOpen(true);
      
    } catch (error: any) {
      console.error('Error generating news:', error);
      toast({
        title: "Erro ao gerar notícia",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setGeneratingNews(false);
      setIsAskToGenerateOpen(false);
    }
  };

  const saveNoticia = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para salvar uma notícia.",
        variant: "destructive"
      });
      return;
    }
    
    if (!noticiaContent.titulo.trim() || !noticiaContent.conteudo.trim()) {
      toast({
        title: "Erro",
        description: "Título e conteúdo da notícia são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSavingNews(true);
      
      const noticiaData = {
        titulo: noticiaContent.titulo,
        conteudo: noticiaContent.conteudo,
        autor_id: user.id,
        tipo: 'noticia',
        release_origem_id: originalReleaseId,
        publicada: false
      };
      
      // If editing, update the existing notícia
      if (isEditingNoticia && noticiaId) {
        const { error } = await supabase
          .from('releases')
          .update(noticiaData)
          .eq('id', noticiaId);
          
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Notícia atualizada com sucesso!",
        });
      } else {
        // Otherwise insert a new notícia
        const { error } = await supabase
          .from('releases')
          .insert([noticiaData]);
          
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Notícia salva com sucesso!",
        });
      }
      
      // Close the modals
      setIsGeneratedNewsModalOpen(false);
      setIsConfirmSaveModalOpen(false);
      
      // Navigate to news tab on the main releases page
      navigate('/dashboard/comunicacao/releases?tab=news');
      
    } catch (error: any) {
      console.error('Error saving news:', error);
      toast({
        title: "Erro ao salvar notícia",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSavingNews(false);
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreadcrumbBar />
      
      <WelcomeCard
        title={isEditingNoticia ? "Editar Notícia" : releaseId ? "Gerar Notícia a partir de Release" : "Cadastrar Novo Release"}
        description={isEditingNoticia 
          ? "Edite o conteúdo da notícia para publicação." 
          : releaseId 
            ? "Gere uma notícia institucional a partir do release recebido." 
            : "Registre o conteúdo de um release recebido por e-mail."}
        icon={<FileText className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-blue-500 to-blue-600"
      />

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditingNoticia ? "Notícia" : "Release"}</CardTitle>
            <CardDescription>
              {isEditingNoticia 
                ? "Edite o conteúdo da notícia a ser publicada." 
                : releaseId 
                  ? "Release recebido para geração de notícia." 
                  : "Cole o conteúdo do release recebido por e-mail."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : isEditingNoticia ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título da Notícia</Label>
                  <Input
                    id="titulo"
                    value={noticiaContent.titulo}
                    onChange={(e) => setNoticiaContent(prev => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Insira o título da notícia"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="conteudo">Conteúdo da Notícia</Label>
                  <Textarea
                    id="conteudo"
                    value={noticiaContent.conteudo}
                    onChange={(e) => setNoticiaContent(prev => ({ ...prev, conteudo: e.target.value }))}
                    placeholder="Insira o conteúdo da notícia"
                    className="mt-1 min-h-[300px]"
                  />
                </div>
                
                {originalReleaseId && originReleaseContent && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Release Original:</h3>
                    <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-md max-h-[200px] overflow-y-auto">
                      {originReleaseContent}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-6 space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/comunicacao/releases?tab=news')}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => setIsConfirmSaveModalOpen(true)}
                    disabled={!noticiaContent.titulo.trim() || !noticiaContent.conteudo.trim()}
                  >
                    Salvar Notícia
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="conteudo">Conteúdo do Release</Label>
                  <Textarea
                    id="conteudo"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Cole aqui o conteúdo do release recebido por e-mail"
                    className="mt-1 min-h-[400px]"
                    disabled={!!releaseId}
                  />
                </div>
                
                <div className="flex justify-end mt-6 space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/comunicacao/releases')}
                  >
                    Cancelar
                  </Button>
                  
                  {releaseId ? (
                    <Button 
                      onClick={generateNews}
                      disabled={generatingNews}
                    >
                      {generatingNews ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-4 w-4 mr-2" />
                          Gerar Notícia
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={saveRelease}
                      disabled={loading || !content.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Release"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for asking if user wants to generate news */}
      <Dialog open={isAskToGenerateOpen} onOpenChange={setIsAskToGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Notícia?</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            O release foi salvo com sucesso. Deseja gerar uma notícia a partir deste release?
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAskToGenerateOpen(false);
                navigate('/dashboard/comunicacao/releases');
              }}
            >
              Não, ir para listagem
            </Button>
            <Button 
              onClick={generateNews}
              disabled={generatingNews}
            >
              {generatingNews ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Sim, gerar notícia
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for generated news content */}
      <Dialog open={isGeneratedNewsModalOpen} onOpenChange={setIsGeneratedNewsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notícia Gerada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div>
              <Label htmlFor="news-title">Título</Label>
              <Input
                id="news-title"
                value={noticiaContent.titulo}
                onChange={(e) => setNoticiaContent(prev => ({ ...prev, titulo: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="news-content">Conteúdo</Label>
              <Textarea
                id="news-content"
                value={noticiaContent.conteudo}
                onChange={(e) => setNoticiaContent(prev => ({ ...prev, conteudo: e.target.value }))}
                className="mt-1 min-h-[300px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsGeneratedNewsModalOpen(false);
                navigate('/dashboard/comunicacao/releases');
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => setIsConfirmSaveModalOpen(true)}
              disabled={savingNews}
            >
              {savingNews ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Notícia"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for confirmation of saving news */}
      <Dialog open={isConfirmSaveModalOpen} onOpenChange={setIsConfirmSaveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Salvamento</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            {isEditingNoticia 
              ? "Tem certeza que deseja salvar as alterações desta notícia?"
              : "Tem certeza que deseja salvar esta notícia gerada?"}
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmSaveModalOpen(false)}
              disabled={savingNews}
            >
              Cancelar
            </Button>
            <Button 
              onClick={saveNoticia}
              disabled={savingNews}
            >
              {savingNews ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CadastrarRelease;
