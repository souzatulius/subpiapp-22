
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Pencil, Sparkles, Trash2, FileText, Eye } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define Release interface since it's not in Supabase types yet
interface Release {
  id: string;
  tipo: 'release' | 'noticia';
  titulo?: string;
  conteudo: string;
  release_origem_id?: string | null;
  criado_em: string;
  autor_id: string;
}

const ListarReleases = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [releases, setReleases] = useState<Release[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .order('criado_em', { ascending: false }) as any;
      
      if (error) throw error;
      
      setReleases(data || []);
      
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
      
      // Refresh the list
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

  const renderPreview = (content: string): string => {
    // Limit to around 100 characters for preview
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };
  
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
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

      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Lista de Releases e Notícias</h2>
          <Button onClick={() => navigate('/dashboard/comunicacao/cadastrar-release')}>
            Novo Release
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : releases.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">Nenhum release ou notícia encontrado</h3>
            <p className="text-gray-500 mt-2">Cadastre um novo release para começar.</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Tipo</TableHead>
                  <TableHead>Título / Conteúdo</TableHead>
                  <TableHead className="w-[180px]">Data de Criação</TableHead>
                  <TableHead className="text-right w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {releases.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant={item.tipo === 'release' ? 'outline' : 'default'}>
                        {item.tipo === 'release' ? 'Release' : 'Notícia'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        {item.titulo ? (
                          <span className="font-medium">{item.titulo}</span>
                        ) : (
                          <span className="italic text-gray-500">Sem título</span>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {renderPreview(item.conteudo)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {formatDate(item.criado_em)}
                      </span>
                    </TableCell>
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
        )}
      </div>

      {/* Delete Confirmation Dialog */}
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

      {/* View Item Modal */}
      <AlertDialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedRelease?.tipo === 'release' ? 'Release' : 'Notícia'}: {selectedRelease?.titulo || 'Sem título'}
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
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
            {selectedRelease?.tipo === 'release' && !selectedRelease.release_origem_id && (
              <Button onClick={() => {
                setIsViewModalOpen(false);
                handleGenerateNews(selectedRelease);
              }}>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Notícia
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default ListarReleases;
