
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Pencil, ArrowLeftSquare, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

interface News {
  id: string;
  tipo: 'release' | 'noticia';
  titulo?: string;
  conteudo: string;
  release_origem_id?: string | null;
  criado_em: string;
  autor_id: string;
  publicada?: boolean;
}

interface NewsCardsProps {
  news: News[];
  formatDate: (dateString: string) => string;
  onDelete: (id: string, tipo: 'release' | 'noticia') => Promise<void>;
  onPublishChange: (id: string, published: boolean) => Promise<void>;
  navigateToEdit: (newsId: string) => void;
  navigateToViewRelease: (releaseId: string) => void;
}

const NewsCards: React.FC<NewsCardsProps> = ({
  news,
  formatDate,
  onDelete,
  onPublishChange,
  navigateToEdit,
  navigateToViewRelease
}) => {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleView = (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNews) return;
    
    setIsLoading(true);
    try {
      await onDelete(selectedNews.id, 'noticia');
      setIsDeleteDialogOpen(false);
    } finally {
      setIsLoading(false);
      setSelectedNews(null);
    }
  };

  const handlePublishToggle = async (newsItem: News) => {
    await onPublishChange(newsItem.id, !newsItem.publicada);
  };

  const getPreviewContent = (content: string) => {
    // Return first 150 characters
    return content.length > 150 
      ? content.substring(0, 150) + '...' 
      : content;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((newsItem) => (
          <Card key={newsItem.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-medium line-clamp-2">
                {newsItem.titulo || "Sem título"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-4 pt-1">
              <div className="text-xs text-gray-500 mb-2">
                {formatDate(newsItem.criado_em)}
              </div>
              <div className="text-sm text-gray-700 line-clamp-3">
                {getPreviewContent(newsItem.conteudo)}
              </div>
            </CardContent>
            <CardFooter className="p-3 flex flex-col gap-2">
              <div className="flex justify-between items-center w-full">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleView(newsItem)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigateToEdit(newsItem.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(newsItem)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <span className="text-xs mr-2">Publicada:</span>
                  <Switch 
                    checked={!!newsItem.publicada} 
                    onCheckedChange={() => handlePublishToggle(newsItem)}
                  />
                </div>
              </div>
              
              {newsItem.release_origem_id && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-1" 
                  onClick={() => navigateToViewRelease(newsItem.release_origem_id as string)}
                >
                  <ArrowLeftSquare className="h-4 w-4 mr-2" />
                  Ver Release de Origem
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      {selectedNews && (
        <AlertDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedNews.titulo || "Sem título"}
              </AlertDialogTitle>
              <div className="text-sm text-gray-500 mb-2">
                Criada em: {selectedNews.criado_em ? formatDate(selectedNews.criado_em) : '-'}
              </div>
            </AlertDialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="p-2 whitespace-pre-wrap">
                {selectedNews.conteudo}
              </div>
            </ScrollArea>
            <AlertDialogFooter className="flex justify-between">
              <div className="flex items-center">
                <span className="text-sm mr-2">Marcar como publicada:</span>
                <Switch
                  checked={!!selectedNews.publicada}
                  onCheckedChange={() => {
                    onPublishChange(selectedNews.id, !selectedNews.publicada);
                    setSelectedNews(prev => prev ? {...prev, publicada: !prev.publicada} : null);
                  }}
                />
              </div>
              <div className="flex gap-2">
                {selectedNews.release_origem_id && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      navigateToViewRelease(selectedNews.release_origem_id as string);
                    }}
                  >
                    <ArrowLeftSquare className="h-4 w-4 mr-2" />
                    Ver Release
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    navigateToEdit(selectedNews.id);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <AlertDialogCancel>Fechar</AlertDialogCancel>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedNews && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
              <Button 
                onClick={confirmDelete} 
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoading ? "Excluindo..." : "Excluir"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default NewsCards;
