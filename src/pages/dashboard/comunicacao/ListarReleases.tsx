import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Loader2, 
  Pencil, 
  Sparkles, 
  Trash2, 
  FileText, 
  Eye, 
  Layout, 
  List, 
  Check, 
  Search, 
  X,
  Link
} from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatDateTime } from '@/lib/utils';

interface Release {
  id: string;
  tipo: 'release' | 'noticia';
  titulo?: string;
  conteudo: string;
  release_origem_id?: string | null;
  criado_em: string;
  autor_id: string;
  publicada?: boolean;
  atualizado_em?: string;
}

const ListarReleases = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState<Release[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [noticias, setNoticias] = useState<Release[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("noticias");
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('card');
  const [searchReleases, setSearchReleases] = useState('');
  const [searchNoticias, setSearchNoticias] = useState('');
  const [filteredReleases, setFilteredReleases] = useState<Release[]>([]);
  const [filteredNoticias, setFilteredNoticias] = useState<Release[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [relatedRelease, setRelatedRelease] = useState<Release | null>(null);
  const [isRelatedReleaseModalOpen, setIsRelatedReleaseModalOpen] = useState(false);

  useEffect(() => {
    fetchReleases();
    
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'releases' || tab === 'noticias') {
      setActiveTab(tab);
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('tab', activeTab);
    const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
    history.pushState(null, '', newRelativePathQuery);
  }, [activeTab]);

  useEffect(() => {
    if (allItems.length > 0) {
      const releasesItems = allItems.filter(item => item.tipo === 'release');
      const noticiasItems = allItems.filter(item => item.tipo === 'noticia');
      
      setReleases(releasesItems);
      setNoticias(noticiasItems);
      setFilteredReleases(releasesItems);
      setFilteredNoticias(noticiasItems);
    }
  }, [allItems]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const searchTerm = searchReleases.toLowerCase().trim();
      if (searchTerm) {
        setIsSearching(true);
        const filtered = releases.filter(item => 
          (item.titulo?.toLowerCase().includes(searchTerm) || 
          item.conteudo.toLowerCase().includes(searchTerm))
        );
        setFilteredReleases(filtered);
      } else {
        setFilteredReleases(releases);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchReleases, releases]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const searchTerm = searchNoticias.toLowerCase().trim();
      if (searchTerm) {
        setIsSearching(true);
        const filtered = noticias.filter(item => 
          (item.titulo?.toLowerCase().includes(searchTerm) || 
          item.conteudo.toLowerCase().includes(searchTerm))
        );
        setFilteredNoticias(filtered);
      } else {
        setFilteredNoticias(noticias);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchNoticias, noticias]);

  const fetchReleases = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .order('criado_em', { ascending: false }) as any;
      
      if (error) throw error;
      
      setAllItems(data || []);
      
    } catch (error: any) {
      console.error('Erro ao carregar releases:', error);
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Ocorreu um erro ao carregar os releases e notícias.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNews = (release: Release) => {
    navigate(`/dashboard/comunicacao/cadastrar-release?releaseId=${release.id}`);
  };

  const handleEditNews = (news: Release) => {
    navigate(`/dashboard/comunicacao/cadastrar-release?noticiaId=${news.id}`);
  };

  const handleViewItem = (item: Release) => {
    setSelectedRelease(item);
    setIsViewModalOpen(true);
  };

  const handleDeleteItem = (item: Release) => {
    setSelectedRelease(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRelease) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', selectedRelease.id) as any;
      
      if (error) throw error;
      
      toast({
        title: "Item excluído com sucesso",
        description: `O ${selectedRelease.tipo === 'release' ? 'release' : 'notícia'} foi excluído(a) com sucesso.`,
      });
      
      fetchReleases();
      
    } catch (error: any) {
      console.error('Erro ao excluir item:', error);
      toast({
        title: "Erro ao excluir item",
        description: error.message || "Ocorreu um erro ao excluir o item.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedRelease(null);
    }
  };

  const markAsPublished = async (noticia: Release) => {
    try {
      const { error } = await supabase
        .from('releases')
        .update({ 
          publicada: !noticia.publicada,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', noticia.id);
      
      if (error) throw error;
      
      toast({
        title: noticia.publicada ? "Notícia desmarcada" : "Notícia marcada como publicada",
        description: noticia.publicada 
          ? "A notícia foi desmarcada como publicada." 
          : "A notícia foi marcada como publicada com sucesso.",
      });
      
      fetchReleases();
      
    } catch (error: any) {
      console.error('Erro ao atualizar status da notícia:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status da notícia.",
        variant: "destructive"
      });
    }
  };

  const handleViewRelatedRelease = async (noticiaId: string) => {
    try {
      setIsLoading(true);
      
      const { data: noticia, error: noticiaError } = await supabase
        .from('releases')
        .select('release_origem_id')
        .eq('id', noticiaId)
        .single() as any;
      
      if (noticiaError) throw noticiaError;
      
      if (noticia?.release_origem_id) {
        const { data: release, error: releaseError } = await supabase
          .from('releases')
          .select('*')
          .eq('id', noticia.release_origem_id)
          .single() as any;
        
        if (releaseError) throw releaseError;
        
        if (release) {
          setRelatedRelease(release);
          setIsRelatedReleaseModalOpen(true);
        } else {
          toast({
            title: "Release não encontrado",
            description: "O release original associado a esta notícia não foi encontrado.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Sem release associado",
          description: "Esta notícia não tem um release associado.",
          variant: "destructive"
        });
      }
      
    } catch (error: any) {
      console.error('Erro ao buscar release relacionado:', error);
      toast({
        title: "Erro ao buscar release",
        description: error.message || "Ocorreu um erro ao buscar o release associado.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = (content: string): string => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  const formatDate = (dateString: string): string => {
    return formatDateTime(dateString);
  };

  const renderCardView = (items: Release[], isNoticia: boolean = false) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            {isSearching 
              ? "Buscando..." 
              : (searchNoticias || searchReleases) 
                ? "Nenhum item encontrado com esse termo." 
                : `Nenhum ${isNoticia ? 'notícia' : 'release'} encontrado`
            }
          </h3>
          <p className="text-gray-500 mt-2">
            {!isSearching && !searchNoticias && !searchReleases && "Cadastre um novo item para começar."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden group relative">
            <CardContent className="p-4">
              <div className="mb-2">
                <Badge variant={item.tipo === 'release' ? 'outline' : 't'} className="mb-2">
                  {item.tipo === 'release' ? 'Release' : 'Notícia'}
                </Badge>
              </div>
              
              {item.tipo === 'noticia' && (
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                  {item.titulo || <span className="italic text-gray-500">Sem título</span>}
                </h3>
              )}
              
              <p className="text-sm text-gray-500 mb-3 line-clamp-3">
                {renderPreview(item.conteudo)}
              </p>
              
              <div className="text-xs text-gray-400 mt-2">
                {formatDate(item.criado_em)}
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white shadow-sm" onClick={() => handleViewItem(item)}>
                  <Eye className="h-4 w-4" />
                </Button>
                
                {isNoticia ? (
                  <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white shadow-sm" onClick={() => handleEditNews(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                ) : (
                  !item.release_origem_id && (
                    <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white shadow-sm" onClick={() => handleGenerateNews(item)}>
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  )
                )}
                
                <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white shadow-sm text-red-500 hover:text-red-600" onClick={() => handleDeleteItem(item)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {isNoticia && (
                <div className="absolute bottom-4 right-4">
                  <Badge 
                    variant={item.publicada ? "success" : "warning"} 
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => markAsPublished(item)}
                  >
                    {item.publicada ? (
                      <>
                        <Check className="h-3 w-3 mr-1" /> Publicada
                      </>
                    ) : (
                      <>
                        Não publicada
                      </>
                    )}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderListView = (items: Release[], isNoticia: boolean = false) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            {isSearching 
              ? "Buscando..." 
              : (searchNoticias || searchReleases) 
                ? "Nenhum item encontrado com esse termo." 
                : `Nenhum ${isNoticia ? 'notícia' : 'release'} encontrado`
            }
          </h3>
          <p className="text-gray-500 mt-2">
            {!isSearching && !searchNoticias && !searchReleases && "Cadastre um novo item para começar."}
          </p>
        </div>
      );
    }

    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Tipo</TableHead>
              {isNoticia && <TableHead>Título</TableHead>}
              <TableHead>Conteúdo</TableHead>
              <TableHead className="w-[120px]">Data</TableHead>
              {isNoticia && <TableHead className="w-[120px]">Status</TableHead>}
              <TableHead className="text-right w-[150px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Badge variant={item.tipo === 'release' ? 'outline' : 'default'}>
                    {item.tipo === 'release' ? 'Release' : 'Notícia'}
                  </Badge>
                </TableCell>
                {isNoticia && (
                  <TableCell>
                    {item.titulo ? (
                      <span className="font-medium">{item.titulo}</span>
                    ) : (
                      <span className="italic text-gray-500">Sem título</span>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <p className="text-sm text-gray-500">
                    {renderPreview(item.conteudo)}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {formatDate(item.criado_em)}
                  </span>
                </TableCell>
                {isNoticia && (
                  <TableCell>
                    <Badge 
                      variant={item.publicada ? "success" : "warning"} 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => markAsPublished(item)}
                    >
                      {item.publicada ? (
                        <>
                          <Check className="h-3 w-3 mr-1" /> Publicada
                        </>
                      ) : (
                        <>
                          Não publicada
                        </>
                      )}
                    </Badge>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewItem(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {item.tipo === 'release' && !item.release_origem_id && (
                      <Button variant="ghost" size="sm" onClick={() => handleGenerateNews(item)}>
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {item.tipo === 'noticia' && (
                      <Button variant="ghost" size="sm" onClick={() => handleEditNews(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderSearchInput = (placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onClear: () => void) => {
    return (
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {value && (
          <button 
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeCard
        title="Releases e Notícias"
        description="Gerencie os releases recebidos e as notícias criadas"
        icon={<FileText className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-blue-500 to-blue-600"
      />

      <div className="mt-5">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="noticias">Notícias</TabsTrigger>
              <TabsTrigger value="releases">Releases</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-muted rounded-md p-1">
                <Button 
                  variant={viewMode === 'card' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="px-3"
                >
                  <Layout className="h-4 w-4 mr-1" />
                  Cards
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="h-4 w-4 mr-1" />
                  Lista
                </Button>
              </div>
              <Button onClick={() => navigate('/dashboard/comunicacao/cadastrar-release')}>
                {activeTab === 'noticias' ? "Nova Notícia" : "Novo Release"}
              </Button>
            </div>
          </div>

          <TabsContent value="noticias" className="mt-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              {renderSearchInput(
                "Buscar notícias...", 
                searchNoticias, 
                (e) => setSearchNoticias(e.target.value),
                () => setSearchNoticias('')
              )}
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                viewMode === 'card' 
                  ? renderCardView(filteredNoticias, true) 
                  : renderListView(filteredNoticias, true)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="releases" className="mt-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              {renderSearchInput(
                "Buscar releases...", 
                searchReleases, 
                (e) => setSearchReleases(e.target.value),
                () => setSearchReleases('')
              )}
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                viewMode === 'card' 
                  ? renderCardView(filteredReleases) 
                  : renderListView(filteredReleases)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este {selectedRelease?.tipo === 'release' ? 'release' : 'notícia'}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between items-start">
              <div>
                {selectedRelease?.tipo === 'release' ? 'Release' : 'Notícia'}: {selectedRelease?.tipo === 'noticia' ? (selectedRelease?.titulo || 'Sem título') : ''}
              </div>
              {selectedRelease?.tipo === 'noticia' && (
                <Badge 
                  variant={selectedRelease?.publicada ? "success" : "warning"} 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    if (selectedRelease) markAsPublished(selectedRelease);
                  }}
                >
                  {selectedRelease?.publicada ? (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Publicada
                    </>
                  ) : (
                    <>
                      Não publicada
                    </>
                  )}
                </Badge>
              )}
            </AlertDialogTitle>
            <div className="text-sm text-gray-500 mb-2">
              Criado em: {selectedRelease?.criado_em ? formatDate(selectedRelease.criado_em) : '-'}
            </div>
          </AlertDialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4 whitespace-pre-wrap">
              {selectedRelease?.conteudo}
            </div>
          </ScrollArea>
          <AlertDialogFooter className="flex justify-between sm:justify-between">
            <div>
              {selectedRelease?.tipo === 'noticia' && selectedRelease.release_origem_id && (
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    handleViewRelatedRelease(selectedRelease.id);
                  }}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Ver Release Original
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <AlertDialogCancel>Fechar</AlertDialogCancel>
              {selectedRelease?.tipo === 'release' && !selectedRelease.release_origem_id && (
                <Button onClick={() => {
                  setIsViewModalOpen(false);
                  handleGenerateNews(selectedRelease);
                }}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Criar Notícia
                </Button>
              )}
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isRelatedReleaseModalOpen} onOpenChange={setIsRelatedReleaseModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Release Original</DialogTitle>
            <DialogDescription>
              Conteúdo do release que originou a notícia.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4 whitespace-pre-wrap border rounded-md bg-gray-50">
              {relatedRelease?.conteudo}
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <div className="text-sm text-gray-500 mr-auto">
              Criado em: {relatedRelease?.criado_em ? formatDate(relatedRelease.criado_em) : '-'}
            </div>
            <Button onClick={() => setIsRelatedReleaseModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ListarReleases;
