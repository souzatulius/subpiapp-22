
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import WelcomeCard from '@/components/shared/WelcomeCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Plus, Search, Loader2 } from 'lucide-react';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import ReleasesCards from './components/ReleasesCards';
import NewsCards from './components/NewsCards';
import useDebounce from '@/hooks/useDebounce';

// Define Release interface
interface Release {
  id: string;
  tipo: 'release' | 'noticia';
  titulo?: string;
  conteudo: string;
  release_origem_id?: string | null;
  criado_em: string;
  autor_id: string;
  publicada?: boolean;
}

const ReleasesAndNews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("releases");
  const [releases, setReleases] = useState<Release[]>([]);
  const [news, setNews] = useState<Release[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [releaseSearchTerm, setReleaseSearchTerm] = useState('');
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const debouncedReleaseSearch = useDebounce(releaseSearchTerm, 300);
  const debouncedNewsSearch = useDebounce(newsSearchTerm, 300);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .order('criado_em', { ascending: false }) as any;
      
      if (error) throw error;
      
      const releasesData = data.filter((item: Release) => item.tipo === 'release');
      const newsData = data.filter((item: Release) => item.tipo === 'noticia');
      
      setReleases(releasesData || []);
      setNews(newsData || []);
      
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Ocorreu um erro ao carregar os releases e notícias.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterReleases = () => {
    if (!debouncedReleaseSearch.trim()) return releases;
    
    return releases.filter(release => 
      release.conteudo.toLowerCase().includes(debouncedReleaseSearch.toLowerCase())
    );
  };

  const filterNews = () => {
    if (!debouncedNewsSearch.trim()) return news;
    
    return news.filter(newsItem => 
      (newsItem.titulo?.toLowerCase().includes(debouncedNewsSearch.toLowerCase()) || 
       newsItem.conteudo.toLowerCase().includes(debouncedNewsSearch.toLowerCase()))
    );
  };

  const handleAddNewRelease = () => {
    navigate('/dashboard/comunicacao/cadastrar-release');
  };

  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "dd/MM/yy 'às' HH:mm", { locale: ptBR });
  };

  const handlePublishStatusChange = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from('releases')
        .update({ publicada: published })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state
      setNews(prevNews => 
        prevNews.map(item => 
          item.id === id ? { ...item, publicada: published } : item
        )
      );
      
      toast({
        title: published ? "Notícia marcada como publicada" : "Notícia desmarcada como publicada",
        description: published ? "✓ Notícia marcada como publicada" : "Notícia não está mais marcada como publicada",
      });
      
    } catch (error: any) {
      console.error('Erro ao atualizar status de publicação:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status de publicação.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string, tipo: 'release' | 'noticia') => {
    try {
      const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      if (tipo === 'release') {
        setReleases(prevReleases => prevReleases.filter(item => item.id !== id));
      } else {
        setNews(prevNews => prevNews.filter(item => item.id !== id));
      }
      
      toast({
        title: "Item excluído com sucesso",
        description: `O ${tipo === 'release' ? 'release' : 'notícia'} foi excluído(a) com sucesso.`,
      });
      
    } catch (error: any) {
      console.error('Erro ao excluir item:', error);
      toast({
        title: "Erro ao excluir item",
        description: error.message || "Ocorreu um erro ao excluir o item.",
        variant: "destructive"
      });
    }
  };

  const filteredReleases = filterReleases();
  const filteredNews = filterNews();

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreadcrumbBar />
      
      <WelcomeCard
        title="Releases e Notícias"
        description="Gerencie os releases recebidos e as notícias criadas para publicação"
        icon={<FileText className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-blue-500 to-blue-600"
      />

      <Tabs 
        defaultValue="releases" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="releases">Releases</TabsTrigger>
              <TabsTrigger value="news">Notícias</TabsTrigger>
            </TabsList>
            
            <Button onClick={handleAddNewRelease}>
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === "releases" ? "Novo Release" : "Nova Notícia"}
            </Button>
          </div>

          <TabsContent value="releases" className="mt-0">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar releases..."
                  className="pl-9"
                  value={releaseSearchTerm}
                  onChange={(e) => setReleaseSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Buscando releases...</span>
              </div>
            ) : filteredReleases.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600">
                  {debouncedReleaseSearch 
                    ? "Nenhum release encontrado com esse termo." 
                    : "Nenhum release cadastrado"}
                </h3>
                <p className="text-gray-500 mt-2">
                  {debouncedReleaseSearch 
                    ? "Tente outros termos de busca."
                    : "Clique em 'Novo Release' para começar."}
                </p>
              </div>
            ) : (
              <ReleasesCards 
                releases={filteredReleases}
                formatDate={formatDate}
                onDelete={handleDelete}
                navigateToCreateNews={(releaseId) => 
                  navigate(`/dashboard/comunicacao/cadastrar-release?releaseId=${releaseId}`)
                }
                navigateToViewNews={(newsId) => {
                  setActiveTab("news");
                  // Find the related news and focus on it (could implement this later)
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="news" className="mt-0">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar notícias..."
                  className="pl-9"
                  value={newsSearchTerm}
                  onChange={(e) => setNewsSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Buscando notícias...</span>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600">
                  {debouncedNewsSearch 
                    ? "Nenhuma notícia encontrada com esse termo." 
                    : "Nenhuma notícia cadastrada"}
                </h3>
                <p className="text-gray-500 mt-2">
                  {debouncedNewsSearch 
                    ? "Tente outros termos de busca."
                    : "Gere notícias a partir de releases para começar."}
                </p>
              </div>
            ) : (
              <NewsCards 
                news={filteredNews}
                formatDate={formatDate}
                onDelete={handleDelete}
                onPublishChange={handlePublishStatusChange}
                navigateToEdit={(newsId) => 
                  navigate(`/dashboard/comunicacao/cadastrar-release?noticiaId=${newsId}`)
                }
                navigateToViewRelease={(releaseId) => {
                  setActiveTab("releases");
                  // Find the related release and focus on it (could implement this later)
                }}
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default ReleasesAndNews;
